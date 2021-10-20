<script setup>
import { ref } from 'vue';
const url = ref('https://github.com/cll123456/rouyi-cloud-vue3');

/**
 * 跳转到gitUp页面
 */
const goto = () => {
  window.open(url.value)
}
</script>
<template>
  <div>
    <svg-icon icon-class="github" @click="goto" />
  </div>
</template>

<style lang='scss' scoped>
</style>