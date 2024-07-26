<template>
  <view>
    <slot></slot>
    <uni-load-more :status="props.status" class="loadMore" />
  </view>
</template>

<script setup>
  import { onPullDownRefresh } from "@dcloudio/uni-app"
  import { getCurrentInstance, onMounted, onUnmounted } from 'vue';
  const props = defineProps(['status'])
  const emits = defineEmits(['load'])
  const { proxy } = getCurrentInstance()
  const observer = uni.createIntersectionObserver(proxy)
  let appear = false
  onMounted(() => {
    observer.relativeToViewport().observe('.loadMore', e => {
      appear = e.intersectionRatio > 0
      if (appear && props.status === 'more') {
        emits('load')
      }
    })
  })
  onUnmounted(() => {
    observer.disconnect()
  })
</script>