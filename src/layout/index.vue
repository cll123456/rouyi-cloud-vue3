<script setup>
import { useWindowSize } from "@vueuse/core";
import { computed, watchEffect, onMounted, ref } from "vue";
import { useStore } from "vuex";
import AppMain from './components/AppMain.vue';
import Sidebar from './components/Sidebar/index.vue'
import Navbar from './components/Navbar/index.vue';
import TagsView from "./components/tagsView/index.vue";
import Settings from './components/Settings/index.vue';
import defaultSettings from './../config/settings'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import Cookies from 'js-cookie'
/**
 * store
 */
const store = useStore();
/**
  * 当前的主题颜色
  */
const theme = computed(() => store.state.settings.theme);
/**
  * 侧边栏的主题
  */
const sideTheme = computed(() => store.state.settings.sideTheme);
/**
 * 侧边栏状态
 */
const sidebar = computed(() => store.state.app.sidebar);
/**
 * 当前设备
 */
const device = computed(() => store.state.app.device);
/**
 * 是否需要tagsview tab
 */
const tagsView = computed(() => store.state.settings.tagsView);

/**
 * 固定头部
 */
const fixedHeader = computed(() => store.state.settings.fixedHeader);

/**
 * 类名对象
 */
const classObj = computed(() => ({
  hideSidebar: !sidebar.value.opened,
  openSidebar: sidebar.value.opened,
  withoutAnimation: sidebar.value.withoutAnimation,
  mobile: device.value === 'mobile'
}))


/**
 * 获取当前窗口的大小
 */
const { width, height } = useWindowSize();
/**
 * bootsrap  宽度小于这个的就是移动端
 */
const WIDTH = 992;

/**
 * 监听窗口变化
 */
watchEffect(() => {
  // 一打开就是手机端并且侧边栏是打开着的
  if (device.value === 'mobile' && sidebar.value.opened) {
    store.dispatch('app/closeSideBar', { withoutAnimation: false })
  }
  // 当前达到移动端的屏幕宽度
  if (width.value - 1 < WIDTH) {
    store.dispatch('app/toggleDevice', 'mobile')
    store.dispatch('app/closeSideBar', { withoutAnimation: true })
  } else {
    store.dispatch('app/toggleDevice', 'desktop')
  }
})

/**
 * 针对移动端，点击关闭菜单
 */
const handleClickOutside = () => {
  store.dispatch('app/closeSideBar', { withoutAnimation: false })
}

const settingRef = ref(null);

/**打开setting layou */
const settingLayout = () => {
  settingRef.value.openSetting();
}

onMounted(() => {
  // 判断本地中的主题是否和element一致，如果不一致，需要设置主题
  const storageSetting = JSON.parse(localStorage.getItem('layout-setting')) || {};
  const { warningColor,
    infoColor,
    dangerColor,
    successColor,
    primaryColor } = defaultSettings

  if (Object.keys(storageSetting).length > 0
    && storageSetting.theme
    && storageSetting.theme !== primaryColor) {
    // 设置主题
    settingRef.value.settingTheme({
      theme: primaryColor,
      dangerColor: dangerColor,
      warningColor: warningColor,
      infoColor: infoColor,
      successColor: successColor,
    }, {
      theme: storageSetting.theme,
      dangerColor: storageSetting.dangerColor,
      warningColor: storageSetting.warningColor,
      infoColor: storageSetting.infoColor,
      successColor: storageSetting.successColor,
    })
  }
})

// 大小
const size = computed(() => store.getters.size);


</script>

<template>
  <el-config-provider :locale="zhCn" :size="size">
    <div :class="classObj" class="app-wrapper" :style="{ '--current-color': theme }">
      <div
        v-if="device === 'mobile' && sidebar.opened"
        class="drawer-bg"
        @click="handleClickOutside"
      />
      <sidebar class="sidebar-container" />
      <div :class="{ hasTagsView: tagsView }" class="main-container">
        <div :class="{ 'fixed-header': fixedHeader }">
          <navbar @settingLayout="settingLayout" />
          <tags-view v-if="tagsView" />
        </div>
        <app-main />
        <settings ref="settingRef" />
      </div>
    </div>
  </el-config-provider>
</template>

<style lang="scss" scoped>
@import "./../assets/styles/mixin.scss";
@import "./../assets/styles/variables.module.scss";

.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;

  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}

.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}

.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  width: calc(100% - #{$base-sidebar-width});
  transition: width 0.28s;
}

.hideSidebar .fixed-header {
  width: calc(100% - 54px);
}

.mobile .fixed-header {
  width: 100%;
}
</style>