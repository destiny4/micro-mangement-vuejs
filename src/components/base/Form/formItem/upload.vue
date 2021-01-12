<template>
  <div class="upload">
    <Upload
      v-model="model"
      v-bind="$attrs"
    >
      <template #tips>
        <span
          class="tips"
        >{{ tips }}</span>
      </template>
    </Upload>
  </div>
</template>

<script>
export default {
  name: 'FormUpload',
  inheritAttrs: false,
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  computed: {
    tips() {
      const { attrs } = this.$attrs
      return attrs.tips
    },
    model: {
      get() {
        return this.value
      },
      set(v) {
        this.$emit('input', v)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .upload {
    width: 100%;
  }
 .tips {
      font-size: 12px;
      color: #888;
      line-height: 1em;
  }
</style>
