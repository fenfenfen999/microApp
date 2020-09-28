// import Vue from 'vue'
// import Vuex from 'vuex'
import http from '../utils/http.js'
import url from '../utils/url.js'
const Vue = require('vue')
const Vuex = require('vuex')
Vue.use(Vuex)

/* 配置全局数据 */
const state = {
  showPageOnly: false,
  city: 'bj',
  loginUserName: '',
  loginUserRole: 2,
  isIndex: false,
  clusterQuery: {},
  processQuery: {},
  mainRouter: null
}
const getters = {
  showPageOnly: state => state.showPageOnly,
  city: state => state.city,
  loginUserName: state => state.loginUserName,
  loginUserRole: state => state.loginUserRole,
  isIndex: state => state.isIndex,
  clusterQuery: state => state.clusterQuery,
  processQuery: state => state.processQuery,
  mainRouter: state => state.mainRouter
}
const mutations = {
  setShowPageOnly (state, data) {
    state.showPageOnly = data
  },
  setCity (state, data) {
    state.city = data
  },
  setUserName (state, data) {
    state.loginUserName = data
  },
  setUserRole (state, data) {
    state.loginUserRole = data
  },
  setIsIndex (state, data) {
    state.isIndex = data
  },
  setClusterQuery (state, data) {
    state.clusterQuery = data
  },
  setProcessQuery (state, data) {
    state.processQuery = data
  },
  setMainRouter (state, data) {
    state.mainRouter = data
  }
}
const actions = {
  getUserName ({commit}) {
    return new Promise((resolve, reject) => {
      http.get(url.logErp).then((data) => {
        data = data || {}
        commit('setUserName', data.erp)
        commit('setCity', data.city)
        resolve({
          erp: data.erp,
          city: data.city
        })
      }, (err) => {
        reject(err)
      })
    })
  },
  getUserRole ({commit}) {
    return new Promise((resolve, reject) => {
      http.get(url.logRole).then((data) => {
        if (data === '') {
          data = {}
        }
        commit('setUserRole', data.attach ? 0 : 2)
        resolve({role: data.attach ? 0 : 2})
      }).catch(() => {
        commit('setUserRole', 2)
        resolve({role: 2})
      })
    })
  }
}
export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions
})
