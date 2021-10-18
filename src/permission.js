import router from './router'
import store from './store'
import { ElMessage } from 'element-plus'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { getToken } from '@/utils/auth'
import { isExternal } from './utils/validate'
import { useDynamicTitle } from './hooks/dynamicTitle'

/**
 * 配置进度条，不需要小圈圈 
 */
NProgress.configure({ showSpinner: false });
/**
 * 白名单
 */
const whiteList = ['/login', '/auth-redirect', '/bind', '/register'];

/**
 * 全局路由守卫
 */
router.beforeEach((to, from, next) => {
  // 启动进度条
  NProgress.start()
  // token存在
  if (getToken()) {
    to.meta.title && store.dispatch('settings/setTitle', to.meta.title)
    to.meta.title && useDynamicTitle();
    /* has token*/
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done()
    } else {
      if (store.getters.roles.length === 0) {
        // 判断当前用户是否已拉取完user_info信息
        store.dispatch('GetInfo').then(() => {
          store.dispatch('GenerateRoutes').then(accessRoutes => {
            // 根据roles权限生成可访问的路由表
            accessRoutes.forEach(r => {
              if (!isExternal(r.path) || r.path !== 'http://ruoyi.vip') {
                // // 动态添加可访问路由表
                router.addRoute(r)
              }
            })
            // router.addRoute(accessRoutes) 
            next({ ...to, replace: true }) // hack方法 确保addRoutes已完成
          })
        }).catch(err => {
          store.dispatch('LogOut').then(() => {
            ElMessage.error(err)
            next({ path: '/' })
          })
        })
      } else {
        next()
      }
    }
  } else {
    // 没有token
    if (whiteList.indexOf(to.path) !== -1) {
      // 在免登录白名单，直接进入
      next()
    } else {
      next(`/login?redirect=${to.fullPath}`) // 否则全部重定向到登录页
      NProgress.done()
    }
  }
})

/**
 * 进度条完成
 */
router.afterEach(() => {
  NProgress.done()
})
