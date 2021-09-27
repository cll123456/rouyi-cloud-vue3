<script setup>
import { ref } from 'vue';
const url = ref('http://doc.ruoyi.vip/ruoyi-cloud');

/**
 * 跳转到gitUp页面
 */
const goto = () => {
  window.open(url.value)
}
</script>
<template>
  <div>
    <svg-icon icon-class="question" @click="goto" />
  </div>
</template>

<style lang='scss' scoped>
</style>