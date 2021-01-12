// 默认配置
export const defaultConfig = {
  size: 50 * 1024 * 1000,
  limit: 3,
  multiple: true,
  accept: 'application/pdf,image/*'
}

// 媒体类型
export const ISIMAGE = ['image/png', 'image/jpeg', 'image/jpg']

// 预览组件加载map

export const componentMap = (() => {
  const map = new Map()
  map.set('image', () => import(/* webpackChunkName: "image" */'./main/preview/image.vue'))
  map.set('video', () => import(/* webpackChunkName: "video" */'./main/preview/video.vue'))
  return map
})()

