<script setup>
import SvgIcon from './../../../components/SvgIcon/index.vue'
const props = defineProps({
  /**
   * 图标
   */
  icon: {
    type: String,
    default: ''
  },
  /**
   * 标题
   */
  title: {
    type: String,
    default: ''
  }
})

</script>

<template>
  <svg-icon v-if="props.icon" :icon-class="props.icon" />
  <span v-if="props.title" slot="title">{{ props.title }}</span>
</template>

<style lang='scss' scoped>
</style>