import { login, logout } from '@/api/base/user'
import { getLoginInfo, setLoginInfo, removeLoginInfo } from '@/utils/base/auth'
import { resetRouter } from '@/router/base'
import md5 from 'js-md5'
import defaultSettings from '@/settings'

const getDefaultState = () => {
  const loginInfo = getLoginInfo() || {}
  return {
    token: loginInfo.token,
    name: loginInfo.name,
    busid: loginInfo.busid,
    tenid: loginInfo.tenid,
    avatar: defaultSettings.avatar || 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    perms: loginInfo.perms || [], // 用户权限标识集合
    roles: loginInfo.roles || [] // map集合
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_BUSID: (state, busid) => {
    state.busid = busid
  },
  SET_TENID: (state, tenid) => {
    state.tenid = tenid
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  setPerms(state, perms) { // 用户权限标识集合
    state.perms = perms
  },
  setRoles(state, roles) {
    state.roles = roles
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password, tenantid } = userInfo
    return new Promise((resolve, reject) => {
      const busid = defaultSettings.userBusinessID
      const tenid = tenantid
      login({ business_id: busid, tenant_id: tenid, operator_id: username.trim(), type: 1, passwd_md5double: md5(password).toLowerCase() }).then(res => {
        commit('SET_TOKEN', res.operator_token)
        commit('SET_NAME', username)
        commit('setPerms', res.perms_id_list)
        commit('setRoles', res.role_id_list)
        commit('SET_BUSID', busid)
        commit('SET_TENID', tenid)
        const loginInfo = {
          token: res.operator_token,
          name: username,
          perms: res.perms_id_list,
          roles: res.role_id_list,
          busid: busid,
          tenid: tenid
        }
        setLoginInfo(loginInfo)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout({ business_id: state.busid, tenant_id: state.tenid, operator_id: state.name, operator_token: state.token }).then(() => {
        removeLoginInfo()
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeLoginInfo() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

