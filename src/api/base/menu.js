import request from '@/utils/base/request'
import axios from 'axios'
/*
 * 菜单管理模块
 */

// 保存
export const save = (data) => {
  return request({
    url: '/menu/api/MenuRegister',
    method: 'post',
    data
  })
}
// 保存
export const modify = (data) => {
  return request({
    url: '/menu/api/MenuModify',
    method: 'post',
    data
  })
}
// 删除
export const getDataByKey = (data) => {
  return request({
    url: '/menu/api/MenuGetByKey',
    method: 'post',
    data
  })
}
// 查找导航菜单树
export const getAll = (data) => {
  return request({
    url: '/menu/api/MenuGetRecursive',
    method: 'post',
    data
  })
}

// 删除
export const exportYaml = (data) => {
  return axios({
    url: '/menu/api/MenuGetYamlConfig',
    method: 'post',
    responseType: 'blob',
    data
  })
}
