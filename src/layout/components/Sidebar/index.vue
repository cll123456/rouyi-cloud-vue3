<script setup>
import Logo from "./Logo.vue";
import { computed, getCurrentInstance } from '@vue/composition-api';
import variable from './../../../assets/styles/variables.module.scss';
import SidebarItem from "./SidebarItem.vue";
import store from '@/store'
/**
 * 颜色变量
 */
const variables = computed(() => variable);

const {proxy}  = getCurrentInstance();



/**
 * 系统设置
 */
const settings = computed(() => store.state.settings);
/**
 * 是否折叠
 */
const isCollapse = computed(() => store.state.app.sidebar.opened);


/**
 * 当前选中的菜单
 */
const activeMenu = computed(() => {
  const { meta, path } = proxy.$route;
  // if set path, the sidebar will highlight the path you set
  if (meta.activeMenu) {
    return meta.activeMenu;
  }
  return path;
})

/**
 * 获取左侧菜单的路由
 */
const sidebarRouters = store.getters.sidebarRouters;


</script>

<template>
  <div
    :class="{ 'has-logo': settings.sidebarLogo }"
    :style="{ backgroundColor: settings.menuBgColor}"
  >
    <logo v-if="settings.sidebarLogo" :collapse="!isCollapse" />
    <el-scrollbar :class="settings.sideTheme" wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="!isCollapse"
        :background-color="settings.menuBgColor"
        :text-color="settings.menuTextColor"
        :unique-opened="true"
        :active-text-color="settings.theme"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item
          v-for="(route, index) in sidebarRouters"
          :key="route.path + index"
          :item="route"
          :base-path="route.path"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<style lang="scss" scoped>
</style>