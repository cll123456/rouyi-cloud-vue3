<script setup>
import { useRoute, useRouter } from "vue-router";

const route = router.currentRoute;
import router from '@/router';
const { params, query } = route
const { path } = params
router.replace({ path: '/' + path, query })
</script>
<template>
  <div></div>
</template>

<style lang='scss' scoped>
</style>