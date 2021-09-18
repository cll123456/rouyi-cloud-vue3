<script setup>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import HelloWorld from './components/HelloWorld.vue';
import axios from 'axios';

const getImg = () => {
  axios.get('/api/prod-api/captchaImage').then(res => {
    console.log(res, '--=----')
  })
}
</script>

<template>
  <router-view />
</template>

<style>

</style>
