import NProgress from 'nprogress'
import '@/components/NProgress/nprogress.less'
import notification from 'ant-design-vue/es/notification'

import {
  registerMicroApps,
  addGlobalUncaughtErrorHandler,
  start
} from 'qiankun'

// 微应用注册信息
import apps from './apps'

/**
 * 注册微应用
 * 第一个参数 - 微应用的注册信息
 * 第二个参数 - 全局生命周期钩子
 */
registerMicroApps(apps, {
  // 加载微应用前， 加载进度条
  beforeLoad: app => {
    NProgress.start()
    console.log('before load', app.name)
    return Promise.resolve()
  },
  // qiankun 生命周期钩子 - 微应用挂载后
  afterMount: app => {
    // 加载微应用前， 进度条加载完成
    NProgress.done()
    console.log('after mount', app.name)
    return Promise.resolve()
  }
})

addGlobalUncaughtErrorHandler(event => {
  console.error(event)
  const { message: msg } = event
  // 加载失败时提示
  if (msg && msg.includes('died in status LOADING_SOURCE_CODE')) {
    notification.error({
      message: '错误',
      description: '微应用加载失败，请检查应用是否可运行'
    })
  }
})

// 导出 qiankun 的启动函数
export default start
