<script setup>
import { ref } from 'vue';
const url = ref('https://gitee.com/y_project/RuoYi-Cloud');

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