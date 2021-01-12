
/*
 * 状态管理统一集成模块
 */
import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters.js'

import app from '/Users/chenxiaolong/project/micro-management/src/store/modules/base/app.js'

import iframe from '/Users/chenxiaolong/project/micro-management/src/store/modules/base/iframe.js'

import menu from '/Users/chenxiaolong/project/micro-management/src/store/modules/base/menu.js'

import permission from '/Users/chenxiaolong/project/micro-management/src/store/modules/base/permission.js'

import settings from '/Users/chenxiaolong/project/micro-management/src/store/modules/base/settings.js'

import user from '/Users/chenxiaolong/project/micro-management/src/store/modules/base/user.js'

import data from '/Users/chenxiaolong/project/micro-management/src/store/modules/business/data.js'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app, iframe, menu, permission, settings, user, data
  },
  getters
})

export default store

