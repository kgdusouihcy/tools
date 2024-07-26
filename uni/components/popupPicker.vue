<template>
  <uni-popup ref="popup" type="bottom" @change="e=>show = e.show">
    <view class="bg-white">
      <view class="flex justify-between border-b uni-pa-4">
        <text @click="show = false">取消</text>
        <text @click="confrim()" class="uni-primary">确认</text>
      </view>
      <picker-view :value @change="handleCheng" class="picker-view">
        <picker-view-column>
          <view class="picker-item" v-for="item in data">{{props.textKey?item[props.textKey]:item}}</view>
        </picker-view-column>
      </picker-view>
    </view>
  </uni-popup>
</template>

<script setup>
  import { ref, watchEffect } from 'vue';
  const props = defineProps(['data', 'textKey'])
  const emits = defineEmits(['confrim'])
  const popup = ref(null)
  const value = ref([0])
  const show = defineModel()
  const handleCheng = e => value.value = e.detail.value
  const confrim = () => emits('confrim', props.data[value.value[0]])
  watchEffect(() => {
    if (show.value) {
      popup.value?.open()
    } else {
      popup.value?.close()
    }
  })
</script>

<style lang="scss" scoped>
  .picker-view {
    width: 750rpx;
    height: 600rpx;
    font-size: 30rpx;
  }

  .picker-item {
    line-height: 60rpx;
    text-align: center;
  }
</style>