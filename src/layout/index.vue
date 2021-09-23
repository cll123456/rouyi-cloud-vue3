<script setup>
import { useWindowSize } from "@vueuse/core";
import { computed, watchEffect } from "vue";
import { useStore } from "vuex";
import AppMain from './components/AppMain.vue';
import Sidebar from './components/Sidebar/index.vue'

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
const needTagsView = computed(() => store.state.settings.needTagsView);

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

console.log(classObj.value)

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
  console.log(width.value, device.value, sidebar.value.opened)
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
</script>

<template>
  <div :class="classObj" class="app-wrapper" :style="{ '--current-color': theme }">
    <div
      v-if="device === 'mobile' && sidebar.opened"
      class="drawer-bg"
      @click="handleClickOutside"
    />
    <sidebar class="sidebar-container"/>
    <div :class="{ hasTagsView: needTagsView }" class="main-container">
      <div :class="{ 'fixed-header': fixedHeader }">
        <!-- <navbar /> -->
        <!-- <tags-view v-if="needTagsView" /> -->
      </div>
      <app-main />
      <!-- <right-panel>
        <settings />
      </right-panel>-->
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "./../assets/styles/mixin.scss";
@import "./../assets/styles/variables.scss";

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