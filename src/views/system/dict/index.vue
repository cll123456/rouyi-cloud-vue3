<script setup>
import { ref } from 'vue';
import { listMenu } from '../../../api/system/menu';
import { handleTree } from '../../../utils/ruoyi';
import TreeSelect from './../../../components/TreeSelect/index.vue'
const menuOptions = ref([]);
const form = ref({
   parentId: undefined,
   menuOptions: undefined
})
const getTreeselect = async () => {
   form.value.menuOptions = undefined;
   await listMenu().then(response => {
      const menu = { menuId: 0, menuName: '主类目', children: [] };
      menu.children = handleTree(response.data, "menuId");
      form.value.menuOptions = [menu];
   });
   form.value.parentId = 3;
}

getTreeselect();
</script>
<template>
   <div>
      <tree-select
         v-model:value="form.parentId"
         :options="form.menuOptions"
         :objMap="{
            value: 'menuId',
            label: 'menuName',
            children: 'children'
         }"
         placeholder="选择上级菜单"
      />
   </div>
</template>

<style lang='scss' scoped>
</style>