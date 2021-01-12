<template>
  <el-select
    v-model="model"
    v-bind="$attrs"
    filterable
    clearable
    :placeholder="placeholder"
    v-on="$listeners"
  >
    <el-option v-for="it in selectArr" :key="it.value" :label="it.label" :value="it.value" />
  </el-select>
</template>

<script>
export default {
  name: 'Select',
  inheritAttrs: false,
  props: {
    value: {
      type: [String, Array],
      default: ''
    }
  },
  data() {
    return {
      selectArr: []
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
    placeholder() {
      return this.$attrs.placeholder || `请输入${this.$attrs.label}`
    }
  },
  mounted() {
    this.setSelectArr()
  },
  methods: {
    async setSelectArr() {
      const selectArr = this.$attrs.selectArr
      if (typeof selectArr === 'function') {
        this.selectArr = await selectArr()
      } else {
        this.selectArr = selectArr
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.el-select{
  width:100%;
}
</style>
