<script setup>
import { useFullscreen } from '@vueuse/core'
import SvgIcon from './../SvgIcon';


const { isFullscreen, enter, exit, toggle } = useFullscreen();


</script>
<template>
  <div>
    <svg-icon :icon-class="isFullscreen ? 'exit-fullscreen' : 'fullscreen'" @click="toggle" />
  </div>
</template>

<style lang='scss' scoped>
.screenfull-svg {
  display: inline-block;
  cursor: pointer;
  fill: #5a5e66;
  width: 20px;
  height: 20px;
  vertical-align: 10px;
}
</style>