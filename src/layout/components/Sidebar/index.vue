<script setup>
import Logo from "./Logo.vue";
import { computed, ref } from 'vue';
import variable from './../../../assets/styles/variables.scss';
import { useStore } from 'vuex';
import SidebarItem from "./SidebarItem.vue";
import { useRoute } from "vue-router";

/**
 * 颜色变量
 */
const variables = computed(() => variable);

const route = useRoute();

const store = useStore();

/**
 * 系统设置
 */
const settings = computed(() => store.state.settings);
/**
 * 是否折叠
 */
const isCollapse = computed(() => store.state.app.sidebar.open);

/**
 * 当前选中的菜单
 */
const activeMenu = computed(() => {
  const { meta, path } = route;
  // if set path, the sidebar will highlight the path you set
  if (meta.activeMenu) {
    return meta.activeMenu;
  }
  return path;
})

const sidebarRouters = ref([

  {
    path: 'index',
    component: (resolve) => require(['@/views/index'], resolve),
    name: 'Index',
    meta: { title: '首页', icon: 'dashboard', affix: true }
  },
  {
    path: 'profile',
    component: (resolve) => require(['@/views/system/user/profile/index'], resolve),
    name: 'Profile',
    meta: { title: '个人中心', icon: 'user' }
  }

])

</script>

<template>
  <div
    :class="{ 'has-logo': settings.sidebarLogo }"
    :style="{ backgroundColor: settings.sideTheme === 'theme-dark' ? variables.menuBackground : variables.menuLightBackground }"
  >
    <logo v-if="settings.sidebarLogo" :collapse="isCollapse" />
    <el-scrollbar :class="settings.sideTheme" wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="settings.sideTheme === 'theme-dark' ? variables.menuBackground : variables.menuLightBackground"
        :text-color="settings.sideTheme === 'theme-dark' ? variables.menuColor : variables.menuLightColor"
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