// 自动注册 business 下面的 组件
const context = require.context('./base', true, /index.js/)
const components = []
context.keys().forEach((item) => {
  const comp = context(item).default
  components.push(comp)
})
// export
const register = {
  install: (Vue) => {
    components.forEach((item) => {
      Vue.use(item)
    })
  }
}
export default register

