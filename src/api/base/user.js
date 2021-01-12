import request from '@/utils/base/request'

// 登录
export const login = data => {
  return request({
    url: '/user/api/OperatorLogin',
    method: 'post',
    data
  })
}

// 登出
export const logout = data => {
  return request({
    url: '/user/api/OperatorLogout',
    method: 'post',
    data
  })
}
export const getBusinessId = v => request.post('/user/api/BusinessGetByTerm', v)
export const getTenantId = v => request.post('/user/api/TenantGetByTerm', v)
