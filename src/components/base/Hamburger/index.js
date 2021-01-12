import Com from './main/index.vue'

Com.install = Vue => {
  Vue.component(Com.name, Com)
}
export default Com
