<template>
  <el-form
    v-if="hasForm"
    ref="form"
    class="form"
    :model="formData"
    v-bind="mixAttrs"
  >
    <template
      v-for="{ events, type, visible = true, rules, ...rest } in formOp"
    >
      <el-form-item
        v-if="setVisible(visible)"
        :key="rest.prop"
        class="mark"
        :rules="rules"
        v-bind="rest"
      >
        <component
          :is="getComponentType(type, rest)"
          v-model="formData[rest.prop]"
          v-bind="rest"
          v-on="events"
        />
      </el-form-item>
    </template>
  </el-form>
</template>

<script>
// 默认配置
const defaultConfig = {
  'label-width': '100px',
  'label-position': 'left'
}

import Input from '../formItem/input'
import Select from '../formItem/select'
import Checkbox from '../formItem/checkbox'
import Upload from '../formItem/upload'
import Radio from '../formItem/radio'
import InputTag from '../formItem/input-tag'
export default {
  name: 'Form',
  components: {
    tenInput: Input,
    tenSelect: Select,
    tenCheckbox: Checkbox,
    tenUpload: Upload,
    tenRadio: Radio,
    tenInputTag: InputTag
  },
  inheritAttrs: false,
  props: {
    title: {
      type: String,
      default: '标题'
    },
    formOp: {
      type: Array,
      default: () => []
    },
    formData: {
      type: Object,
      default: () => {}
    },
    attrs: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    hasForm() {
      return Array.isArray(this.formOp) && this.formOp.length > 0
    },
    mixAttrs() {
      return { ...defaultConfig, ...this.attrs }
    }
  },
  methods: {
    setVisible(v) {
      if (typeof v === 'function') {
        return v()
      }
      return v
    },
    // 组件类型
    getComponentType(type, op) {
      if (type === 'asyncComponent') {
        const { loader } = op
        if (typeof loader().then !== 'function') {
          throw new Error('loader must be a component')
        }
        return loader
      }
      // 根据是否 是el 来判断是否是 element自带的表单组件
      return type.startsWith('el-') ? type : `ten-${type}`
    },
    // 重置校验信息
    resetValidFormAuth() {
      this.$refs['form'].clearValidate()
    },
    // 触发校验
    async validate() {
      await this.$refs['form'].validate()
    },
    // 取消
    cancel() {
      this.$emit('change', false)
    }
  }
}
</script>
<style lang="scss">

  .form .el-form-item{
    margin-bottom: 15px!important;
  }
  .mark .el-form-item__label {
    position: relative;
    &::before {
      position: absolute;
      left: -10%;
      top: 50%;
      transform: translateY(-50%);
    }
  }
</style>
<style lang="scss" scoped>
</style>
