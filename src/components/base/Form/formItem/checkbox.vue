<template>
  <div class="checkbox">
    <el-checkbox-group v-if="list.length > 0" v-model="model">
      <el-checkbox
        v-for="it in list"
        :key="it.value"
        :label="it.value"
        :name="it.value"
      >
        {{ it.label }}
      </el-checkbox>
    </el-checkbox-group>
    <span v-else>
      暂无数据
    </span>
  </div>
</template>

<script>
export default {
  name: 'Checkbox',
  inheritAttrs: false,
  props: {
    value: {
      type: [String, Array],
      default: ''
    },
    selectArr: {
      type: [Promise, Function, Array],
      required: true
    }
  },
  data() {
    return {
      list: []
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
    }
  },
  watch: {
    selectArr() {
      this.setSelectArr()
    }
  },
  mounted() {
    this.setSelectArr()
  },
  methods: {
    async setSelectArr() {
      const selectArr = this.selectArr
      if (typeof selectArr === 'function') {
        this.list = await selectArr()
        // 是promise的情况
      } else if (typeof selectArr.then === 'function') {
        selectArr.then(val => {
          this.list = val
        })
      } else {
        this.list = selectArr
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
