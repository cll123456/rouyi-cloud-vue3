<script setup>
import router from '@/router';
const route = router.currentRoute;


const { params, query } = route
const { path } = params
router.replace({ path: '/' + path, query })
</script>
<template>
  <div></div>
</template>

<style lang='scss' scoped>
</style>