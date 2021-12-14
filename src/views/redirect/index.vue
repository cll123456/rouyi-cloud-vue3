<script setup>
import router from '@/router';
import {getCurrentInstance} from '@vue/composition-api'
const {proxy} = getCurrentInstance()


const { params, query } = proxy.$route
const { path } = params
router.replace({ path: '/' + path, query })
</script>
<template>
  <div></div>
</template>

<style lang='scss' scoped>
</style>