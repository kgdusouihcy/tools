<template>
  <view class="choose-file">
    <view class="choose-file__title"><text v-if="required" class="uni-error">*</text>{{ title }}</view>
    <view class="choose-file__content">
      <view class="choose-file__content__item" v-for="(item, index) in files" :key="index">
        <image :src="item" mode="aspectFill" @click="previewImage(item)" class="choose-file__content__item__img">
        </image>
        <uni-icons type="closeempty" size="20" class="choose-file__content__item__close" color="#fff"
          @click="files.splice(index, 1)"></uni-icons>
      </view>
      <view v-if="files.length < limit" class="choose-file__content__item" @click="chooseFile">
        <uni-icons type="plus" size="30"></uni-icons>
      </view>
    </view>
  </view>
</template>

<script setup>
  const props = defineProps({
    limit: {
      type: Number,
      default: 1
    },
    title: String,
    required:Boolean,
    sourceType: {
      type: Array,
      default: () => ["album", "camera"]
    },
  })
  const files = defineModel()
  const chooseFile = () => {
    uni.chooseImage({
      count: props.limit - files.value.length,
      sourceType: props.sourceType,
      success: (res) => {
        files.value = files.value.concat(res.tempFilePaths)
      }
    })
  }
  const previewImage = current => uni.previewImage({ urls: files.value, current })
  const clearFiles = () => files.value = []
  defineExpose({ clearFiles })
</script>

<style lang="scss" scoped>
  .choose-file {

    &__title {
      font-size: 28rpx;
      color: #333;
      margin-bottom: 20rpx;
    }

    &__content {
      display: flex;
      flex-wrap: wrap;

      &__item {
        width: 150rpx;
        height: 150rpx;
        margin-right: 20rpx;
        margin-bottom: 20rpx;
        background-color: #f5f5f5;
        border-radius: 10rpx;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;

        &:nth-child(3n) {
          margin-right: 0;
        }

        &__img {
          width: 100%;
          height: 100%;
          border-radius: 10rpx;
        }

        &__close {
          position: absolute;
          top: 5rpx;
          right: 5rpx;
          background-color: #333;
          border-radius: 50%;
          padding: 5rpx;
          display: flex;
          justify-content: center;
          align-items: center;
          opacity: 0.8;
        }
      }
    }
  }
</style>