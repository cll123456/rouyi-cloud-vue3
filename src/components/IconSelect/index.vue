<script setup>
import SvgIcon from './../SvgIcon/index.vue';
import { ref } from '@vue/composition-api';


let icons = []
const modules = import.meta.glob('./../../assets/icons/svg/*.svg');
for (const path in modules) {
  const p = path.split('assets/icons/svg/')[1].split('.svg')[0];
  icons.push(p);
}
/**当前选中的icon */
const iconName = ref('');

/**iconllist */
const iconList = ref(icons);
const emit = defineEmits(['selected']);

const filterIcons = () => {
  iconList.value = icons
  if (iconName.value) {
    iconList.value = icons.filter(item => item.indexOf(iconName.value) !== -1)
  }
}

const selectedIcon = (name) => {
  emit('selected', name)
  document.body.click()
}

const reset = () => {
  iconName.value = ''
  iconList.value = icons
}

defineExpose({
  reset
})
</script>
<template>
  <div class="icon-body">
    <el-input
      v-model="iconName"
      style="position: relative;"
      clearable
      placeholder="请输入图标名称"
      @clear="filterIcons"
      @input.native="filterIcons"
    >
      <i slot="suffix" class="el-icon-search el-input__icon" />
    </el-input>
    <div class="icon-list">
      <div v-for="(item, index) in iconList" :key="index" @click="selectedIcon(item)">
        <svg-icon :icon-class="item" style="height: 30px;width: 16px;" />
        <span>{{ item }}</span>
      </div>
    </div>
  </div>
</template>

<style lang='scss' scoped>
.icon-body {
  width: 100%;
  padding: 10px;
  .icon-list {
    height: 200px;
    overflow-y: scroll;
    div {
      height: 30px;
      line-height: 30px;
      margin-bottom: -5px;
      cursor: pointer;
      width: 33%;
      float: left;
    }
    span {
      display: inline-block;
      vertical-align: -0.15em;
      fill: currentColor;
      overflow: hidden;
    }
  }
}
</style>