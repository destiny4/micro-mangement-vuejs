/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
  const valid_map = ['admin', 'editor', '00000000@qq.com']
  return valid_map.indexOf(str.trim()) >= 0
}
/**
 * el-form 自定义表单娇艳
 * 数字 + 下划线 + 小写字母
 * @param {*} rule
 * @param {*} value
 * @param {*} callback
 */
export function validateBusinessId(rule, value, callback) {
  const reg = /^[0-9a-z_]{1,}$/
  if (!reg.test(value)) {
    callback(new Error('请输入数字 , 下划线 或 小写字母'))
  } else {
    callback()
  }
}
/**
 * 校验某个数值是否在 指定的范围内
 * @param {*} rang 范围
 * @param {*} exclude 排除的符号
 */
export function validateRange(rang, exclude) {
  return function(rule, value, callback) {
    if (Number.isNaN(+value)) {
      callback(new Error(`输入数字`))
    }
    const v = value + ''
    if (v.indexOf(exclude) !== -1) {
      callback(new Error(`输入内容不能包括 ${exclude}`))
    }
    const [min, max] = rang
    if (value < min || value > max) {
      callback(new Error(`输入内容必须在 ${min} 和 ${max} 之间`))
    }
    callback()
  }
}
