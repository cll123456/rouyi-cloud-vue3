<script setup>
import { ref, computed } from 'vue';
import { useStore } from 'vuex';
import variable from './../../../assets/styles/variables.module.scss';

/**
 * 颜色变量
 */
const variables = computed(() => variable);
/**仓库*/
const store = useStore();

/**展示抽屉 */
const showSettings = ref(true);
/**
 * 当前的主题颜色
 */
const theme = ref(store.state.settings.theme);
/**
 * 当前侧边栏的主题
 */
const sideTheme = ref(store.state.settings.sideTheme);

/**
 * 系统设置
 */
const storeSettings = computed(() => store.state.settings);


/**选择主题 */
const handleTheme = (val, menuStyleObj) => {
  // 存入主题
  store.dispatch('settings/changeSetting', {
    key: 'sideTheme',
    value: val
  })
  // 存储菜单的样式对象
  for (const key in menuStyleObj) {
    if (Object.hasOwnProperty.call(menuStyleObj, key)) {
      store.dispatch('settings/changeSetting', {
        key: key,
        value: menuStyleObj[key]
      })
    }
  }
  sideTheme.value = val;


}

const saveSettingToLocal = (key, value) => {
  let defaultSettings = {
    "topNav": storeSettings.value.topNav,
    "tagsView": storeSettings.value.tagsView,
    "fixedHeader": storeSettings.value.fixedHeader,
    "sidebarLogo": storeSettings.value.sidebarLogo,
    "dynamicTitle": storeSettings.value.dynamicTitle,
    "sideTheme": storeSettings.value.sideTheme,
    "theme": storeSettings.value.theme,
    "menuBgColor": storeSettings.value.menuBgColor,
    "menuTextColor": storeSettings.value.menuTextColor,
    "headerTextColor": storeSettings.value.headerTextColor,
  };
  // 把配置好的风格存入localStoreage

}
</script>
<template>
  <div>
    <el-drawer v-model="showSettings" :withHeader="false" direction="rtl" size="260px">
      <div class="setting-drawer-title">
        <h3 class="drawer-title">经典主题风格设置</h3>
      </div>
      <div class="setting-drawer-block-checbox">
        <div
          class="setting-drawer-block-checbox-item"
          @click="handleTheme('theme-dark',
          {
            menuBgColor: variables.menuBackground,
            menuTextColor: variables.menuColor,
            headerTextColor: variables.logoTitleColor,
          })"
          title="经典1"
        >
          <img src="@/assets/images/dark.svg" alt="dark" />
          <div
            v-if="sideTheme === 'theme-dark'"
            class="setting-drawer-block-checbox-selectIcon"
            style="display: block;"
          >
            <i aria-label="图标: check" class="anticon anticon-check">
              <svg
                viewBox="64 64 896 896"
                data-icon="check"
                width="1em"
                height="1em"
                :fill="theme"
                aria-hidden="true"
                focusable="false"
                class
              >
                <path
                  d="M912 190h-69.9c-9.8 0-19.1 4.5-25.1 12.2L404.7 724.5 207 474a32 32 0 0 0-25.1-12.2H112c-6.7 0-10.4 7.7-6.3 12.9l273.9 347c12.8 16.2 37.4 16.2 50.3 0l488.4-618.9c4.1-5.1.4-12.8-6.3-12.8z"
                />
              </svg>
            </i>
          </div>
        </div>
        <div
          class="setting-drawer-block-checbox-item"
          @click="handleTheme('theme-light',
          {
            menuBgColor: variables.menuLightBackground,
            menuTextColor: variables.menuLightColor,
            headerTextColor: variables.logoLightTitleColor,
          })"
          title="经典2"
        >
          <img src="@/assets/images/light.svg" alt="light" />
          <div
            v-if="sideTheme === 'theme-light'"
            class="setting-drawer-block-checbox-selectIcon"
            style="display: block;"
          >
            <i aria-label="图标: check" class="anticon anticon-check">
              <svg
                viewBox="64 64 896 896"
                data-icon="check"
                width="1em"
                height="1em"
                :fill="theme"
                aria-hidden="true"
                focusable="false"
                class
              >
                <path
                  d="M912 190h-69.9c-9.8 0-19.1 4.5-25.1 12.2L404.7 724.5 207 474a32 32 0 0 0-25.1-12.2H112c-6.7 0-10.4 7.7-6.3 12.9l273.9 347c12.8 16.2 37.4 16.2 50.3 0l488.4-618.9c4.1-5.1.4-12.8-6.3-12.8z"
                />
              </svg>
            </i>
          </div>
        </div>
        <div
          class="setting-drawer-block-checbox-item"
          @click="handleTheme('theme-custom')"
          title="自定义"
        >
          <img class="custom-img" src="@/assets/images/customSlidePic.jpg" alt="light" />
          <div
            v-if="sideTheme === 'theme-custom'"
            class="setting-drawer-block-checbox-selectIcon"
            style="display: block;"
          >
            <i aria-label="图标: check" class="anticon anticon-check">
              <svg
                viewBox="64 64 896 896"
                data-icon="check"
                width="1em"
                height="1em"
                :fill="theme"
                aria-hidden="true"
                focusable="false"
                class
              >
                <path
                  d="M912 190h-69.9c-9.8 0-19.1 4.5-25.1 12.2L404.7 724.5 207 474a32 32 0 0 0-25.1-12.2H112c-6.7 0-10.4 7.7-6.3 12.9l273.9 347c12.8 16.2 37.4 16.2 50.3 0l488.4-618.9c4.1-5.1.4-12.8-6.3-12.8z"
                />
              </svg>
            </i>
          </div>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<style lang='scss' scoped>
.setting-drawer-title {
  margin-bottom: 12px;
  color: rgba(0, 0, 0, 0.85);
  line-height: 22px;
  font-weight: bold;
  .drawer-title {
    font-size: 14px;
  }
}
.setting-drawer-block-checbox {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-top: 10px;
  margin-bottom: 20px;

  .setting-drawer-block-checbox-item {
    position: relative;
    margin-right: 16px;
    border-radius: 2px;
    cursor: pointer;

    img {
      width: 48px;
      height: 48px;
    }

    .custom-img {
      width: 48px;
      height: 38px;
      border-radius: 5px;
      box-shadow: 1px 1px 2px #898484;
    }

    .setting-drawer-block-checbox-selectIcon {
      position: absolute;
      top: 0;
      right: 0;
      width: 100%;
      height: 100%;
      padding-top: 15px;
      padding-left: 24px;
      color: #1890ff;
      font-weight: 700;
      font-size: 14px;
    }
  }
}
</style>