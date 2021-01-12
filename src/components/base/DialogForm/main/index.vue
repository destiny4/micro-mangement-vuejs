<template>

  <el-dialog
    class="dialog-form"
    :title="title"
    :visible.sync="dialogVisible"
    width="30%"
    @close="onClose"
    @closed="onClosed"
    @open="onOpen"
  >
    <section class="form">
      <Form
        ref="form"
        v-bind="{
          formOp:formDialogOp,
          formData:formData
        }"
      />
    </section>
    <section class="slot">
      <slot />
    </section>
    <span slot="footer" class="dialog-footer">
      <el-button size="mini" @click="cancel">取 消</el-button>
      <el-button type="primary" size="mini" @click="submit">确 定</el-button>
    </span>
  </el-dialog>

</template>

<script>
export default {
  name: 'DialogForm',
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
    formDialogOp: {
      type: Array,
      default: () => []
    },
    formData: {
      type: Object,
      default: () => {}
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
    },
    hasForm() {
      return Array.isArray(this.formDialogOp) && this.formDialogOp.length > 0
    }
  },
  methods: {
    onClose() {
      this.$emit('close')
    },
    onOpen() {
      this.$nextTick(() => {
        this.resetValidFormAuth()
      })
    },
    onClosed() {
      // 避免弹窗在关闭的时候 出现 数据填充异常
      this.resetValidFormAuth()
    },
    // 重置校验信息
    resetValidFormAuth() {
      this.$refs['form'].resetValidFormAuth()
    },
    // 取消
    cancel() {
      this.$emit('change', false)
    },
    // 提交
    async submit() {
      // 校验
      await this.$refs['form'].validate()
      this.$emit('submit', this.formData)
    }
  }
}
</script>

<style lang="scss">

.dialog-form .el-dialog__body{
  padding: 0 20px;
}

</style>
