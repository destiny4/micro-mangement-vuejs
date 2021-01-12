import _md5 from 'js-md5'
/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string | null}
 */
export function parseTime(time, cFormat) {
  if (arguments.length === 0 || !time) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string')) {
      if ((/^[0-9]+$/.test(time))) {
        // support "1548221490638"
        time = parseInt(time)
      } else {
        // support safari
        // https://stackoverflow.com/questions/4310953/invalid-date-in-safari
        time = time.replace(new RegExp(/-/gm), '/')
      }
    }

    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value ] }
    return value.toString().padStart(2, '0')
  })
  return time_str
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime(time, option) {
  if (('' + time).length === 10) {
    time = parseInt(time) * 1000
  } else {
    time = +time
  }
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    )
  }
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url) {
  const search = decodeURIComponent(url.split('?')[1]).replace(/\+/g, ' ')
  if (!search) {
    return {}
  }
  const obj = {}
  const searchArr = search.split('&')
  searchArr.forEach(v => {
    const index = v.indexOf('=')
    if (index !== -1) {
      const name = v.substring(0, index)
      const val = v.substring(index + 1, v.length)
      obj[name] = val
    }
  })
  return obj
}
/**
 * This is just a simple version of deep copy
 * Has a lot of edge cases bug
 * If you want to use a perfect deep copy, use lodash's _.cloneDeep
 * @param {Object} source
 * @returns {Object}
 */
export function deepClone(source) {
  if (!source && typeof source !== 'object') {
    throw new Error('error arguments', 'deepClone')
  }
  const targetObj = source.constructor === Array ? [] : {}
  Object.keys(source).forEach(keys => {
    if (source[keys] && typeof source[keys] === 'object') {
      targetObj[keys] = deepClone(source[keys])
    } else {
      targetObj[keys] = source[keys]
    }
  })
  return targetObj
}

/**
 * 判断值的类型
 * @param {*} value 检测值
 * @return {string} 值的类型
 */
export const getValueType = (val) => {
  let type = ''
  const _temp = Object.prototype.toString.call(val)
  const _arr = _temp.split(' ')[1]
  type = _arr.split(']')[0]
  return type
}

/**
 * 重置表单的数据 ( 暂时支持的层级为 1)
 * @param {*} form 数据列表 数组
 * @return {form}
 */
export const resetForm = (form) => {
  const obj = Object.create(null)
  for (const i in form) {
    const type = getValueType(form[i])
    if (type === 'Array') {
      obj[i] = []
    } else if (type === 'Object') {
      obj[i] = {}
    } else {
      obj[i] = ''
    }
  }
  return obj
}

/**
 * 将数组中 指定 key 的 value 作为 目标对象的key,value 为 defaultValue
 * @param {*} array any[]
 * @param {*} keys string[]
 * @param {*} defaultValue any
 */
export const ArrayToObject = (array, keys, defaultValue = '') => {
  if (!Array.isArray(array)) return
  return array.reduce((acc, cur) => {
    keys.map(_k => {
      const key = cur[_k]
      acc[key] = defaultValue
    })
    return acc
  }, {})
}

export const md5 = v => _md5(v)

/**
 * 判断一个字符串是否是json格式的
 * 正确 则返回 JSON.parse 的对象
 * @param {*} v
 */
export const isJSON = v => {
  if (typeof v !== 'string') return false
  try {
    if (typeof JSON.parse(v) === 'object') {
      return JSON.parse(v)
    }
  } catch (e) {
    return false
  }
}
/**
 * 判断一个对象 是否是空对象
 * @param {*} v
 */

export const isEmptyObj = v => Object.keys(v).length === 0

export function toggleClass(
  element,
  className
) {
  if (!element || !className) {
    return
  }
  let classString = element.className
  const nameIndex = classString.indexOf(className)
  if (nameIndex === -1) {
    classString += '' + className
  } else {
    classString =
      classString.substr(0, nameIndex) +
      classString.substr(nameIndex + className.length)
  }
  element.className = classString
}
