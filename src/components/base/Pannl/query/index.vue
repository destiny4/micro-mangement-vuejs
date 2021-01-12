<template>
  <div class="query">
    <!-- 查询表单区域 -->
    <section class="form">
      <div class="form-query">
        <template v-for="it in formOp">
          <div :key="it.prop" class="form-query-item">
            <component
              :is="`ten-${it.type}`"
              :key="it.prop"
              v-model="form[it.prop]"
              v-bind="it"
              v-on="it.events"
            />
          </div>
        </template>

        <!-- 按钮区域 -->
        <div class="form-query-btns">
          <template v-for="(it,i) in buttonOp">
            <el-button :key="i" v-bind="it" @click="handleClick(it,$event)">{{ it.text }}</el-button>
          </template>
        </div>
      </div>

      <!-- 自定义按钮 slot区域 -->
      <div v-if="hasSlot" class="form-auto">
        <slot />
      </div>
    </section>
  </div>
</template>

<script>

import Input from '@/components/base/Form/formItem/input'
import Select from '@/components/base/Form/formItem/select'
import Checkbox from '@/components/base/Form/formItem/checkbox'

const INNER_BTNS = ['查询', '清空']
export default {
  name: 'Query',
  components: {
    tenInput: Input,
    tenSelect: Select,
    tenCheckbox: Checkbox
  },
  model: {
    prop: 'form',
    event: 'change'
  },
  props: {
    form: {
      type: Object,
      required: true
    },
    formOp: {
      type: Array,
      required: true
    },
    buttonOp: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    hasSlot() {
      const _hasSlot = this.$slots.default
      return !!_hasSlot && _hasSlot.length !== 0
    }
  },
  mounted() {
    console.log(this.formOp)
  },
  methods: {
    handleClick(it, e) {
      const { text, handler } = it
      if (INNER_BTNS.includes(text)) {
        if (text === '查询') {
          this.$emit('query', this.form)
        }
        if (text === '清空') {
          this.$emit('clear', this.form)
        }
      } else {
        handler(e)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .query {
    .form {
      display:flex;
      justify-content: space-between;
      &-query {
        flex: 1;
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        &-item {
          margin-right: 10px;
        }
      }
      &-auto{
        flex:0 0 200px;
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        justify-content: flex-end;
      }
    }
  }
</style>
