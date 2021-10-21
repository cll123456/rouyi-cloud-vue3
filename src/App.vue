<script setup>
import { onMounted } from 'vue';

onMounted(() => {
  document.getElementById('loading-wrapper').remove();
})
</script>

<template>
  <router-view />
</template>

<style>
</style>
