<template>
  <div class="code-runner">
    <codemirror
      ref="myLog"
      v-model.trim="model"
      :options="logOptions"
      class="log"
      @ready="onLogReady"
      @focus="onLogFocus"
    />

    <!-- 模式切换 -->
    <section class="mode" />
  </div>
</template>

<script>
import { codemirror } from 'vue-codemirror'

import 'codemirror/lib/codemirror.css'
import 'codemirror/mode/javascript/javascript'
import 'codemirror/mode/clike/clike'
import 'codemirror/mode/go/go'
import 'codemirror/mode/htmlmixed/htmlmixed'
import 'codemirror/mode/http/http'
import 'codemirror/mode/php/php'
import 'codemirror/mode/python/python'
import 'codemirror/mode/http/http'
import 'codemirror/mode/sql/sql'
import 'codemirror/mode/vue/vue'
import 'codemirror/mode/xml/xml'
import 'codemirror/theme/blackboard.css'
import 'codemirror/theme/cobalt.css'

export default {
  name: 'CodeMirror',
  components: {
    codemirror
  },
  inheritAttrs: false,
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      logOptions: {
        // codemirror options
        tabSize: 4,
        mode: 'application/json',
        theme: 'blackboard',
        lineNumbers: true,
        lineWrapping: true,
        smartIndent: true,
        indentUnit: 4,
        cursorHeight: 0.8,
        line: true
        // more codemirror options, 更多 codemirror 的高级配置...
      }
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
  methods: {
    onLogReady(cm) {
      console.log('the editor is readied!', cm)
    },
    onLogFocus(cm) {
      console.log('the editor is focus!', cm)
    },
    comfirm() {
      this.$emit('comfirm')
    },
    clear() {
      this.model = ''
    }
  }
}
</script>

<style lang="scss" scoped>
.code-runner{
  .log{
    // 设置 codemirror 之间的间距
    line-height: 1.5em!important;
  }
  &-btns{
    display:flex;
    justify-content: flex-end;
    margin-top: 8px;
  }
}
</style>
