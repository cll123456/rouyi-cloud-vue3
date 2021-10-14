<script setup>
import { ref, computed, onMounted } from 'vue';

const props = defineProps({
  src: {
    type: String,
    required: true
  }
})
/**高度 */
const height = ref(document.documentElement.clientHeight - 84 + "px;")
/**是否加载中 */
const loading = ref(true)
/**当前的url */
const url = computed(() => props.src)

onMounted(() => {
  setTimeout(() => {
    loading.value = false;
  }, 300);
  window.onresize = function temp() {
    height.value = document.documentElement.clientHeight - 84 + "px;";
  };
})
</script>
<template>
  <div v-loading="loading" :style="'height:' + height">
    <iframe :src="url" frameborder="no" style="width: 100%; height: 100%" scrolling="auto" />
  </div>
</template>

<style lang='scss' scoped>
</style>