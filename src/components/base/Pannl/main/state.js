// 数据 均在这里处理
import Vue from 'vue'
import request from '@/utils/base/request'
import { resetForm } from '@/utils/base'

export let state
export default function() {
  // 保证每个组件的 state是独立的
  state = Vue.observable({
    // 查询头 组件的状态
    queryState: {},
    // 记录 是否点击了查询,用于用户输入查询条件 而没有点击查询，导致分页的时候带上查询条件出错
    isQuery: false,
    loading: true,
    // table数据
    list: [],
    // listOp
    listOp: {},
    // 分页 配置
    paginationOp: {
      limit: 20, // 默认一页20条
      page: 1,
      total: 30
    }
  })
}

export const mutations = {
  SET_LIST(data) {
    state.list = data
  },
  SET_LISTOP({ method = 'get', api = '', defaultParams = {}, format } = {}) {
    state.listOp = { method, api, defaultParams, format }
  },
  SET_QUERYSTATE({ type, payload = {}}) {
    if (type === 'add') {
      state.queryState = payload
    }
    if (type === 'reset') {
      state.queryState = resetForm(state.queryState)
    }
  },
  SET_PAGINATIONOP({ type, payload }) {
    state.paginationOp[type] = payload
  },
  SET_ISQUERY({ type = '', payload }) {
    state.isQuery = payload
  },
  SET_LOADING({ type, payload }) {
    state.loading = payload
  }
}
export const getters = {
  params() {
    const isQuery = state.isQuery
    const limit = state.paginationOp.limit
    // 分页参数
    const pagination = { limit, begin: limit * (state.paginationOp.page - 1) }

    const defautlParams = state.listOp.defaultParams
    // 如果点击了查询 查询 就加上 查询状态
    const target = isQuery ? { ...state.queryState, ...pagination } : pagination
    // 合并  defautlParams
    return { ...defautlParams, ...target }
  }
}
export const actions = {
  async  setList() {
    const { method = 'get' } = state.listOp
    // todo 临时修改
    const params = getters.params()

    mutations.SET_LOADING({ payload: true })
    const resp = await request[method](state.listOp.api, params)
    mutations.SET_LOADING({ payload: false })

    // 格式化 返回的数据
    let { list = [], total = 0 } = resp
    if (state.listOp.format && typeof state.listOp.format === 'function') {
      const { list: _list, total: _total } = state.listOp.format(resp)
      list = _list
      total = _total
    }
    // 设置 table数据
    mutations.SET_LIST(list)
    // 设置 总数
    mutations.SET_PAGINATIONOP({ type: 'total', payload: total })
    // 处理边界的情况
    // if (list.length === 0 && total !== 0) {
    //   mutations.SET_PAGINATIONOP({ type: 'page', payload: state.paginationOp.page - 1 })
    //   this.setList()
    // }
  }
}
