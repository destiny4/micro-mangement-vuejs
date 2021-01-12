import router from '@/router/base'
import store from '@/store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getLoginInfo } from '@/utils/base/auth' // get token from cookie
import getPageTitle from '@/utils/base/get-page-title'
import addDynamicMenuAndRoutes from '@/utils/base/addRoutes'
NProgress.configure({ showSpinner: false }) // NProgress Configuration
const whiteList = ['/login'] // no redirect whitelist
router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()
  // set page title
  document.title = getPageTitle(to.meta.title)
  // determine whether the user has logged in
  const loginInfo = getLoginInfo()
  const hasToken = loginInfo.token
  // 设置iframe内嵌url地址
  handleIFrameUrl(to.path)
  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done()
    } else {
      const loadedMenu = store.state.app.menuRouteLoaded
      if (loadedMenu) {
        next()
        // next({ ...to, replace: true }) // 使用静态路由必须这样写，网页刷新才不会丢失路由
      } else {
        try {
          // 夹在动态菜单和路由
          addDynamicMenuAndRoutes()
          // 如果是动态加载菜单，则放开next，注释下面的
          // next()
          next({ ...to, replace: true })
        } catch (error) {
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})

/**
 * 设置IFrame嵌套页面地址
 */
function handleIFrameUrl(path) {
  // 嵌套页面，保存iframeUrl到store，供IFrame组件读取展示
  let url = path
  const length = store.state.iframe.iframeUrls.length
  for (let i = 0; i < length; i++) {
    const iframe = store.state.iframe.iframeUrls[i]
    if (path != null && path.endsWith(iframe.path)) {
      url = iframe.url
      store.commit('iframe/setIFrameUrl', url)
      break
    }
  }
}
