// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'jquery'
import Vue from 'vue'
import VueRouter from 'vue-router'
// import router from './router'
import App from './App'
import store from './store'
import Crumb from './components/common/crumb.vue'
// import DUI from '~/components'
import {
  Table,
  TableColumn,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Upload,
  Menu,
  Submenu,
  MenuItem,
  MenuItemGroup,
  DatePicker,
  TimeSelect,
  TimePicker,
  Slider
} from 'element-ui'
// import {
//   Card,
//   Popover,
//   Pagination
// } from '@jd/dui'
import VueCookies from 'vue-cookies'
import './public-path'
import getMicroRoutes from './router/microRoutes'

Vue.config.productionTip = false
Vue.component('Crumb', Crumb)
Vue.component(Table.name, Table)
Vue.component(TableColumn.name, TableColumn)
Vue.component(Dropdown.name, Dropdown)
Vue.component(DropdownMenu.name, DropdownMenu)
Vue.component(DropdownItem.name, DropdownItem)
Vue.component(Upload.name, Upload)
Vue.component(Menu.name, Menu)
Vue.component(Submenu.name, Submenu)
Vue.component(MenuItem.name, MenuItem)
Vue.component(MenuItemGroup.name, MenuItemGroup)
Vue.component(DatePicker.name, DatePicker)
Vue.component(TimeSelect.name, TimeSelect)
Vue.component(TimePicker.name, TimePicker)
Vue.component(Slider.name, Slider)

// Vue.component(Card.name, Card)
// Vue.component(Popover.name, Popover)
// Vue.component(Pagination.name, Pagination)

Vue.use(VueCookies)
// Vue.use(DUI)
Vue.use(VueRouter)

let instance = null
let router = null

/**
 * 解析路由
 * @returns {{}}
 */
function parseRoute (subRoute) {
  const query = {}
  let path = ''
  let queryString = ''
  if (subRoute) {
    const splitArr = subRoute.split('?')
    if (splitArr.length > 0) {
      path = splitArr[0]
    }
    if (splitArr.length > 1) {
      queryString = splitArr[1]
    }
  }
  const pairs = queryString.split('&')
  for (var i = 0; i < pairs.length; i++) {
    const pair = pairs[i].split('=')
    query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '')
  }
  return { path, query }
}

/**
 * 渲染函数
 * 两种情况：主应用生命周期钩子中运行 / 微应用单独启动时运行
 */
function render (props = {}) {
  const { container, mainRouter, subRoute } = props
  const route = parseRoute(subRoute)
  // 在 render 中创建 VueRouter，可以保证在卸载微应用时，移除 location 事件监听，防止事件污染
  router = new VueRouter({
    // 运行在主应用中时，添加路由命名空间 /jimdb
    // base: window.__POWERED_BY_QIANKUN__ ? '/jimdb' : '/',
    mode: 'hash',
    routes: getMicroRoutes(route),
    scrollBehavior (to, from, savedPosition) {
      if (to.hash) {
        return {
          selector: to.hash
        }
      }
      return { x: 0, y: 0 }
    }
  })

  // 路由守卫
  router.beforeEach(async (to, from, next) => {
    let loginUserName = store.getters.loginUserName
    let loginUserRole = store.getters.loginUserRole
    let goNext = (to, from, next, loginUserRole) => {
      console.log('[jimdb]from', from)
      console.log('[jimdb]to', to)
      if (to.meta.role !== undefined && loginUserRole > to.meta.role) {
        next({path: '/noPermission'})
      } else {
        // 禁止跳转’/’
        if ((to.path === '/' && from.path !== '/') || !to.matched.length) {
          next({path: from.path, query: from.query})
        } else {
          next()
        }
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

  // 挂载应用
  /* eslint-disable no-new */
  instance = new Vue({
    router,
    store,
    render: h => h(App)
  }).$mount(container ? container.querySelector('#app') : '#app')

  // 设置主系统路由
  store.commit('setMainRouter', mainRouter)

  // 跳转子路由
  if (subRoute) {
    router.onReady(() => {
      // window.location.hash = props.subRoute
      // if (route.path && router.currentRoute.path !== route.path) {
      router.replace(route)
      console.log(`[jimdb]router.replace`, route)
      // }
    })
  }
}

// 独立运行时，直接挂载应用
if (!window.__POWERED_BY_QIANKUN__) {
  render()
}

/**
 * bootstrap 只会在微应用初始化的时候调用一次，下次微应用重新进入时会直接调用 mount 钩子，不会再重复触发 bootstrap。
 * 通常我们可以在这里做一些全局变量的初始化，比如不会在 unmount 阶段被销毁的应用级别的缓存等。
 */
export async function bootstrap () {
  console.log(`[jimdb]bootstraped`)
  store.commit('setShowPageOnly', true)
}

/**
 * 应用每次进入都会调用 mount 方法，通常我们在这里触发应用的渲染方法
 */
export async function mount (props) {
  console.log('[jimdb]mount', props)
  props.onGlobalStateChange((state, prevState) => {
    console.log(`[onGlobalStateChange]:`, state, prevState)
  })
  render(props)
}

/**
 * 应用每次 切出/卸载 会调用的方法，通常在这里我们会卸载微应用的应用实例
 */
export async function unmount () {
  console.log('[jimdb]unmount')
  instance.$destroy()
  instance.$el.innerHTML = ''
  instance = null
  router = null
}
