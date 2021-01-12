<template>
  <div
    :class="['container', uploadStyle]"
    @mouseenter="showOper"
    @mouseleave="hideOper"
  >
    <!-- 媒体预览区域 -->
    <component
      :is="loadComponents"
      :source="source"
    />

    <!-- 操作区域 -->
    <transition name="fadeIn">
      <section v-show="operVisible" class="operation" @click="handleOper">
        <!-- 上传 -->
        <span
          v-show="isFresh"
          class="el-icon-upload icon"
          data-type="upload"
        />
        <!-- 下载 -->
        <span
          v-show="!isFresh"
          class="el-icon-download icon"
          data-type="download"
        />
        <!-- 预览 -->
        <span class="el-icon-zoom-in icon" data-type="view" />
        <!-- 删除 -->
        <span class="el-icon-delete icon" data-type="delete" />
      </section>
    </transition>

    <!-- 进度条区域 -->
    <section v-show="isUpload" class="progress">
      <span class="el-icon-loading" />
    </section>
  </div>
</template>

<script>
import Upload from '../upload'
import { firstUppercase, download } from '../utils'
import { componentMap } from '../config'
import PrevImage from './preview/image'
import PrevVideo from './preview/video'
export default {
  name: 'ImageUpload',
  components: {
    PrevImage,
    PrevVideo
  },
  props: {
    blob: {
      type: String,
      default: ''
    },
    url: {
      type: String,
      required: true
    },
    stat: {
      type: Number,
      required: true
    },
    id: {
      type: String,
      required: true
    },
    file: {
      validator: function(value) {
        // 这个值必须匹配下列字符串中的一个
        return typeof value === 'string' || value instanceof File
      },
      default: ''
    },
    type: {
      type: String,
      default: 'image'
    }
  },
  data() {
    return {
      operVisible: false,
      uploadStat: 'pending',
      progressVal: 0, // 上传进度条控制
      customColors: [
        { color: '#909399', percentage: 30 },
        { color: '#e6a23c', percentage: 70 },
        { color: '#67c23a', percentage: 100 }
      ]
    }
  },
  computed: {
    // 更具不同的type 加载不同 的预览组件
    loadComponents() {
      return componentMap.get(this.type)
    },
    sourceKey() {
      const str = this.url
      // 获取 url的最后一个 / 之后的内容 为Key
      return str.slice(str.lastIndexOf('/') + 1)
    },
    // 是否是新上传的文件
    isFresh() {
      return this.stat === 0
    },
    isUpload() {
      return this.progressVal > 0 && this.progressVal < 100
    },
    // 图片路径
    source() {
      //  todo 待放开
      return this.isFresh ? this.blob : this.url
    },
    // 文件上传的状态的样式
    uploadStyle() {
      return `is-${this.uploadStat}`
    },
    name() {
      return this.file.name
    }
  },
  mounted() {
    Upload.init()
  },
  methods: {
    // 操作按钮切换
    showOper() {
      this.operVisible = true
    },
    hideOper() {
      this.operVisible = false
    },
    handleOper(e) {
      let { type } = e.target.dataset
      type = firstUppercase(type)
      this[`on${type}`] && this[`on${type}`]()
    },
    updateUploadStat(stat) {
      this.uploadStat = stat
    },
    // 操作处理函数
    async onUpload() {
      const { location } = await Upload.upload(this.file, this.onProgress)
      // 更新 stat
      this.$emit('updateStatus', {
        id: this.id,
        url: `http://${location}`
      })
      // 更新 uploadStat
      this.updateUploadStat('done')
    },
    onProgress(val) {
      // 处理进度条
      this.progressVal = val
    },
    async onDownload() {
      // 下载
      const resp = await Upload.download(this.sourceKey)
      download(resp)
    },
    onView() {
      // 浏览
    },
    async onDelete() {
      // 删除逻辑
      if (this.stat === 1) {
        const isDelete = await Upload.delete(this.sourceKey)
        if (isDelete) {
          this.$emit('delete', this.id)
        }
      } else {
        this.$emit('delete', this.id)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  // 过渡
  .fadeIn-enter,
  .fadeIn-leave-to {
    transform: translateY(100%);
    opacity: 0;
  }
  .fadeIn-enter-active,
  .fadeIn-leave-active {
    transition: 0.3s;
  }
  // 上传状态
  .is-done {
    border: 1px solid rgb(116, 223, 95);
  }
  .is-fail {
    border: 1px solid rgb(214, 45, 59);
  }
  .is-pending {
    border: 1px solid #ccc;
  }

  .container {
    position: relative;
    width: 120px;
    height: 120px;
    border-radius: 5px;
    cursor: pointer;
    overflow: hidden;
    .progress {
      position: absolute;
      bottom: -10px;
      right: 0%;
      color: aliceblue;
    }

    img {
      height: 100%;
    }
    .operation {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      padding-right: 5px;
      position: absolute;
      bottom: 0;
      width: 100%;
      height: 20px;
      background: rgba(0, 0, 0, 0.5);
      .icon {
        color: #fff;
        transition: 0.3s;
        &:hover {
          color: #409eff;
          transform: scale(0.9);
        }
      }
      .icon + .icon {
        padding-left: 5px;
      }
    }
  }
</style>
