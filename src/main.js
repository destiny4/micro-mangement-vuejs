import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/zh-CN' // lang i18n
import 'font-awesome/css/font-awesome.min.css'
import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router/base'
import api from '@/api/'
import '@/icons' // icon
import '@/utils/base/permission' // permission control
import BaseComp from '@/components'
Vue.use(BaseComp)
/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
// set ElementUI lang to EN
Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)

Vue.config.productionTip = false
Vue.prototype.$api = api
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
