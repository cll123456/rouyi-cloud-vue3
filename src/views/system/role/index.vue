<script setup>
import TreeSelect from './../../../components/TreeSelect/index.vue'
import { ref } from 'vue';
const value = ref('');
const getValue = () => {
   alert(value.value)
}
</script>
<template>
   <div>
      <tree-select v-model:value="value"></tree-select>
      <button @click="getValue">click</button>
   </div>
</template>

<style lang='scss' scoped>
</style>