<template>
  <div class="radio">
    <el-radio-group
      v-if="list.length > 0"
      v-model="model"
      v-bind="attrs"
    >
      <template v-for="item in list">
        <el-radio
          :key="item.value"
          :label="item.value"
        >{{ item.label }}</el-radio>
      </template>
    </el-radio-group>
    <span v-else>
      暂无数据
    </span>
  </div>
</template>

<script>
export default {
  name: 'Radio',
  inheritAttrs: false,
  props: {
    value: {
      type: [Number, String],
      default: ''
    },
    selectArr: {
      type: [Promise, Function, Array],
      required: true
    },
    attrs: {
      type: Object,
      default: () => {}
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
        console.log(this.list)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.el-radio{
  margin: 0px 10px 5px 0;
}
</style>
