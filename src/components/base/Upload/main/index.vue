<template>
  <div class="container">
    <section class="btns">
      <el-button plain size="small" @click="triggerUpload">{{ buttonText }}</el-button>
    </section>

    <section class="tips">
      <slot name="tips" />
    </section>

    <section class="view">
      <template v-for="file in fileList">
        <div :key="file.id" class="view-item">
          <UploadItem
            v-bind="file"
            @updateStatus="updateStatus"
            @delete="deleteFile"
          />
        </div>
      </template>
    </section>

    <!-- input -->
    <input
      ref="filElem"
      style="display: none"
      type="file"
      v-bind="inputAttrs"
      @change="getFile"
    >
  </div>
</template>

<script>
import { formateFileList, validateFileSize } from '../utils'
import { defaultConfig } from '../config'
import UploadItem from './upload-item'
export default {
  name: 'Upload',
  components: {
    UploadItem: UploadItem
  },
  props: {
    attrs: {
      type: Object,
      default: () => {}
    },
    value: {
      validator: function(value) {
        // 这个值必须匹配下列字符串中的一个
        return Array.isArray(value) || typeof value === 'string'
      },
      default: () => []
    }
  },
  data() {
    return {
      fileList: []
    }
  },
  computed: {
    buttonText() {
      return this.mediaType === 'image' ? '上传图片' : '上传视频'
    },
    mediaType() {
      return this.attrs.type
    },
    // 控制 是否可以选中多个文件 以及 只能选择的文件类型
    inputAttrs() {
      const {
        multiple = defaultConfig.multiple,
        accept = defaultConfig.accept
      } = this.attrs
      return {
        multiple,
        accept
      }
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.fileList = formateFileList(this.value)
    },
    triggerUpload() {
      // todo触发 before-upload的钩子
      // 触发 input typefile的点击事件
      this.$refs.filElem.dispatchEvent(new MouseEvent('click'))
    },
    clearFiles() {
      this.$refs.filElem.value = ''
    },
    getFile(e) {
      let files = e.target.files
      files = Array.from(files)
      //* 校验文件数量
      const { length } = files
      const { limit = defaultConfig.limit } = this.attrs
      if (length > limit) {
        this.$notify({
          type: 'warning',
          message: `文件数量不能超过${limit}`
        })
        this.clearFiles()
        return
      }

      //* 校验文件大小
      const { size = defaultConfig.size } = this.attrs
      if (!validateFileSize(files, size)) {
        this.$notify({
          type: 'warning',
          message: `文件大小不能超过${size}`
        })
        return
      }

      //*  格式化filelist
      this.fileList.push(...formateFileList(files))
      // 解决change事件只触发一次
      this.clearFiles()
    },
    //  更新 v-model的值
    updateValues() {
      const res = this.fileList.filter(file => file.stat === 1)
      this.$emit('input', res)
    },
    //  上传成功之后 更新指定文件的状态 以及 url
    updateStatus({ id, url }) {
      const file = this.fileList.filter((file) => file.id === id)
      if (file.length === 0) return
      file[0].stat = 1
      file[0].url = url
      this.updateValues()
    },
    //  删除文件
    deleteFile(id) {
      this.fileList = this.fileList.filter((file) => file.id !== id)
    }
  }
}
</script>
<style lang="scss" scoped>
  .view {
    display: flex;
    &-item + &-item {
      margin-left: 10px;
    }
  }
</style>
