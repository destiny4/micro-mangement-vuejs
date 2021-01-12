<template>
  <el-dialog
    class="dialog-tree"
    :title="title"
    :visible.sync="visible"
    width="30%"
    @close="onClose"
  >
    <section class="tree">
      <!-- 选中信息 -->
      <div class="tree-info">
        <el-tag>当前选中:</el-tag>
      </div>
      <el-tree
        ref="tree"
        :data="data"
        show-checkbox
        :node-key="treeConfig.nodeKey"
        :node-click="handleNodeClick"
        :props="treeConfig.defaultProps"
      />
    </section>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </span>
  </el-dialog>

</template>

<script>
export default {
  name: 'DialogTree',
  inheritAttrs: false,
  model: {
    prop: 'visible',
    event: 'change'
  },
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    title: {
      type: String,
      default: '标题'
    },
    treeData: {
      type: [Array, Function],
      required: true
    },
    treeConfig: {
      type: Object,
      default: () => ({
        nodeKey: 'id',
        defaultProps: {
          children: 'children',
          label: 'label'
        }
      })
    }
  },
  data() {
    return {
      data: [],
      value: ''
    }
  },
  computed: {
    dialogVisible: {
      get() {
        return this.visible
      },
      set(val) {
        this.cancel()
        return val
      }
    }
  },
  mounted() {
    // todo 组件销毁了 但是不会重新执行mount钩子
    this.init()
  },
  methods: {
    async init() {
      // eslint-disable-next-line no-unused-vars
      let temp
      if (typeof this.treeData === 'function') {
        temp = await this.treeData()
      } else {
        temp = this.treeData
      }
      this.data = this.getChildren(temp)
      console.log(this.data)
    },
    onClose() {
      this.$emit('close')
    },
    // 取消
    cancel() {
      this.$emit('change', false)
    },
    // 提交
    submit() {
      // 获取选中数据
      const selected = this.$refs.tree.getCheckedNodes()
      this.$emit('submit', selected)
    },
    // 获取选中数据
    handleNodeClick(data) {
      console.log(data)
    },
    // 组装table数据
    getChildren(children) {
      const _this = this
      const arr = []
      children.forEach(item => {
        const tmp = { children: [] }
        Object.keys(item.info).forEach(key => {
          tmp[key] = item.info[key]
        })
        tmp.parent_menu_name = item.parent_menu_name
        if (item.info.menu_id > _this.maxMenuId) _this.maxMenuId = item.info.menu_id
        if (item.child_list.length > 0) {
          tmp.children = (_this.getChildren(item.child_list))
        }
        arr.push(tmp)
      })
      return arr
    }
  }
}
</script>

<style lang="scss">
.dialog-tree .el-dialog__body{
  padding: 0 20px;
}
</style>
<style lang="scss" scoped>

</style>
