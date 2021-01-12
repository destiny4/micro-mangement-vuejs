<template>
  <div class="container">
    <el-input
      v-model="inputVal"
      v-bind="mixAttrs"
      clearable
      :placeholder="placeholder"
      @keyup.enter.native="setTag"
    >

      <i
        slot="suffix"
        class="el-input__icon el-icon-edit icon"
        title="点击添加标签"
        @click="setTag"
      />

    </el-input>
    <section class="tag">
      <template v-for="it in value">
        <el-tag
          :key="it"
          closable
          class="tag"
          @close="deleteTag(it)"
        >{{ it }}</el-tag>
      </template>
    </section>
  </div>
</template>

<script>
export default {
  name: 'InputTag',
  inheritAttrs: false,
  props: {
    value: {
      type: Array,
      default: () => []
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
  data() {
    return {
      inputVal: ''
    }
  },
  computed: {
    mixAttrs() {
      return { ...this.$attrs, ...this.attrs }
    },
    prefix() {
      const { prefix = '' } = this.mixAttrs
      return prefix
    },
    placeholder() {
      return this.$attrs.placeholder || `请输入${this.$attrs.label}`
    }
  },
  mounted() {
    console.log(this.$listeners)
  },
  methods: {
    handleResult(v) {
      const prefix = this.prefix
      if (prefix.length !== 0) {
        return `${prefix}${v}`
      }
      return v
    },
    setTag() {
      console.log(this.prefix)
      const v = this.inputVal + ''
      const res = this.handleResult(v)
      if (this.value.includes(res) || v.length === 0) return
      this.$emit('input', [...this.value, res])
    },
    deleteTag(val) {
      const data = this.value.filter(it => val !== it)
      this.$emit('input', data)
    }
  }
}
</script>

<style lang="scss" scoped>
.icon{
cursor: pointer;
color:#409eff;
}
.tag{
  margin-right: 10px;
}
</style>
