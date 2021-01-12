<template>
  <div class="pannel">
    <header>
      <Query
        v-model="queryState"
        :form-op="queryOp.formOp"
        :button-op="queryOp.buttonOp"
        @query="query"
        @clear="clear"
      >
        <template>
          <el-button icon="el-icon-refresh" size="mini" @click="refresh" />
          <el-button icon="el-icon-setting" size="mini" @click="setHeaders" />
        </template>
      </Query>
    </header>
    <main class="main">
      <Tabel
        :loading="innerTableOp.loading"
        :table-op="innerTableOp"
        @selection-change="handleSelectionChange"
      />
    </main>
    <footer>
      <Pagination
        v-show="innerPaginationOp.total>0"
        :total="innerPaginationOp.total"
        :page.sync="innerPaginationOp.page"
        :limit.sync="innerPaginationOp.limit"
        @pagination="onPagination"
      >
        <el-button size="mini" @click="handleDownload">下载</el-button>
        <el-button type="danger" size="mini" @click="$emit('batch-delete',selectedData)">批量删除</el-button>
      </Pagination>
    </footer>

    <!-- 动态表头 -->

    <el-dialog
      title="动态表头"
      :visible.sync="headerDialogOp.visible"
      width="60%"
      custom-class="custom-dialog"
    >
      <Tabel
        :loading="innerTableOp.loading"
        :table-op="headerDialogOp.tableOp"
        @selection-change="headerSelectionChange"
      />

      <span slot="footer" class="dialog-footer">
        <el-button @click="headerDialogOp.visible = false">取 消</el-button>
        <el-button type="primary" @click="updateHeaderConfig">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import createStore, { mutations, state, actions } from './state'
import { ArrayToObject } from '@/utils/base'
import Query from '../query/index'
import Tabel from '../table/index'
import Pagination from '../pagination/index'
export default {
  name: 'Panel',
  components: {
    Query,
    Tabel,
    Pagination
  },
  props: {
    // Api 配置
    apiOp: {
      type: Object,
      default: () => {}
    },
    // 查询头 配置
    queryOp: {
      type: Object,
      default: () => {}
    },
    // table 配置
    tableOp: {
      type: Object,
      required: true
    },
    // 分页配置
    paginationLimit: {
      type: Number,
      default: 20
    }
  },
  data() {
    return {
      // 备份 表格的columns 配置 ，用于 updateHeaderConfig
      backupColumns: [],
      // 记录 选中了的表头
      selectedData: [],
      headerDialogOp: {
        title: '新增',
        visible: false,
        tableOp: {
          loading: false,
          data: [],
          selectable: true,
          defaultSelected: [],
          indexable: true,
          columns: [
            {
              type: 'normal',
              label: '属性',
              prop: 'prop',
              align: 'center'
            },
            {
              type: 'input',
              label: '列名',
              prop: 'columnName',
              align: 'center'
            }, {
              type: 'input',
              label: '最小宽度',
              prop: 'minWidth',
              align: 'center'
            }
          ]
        }
      }
    }
  },
  computed: {
    innerTableOp() {
      // 合并 table的数据
      return { ...this.tableOp, loading: state.loading, data: state.list }
    },
    excelOp() {
      const exportableC = this.tableOp.columns.filter(it => it.exportable !== false)
      return {
        name: this.tableOp.excelName || 'excel',
        bookType: this.tableOp.bookType || 'xlsx',
        tHeader: exportableC.map(it => it.label),
        filterVal: exportableC.map(it => it.prop)
      }
    },
    innerPaginationOp() {
      return state.paginationOp
    },
    // 查询头状态
    queryState() {
      return state.queryState
    }
  },
  created() {
    createStore()
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      // 用于动态 显示表头
      this.backupColumns = [...this.tableOp.columns]
      // 初始化 query 和 分页组件的 状态
      this.initialState()
      // 获取列表
      this.initialList()
      // 生产header 配置表格
      this.initialHeaderConfig()
    },
    /* -- 动态表头逻辑 -- */

    // 初始化 动态表头设置
    initialHeaderConfig() {
      // 获取 tableOp的 column 配置
      const { columns } = this.tableOp
      this.headerDialogOp.tableOp.data = columns.map(it => {
        const temp = { prop: it.prop, columnName: it.label, minWidth: '' }
        // 添加默认选中
        return temp
      })
      this.headerDialogOp.tableOp.defaultSelected = [...this.headerDialogOp.tableOp.data]
    },
    // 重新设置 需要显示的表头数据
    headerSelectionChange(v) {
      // 设置 选中的数据
      this.selectedData = v
      // 设置 默认选中
      this.headerDialogOp.tableOp.defaultSelected = v
    },
    // 更新 表格显示字段
    updateHeaderConfig() {
      // 得到 需要显示字段的数组 [prop]
      const selectArr = this.selectedData.map(it => it.prop)
      // 筛选 显示的字段
      this.tableOp.columns = this.backupColumns.filter(it => {
        return selectArr.includes(it.prop)
      })
      // 重新设置 字段
      this.selectedData.map(it => {
        const row = this.tableOp.columns.find(_it => _it.prop === it.prop)
        row.label = it.columnName
        row.width = it.minWidth
      })
      // 关闭 弹窗
      this.headerDialogOp.visible = false
    },
    /* -- 组件状态获取 设置 -- */
    getQueryState() {
      return this.queryState
    },
    setQueryState(v) {
      mutations.SET_QUERYSTATE({ type: 'add', payload: { ...v }})
    },
    setIsQuery(v) {
      mutations.SET_ISQUERY({ payload: v })
    },
    updateListOp(v) {
      mutations.SET_LISTOP(v)
    },
    /* --表格逻辑处理 -- */

    initialState() {
      const state = ArrayToObject(this.queryOp.formOp, ['prop'])
      mutations.SET_QUERYSTATE({ type: 'add', payload: { ...state }})
      mutations.SET_PAGINATIONOP({ type: 'limit', payload: this.paginationLimit })
    },
    initialList() {
      // 初始化 请求配置
      mutations.SET_LISTOP(this.apiOp)
      // 请求 表格数据
      actions.setList()
    },
    // 分页参数改变的时候 触发
    onPagination({ page = 1, limit = 10 } = {}) {
      mutations.SET_PAGINATIONOP({ type: 'page', payload: page })
      mutations.SET_PAGINATIONOP({ type: 'limit', payload: limit })
      actions.setList()
    },
    query() {
      mutations.SET_ISQUERY({ payload: true })
      // 获取列表
      actions.setList()
    },
    clear() {
      // 清空查询条件
      mutations.SET_ISQUERY({ payload: false })
      mutations.SET_QUERYSTATE({ type: 'reset' })
      // 重新获取列表
      actions.setList()
    },
    refresh() {
      // 请求 表格数据
      actions.setList()
    },
    // 处理 选中
    handleSelectionChange(val) {
      this.selectedData = val
      this.$emit('select', val)
    },
    // 处理下载表格数据
    handleDownload() {
      console.log(this.excelOp)
      import('../utils/exportToExcel').then(excel => {
        const tHeader = this.excelOp.tHeader
        const filterVal = this.excelOp.filterVal
        const list = state.list
        const data = excel.formatJson(filterVal, list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: this.excelOp.name,
          autoWidth: true,
          bookType: this.excelOp.bookType
        })
      })
    },
    // 动态表头
    setHeaders() {
      this.headerDialogOp.visible = true
    }
  }
}
</script>

<style lang="scss" scoped>
.main{
  margin-top: 10px;
}
</style>
