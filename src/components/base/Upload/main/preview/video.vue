<template functional>
  <!-- 视频预览区域 -->
  <video class="video" muted autoplay>
    <source
      :src="props.source"
      :type="props.type"
    >
  </video>

</template>

<style lang="scss" scoped>
 .video{
   height:100%
 }
</style>
