import { v4 as uuidv4 } from 'uuid'
/**
 * 格式化文件类型
 * @param {*} file
 */
export const getMediaType = file => {
  if (!(file instanceof File)) return
  const type = file.type
  if (type.includes('image')) return 'image'
  if (type.includes('video')) return 'video'
}
/**
 * 格式化文件列表
 * @param {*} fileList
 */
export const formateFileList = (files) => {
  if (!Array.isArray(files)) return []
  return files.map(file => {
    if (file instanceof File) {
      const blob = URL.createObjectURL(file)
      const name = file.webkitRelativePath || file.relativePath || file.name
      return {
        file,
        // 通过这个状态来判断图片是新加入还是回显
        stat: 0,
        // 通过这个状态来记录文件
        url: '',
        // key用来定位当前的文件
        id: uuidv4(),
        size: file.size,
        name,
        blob,
        type: getMediaType(file)
      }
    } else {
      return {
        id: uuidv4(),
        stat: 1,
        url: file.url,
        type: getMediaType(file)
      }
    }
  })
}
/**
 * 首字母大写
 * @param {*} str
 */
export const firstUppercase = str => {
  return str[0].toUpperCase() + str.slice(1)
}
/**
 * 校验文件大小
 * @param {*} files
 * @param {*} limit
 */
export const validateFileSize = (files, limit) => {
  if (files.length === 0) return
  return files.every(file => {
    return file.size <= limit
  })
}

/**
 * 下载文件
 * @param {*} url
 * @param {*} name
 */
export const download = (url, name) => {
  let a = document.createElement('a')
  a.setAttribute('download', 'image')
  a.setAttribute('href', url)
  a.click()
  a = null
}
