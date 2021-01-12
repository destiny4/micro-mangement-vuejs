<template>
  <div>
    <!--  table区域 -->
    <el-table
      ref="table"
      v-loading="loading"
      v-bind="attrs"
      :style="tableStyle"
      :data="tableOp.data"
      :row-key="treeOp.rowKey"
      :tree-props="treeOp"
      tooltip-effect="dark"
      @selection-change="handleSelectionChange"
    >

      <el-table-column
        v-if="indexable"
        type="index"
        width="50"
        label="序号"
        align="center"
      />

      <el-table-column
        v-if="selectable"
        type="selection"
        width="55"
        align="center"
      />

      <template v-for="(it) in columns">
        <el-table-column :key="it.props" v-bind="it">
          <template v-slot="{row}">
            <tabel-item :row="row" :op="it" />
          </template>
        </el-table-column>
      </template>>
    </el-table>
  </div>
</template>

<script>
const DefaultOption = {
  fit: true,
  border: true
}
import TabelItem from './table-item'
export default {
  name: 'QueryTable',
  components: {
    TabelItem
  },
  props: {
    loading: {
      // loading 显示
      type: Boolean,
      default: false
    },
    tableOp: {
      type: Object,
      required: true
    }
  },
  computed: {
    attrs() {
      const { attrs = DefaultOption } = this.tableOp
      return attrs
    },
    treeOp() {
      return this.tableOp.treeOp || { children: 'children', hasChildren: 'hasChildren', rowKey: 'id' }
    },
    total() {
      return 40
    },
    tableStyle() {
      return { 'width': '100%', 'max-height': '700px', 'overflow': 'auto' }
    },
    columns() {
      return this.tableOp.columns
    },
    selectable() {
      const { selectable = false } = this.tableOp
      return selectable
    },
    indexable() {
      const { indexable = false } = this.tableOp
      return indexable
    },
    defaultSelected() {
      return this.tableOp.defaultSelected || []
    }
  },
  mounted() {
    console.log(this.tableOp)
    this.handleDetaultSelect()
  },

  methods: {
    handleSelectionChange(val) {
      this.$emit('selection-change', val)
    },
    // 处理默认选中
    handleDetaultSelect() {
      this.defaultSelected.map(row => {
        this.$refs['table'].toggleRowSelection(row)
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
