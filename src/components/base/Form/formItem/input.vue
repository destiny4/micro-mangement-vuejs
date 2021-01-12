<template>
  <el-input
    v-model="model"
    v-bind="mixAttrs"
    clearable
    :placeholder="placeholder"
    v-on="$listeners"
  >
    <template v-if="prepend" #prepend>{{ prependContent || 'prepend' }}</template>
  </el-input>
</template>

<script>
export default {
  name: 'Input',
  inheritAttrs: false,
  props: {
    value: {
      type: String,
      default: ''
    },
    prepend: {
      type: Boolean,
      default: false
    },
    prependContent: {
      type: String,
      default: ''
    },
    attrs: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    model: {
      get() {
        return this.value
      },
      set(v) {
        this.$emit('input', v)
      }
    },
    mixAttrs() {
      return { ...this.$attrs, ...this.attrs }
    },
    placeholder() {
      return this.$attrs.placeholder || `请输入${this.$attrs.label}`
    }
  }
}
</script>
