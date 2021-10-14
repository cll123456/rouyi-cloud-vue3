<script setup>
import { ref } from 'vue';
import IframeComp from '../../../components/IframeComp/index.vue';
import { PUBLIC_PATH } from '../../../config/commonConfig';

const url = ref(PUBLIC_PATH + 'druid/login.html');
</script>
<template>
   <div>
      <iframe-comp v-model:src="url"></iframe-comp>
   </div>
</template>

<style lang='scss' scoped>
</style>