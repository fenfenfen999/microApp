import axios from 'axios'
import cookie from './cookie.js'

const axiosInstance = axios.create({
  baseURL: '/jimdbApi',
  // timeout: 1000 * 60 * 30
  withCredentials: true
})

axiosInstance.interceptors.request.use(config => {
  // 接口请求之前request拦截
  // config.headers['erp'] = 'wangwenjing5'
  // 之前做的接口可以直接使用url上带的city地址
  return config
}, err => {
  return Promise.reject(err)
})

axiosInstance.interceptors.response.use(response => {
  // 接口数据返回之后response拦截
  if (response.status !== 200) {
    let message = response.toString() || response.status + ':请求失败'
    return Promise.reject(message)
  }
  let rst = response.data
  if (rst && rst.sso_redirect_url) {
    cookie.del('sso.jd.com', '/', '.jd.com')
    location.href = rst.sso_redirect_url + location.href
  }
  return response.data
}, err => {
  return Promise.reject(err)
})

export default {
  get (url, params, config) {
    const options = Object.assign({}, config, {
      method: 'get',
      url,
      params
      // timeout: 10000,
    })
    return axiosInstance(options).then(response => {
      return response
    }).catch(error => {
      return Promise.reject(error)
    })
  },
  post (url, params, data, config) {
    const options = Object.assign({}, config, {
      method: 'post',
      url,
      params,
      data
    })
    return axiosInstance(options).then(response => {
      return response
    }).catch(error => {
      return Promise.reject(error)
    })
  },
  put (url, params, data, config) {
    const options = Object.assign({}, config, {
      method: 'put',
      url,
      params,
      data
    })
    return axiosInstance(options).then(response => {
      return response
    }).catch(error => {
      return Promise.reject(error)
    })
  },
  delete (url, params, data, config) {
    const options = Object.assign({}, config, {
      method: 'delete',
      url,
      params,
      data
    })
    return axiosInstance(options).then(response => {
      return response
    }).catch(error => {
      return Promise.reject(error)
    })
  },
  all (...array) {
    return Promise.all(array).then(resList => {
      return resList
    }).catch(error => {
      return Promise.reject(error)
    })
  }
}
