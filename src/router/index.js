import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'
import getMicroRoutes from './microRoutes'

Vue.use(VueRouter)

const router = new VueRouter({
  // 运行在主应用中时，添加路由命名空间 /jimdb
  // base: window.__POWERED_BY_QIANKUN__ ? '/jimdb' : '/',
  mode: 'hash',
  routes: getMicroRoutes(),
  scrollBehavior (to, from, savedPosition) {
    return {x: 0, y: 0}
  },
  linkActiveClass: 'is-active'
})

router.beforeEach(async (to, from, next) => {
  let loginUserName = store.getters.loginUserName
  let loginUserRole = store.getters.loginUserRole
  let goNext = (to, from, next, loginUserRole) => {
    console.log('[jimdb]from', from)
    console.log('[jimdb]to', to)
    if (to.meta.role !== undefined && loginUserRole > to.meta.role) {
      next({path: '/noPermission'})
    } else {
      next()
    }
  }
  try {
    if (!loginUserName) { // 先判断是否已登录
      await store.dispatch('getUserName')
      await store.dispatch('getUserRole')
      let loginUserName = store.getters.loginUserName
      let loginUserRole = store.getters.loginUserRole
      if (loginUserName) {
        goNext(to, from, next, loginUserRole)
      }
    } else {
      goNext(to, from, next, loginUserRole)
    }
  } catch (err) {}
})

// router.onError((error) => {
//   console.log(error)
//   const pattern = /Loading chunk (\d)+ failed/g
//   const isChunkLoadFailed = error.message.match(pattern)
//   const targetPath = router.history.pending.fullPath
//   if (isChunkLoadFailed) {
//     router.replace(targetPath)
//   }
// })

export default router
