<script setup>
import { onMounted } from '@vue/composition-api';

onMounted(() => { 
  // document.getElementById('loading-wrapper').remove();
})
</script>

<template>
  <div>
    <router-view />
  </div>
</template>

<style>
</style>
