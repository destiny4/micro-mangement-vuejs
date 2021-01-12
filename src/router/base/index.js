import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'
Vue.use(Router)

/* Layout */
import Layout from '@/layout/base'

export const constantRoutes = [
  {
    path: '/',
    component: Layout,
    hidden: true
  },
  {
    path: '/login',
    component: () => import('@/views/base/login/login'),
    hidden: true
  }
]
export const dynamicRoutes = [
  {
    path: '/demo',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/business/demo/demo.vue'),
        name: 'demo',
        meta: { title: 'demo', icon: 'demo' }
      }
    ]
  }
]
const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
  store.commit('app/menuRouteLoaded', false)
}

export default router
