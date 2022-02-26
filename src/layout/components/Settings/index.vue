<script setup>
import { ref, computed, watch } from '@vue/composition-api';
import variable from './../../../assets/styles/variables.module.scss';
import originElement from 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios';
import { ELEMENT_SPECIAL_ID } from '../../../config/commonConfig';
import { getElColor } from '../../../utils/ruoyi';
import { Loading, Message } from 'element-ui';
import { useDynamicTitle } from '../../../hooks/dynamicTitle';

/**
 * 颜色变量
 */
const variables = computed(() => variable);
/**仓库*/
import store from '@/store'

/**展示抽屉 */
const showSettings = ref(false);
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

/**自定义颜色form */
const customForm = ref({
  menuBgColor: '',
  menuTextColor: '',
  headerTextColor: '',
})
/**自定义颜色 ref */
const customFormRef = ref(null);
/**展示自定义主题的弹框 */
const showCustomDia = ref(false);
/**打开自定义颜色弹框 */
const openCustomDia = () => {
  customForm.value = {
    menuBgColor: storeSettings.value.menuBgColor,
    menuTextColor: storeSettings.value.menuTextColor,
    headerTextColor: storeSettings.value.headerTextColor
  }
  showCustomDia.value = true;
}
/**改变主题 */
const changeTheme = () => {
  handleTheme('theme-custom',
    {
      menuBgColor: customForm.value.menuBgColor,
      menuTextColor: customForm.value.menuTextColor,
      headerTextColor: customForm.value.menuTextColor,
    });
  showCustomDia.value = false;
}

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
/**自定义颜色的数组 */
const predefineColors = ref([
  '#409EFF',
  '#ff4500',
  '#ff8c00',
  '#ffd700',
  '#90ee90',
  '#00ced1',
  '#1e90ff',
  '#c71585',
])
/** 当前的主题颜色 */
const curThemes = ref({
  theme: storeSettings.value.theme,
  dangerColor: storeSettings.value.dangerColor,
  warningColor: storeSettings.value.warningColor,
  infoColor: storeSettings.value.infoColor,
  successColor: storeSettings.value.successColor,
})

/**把数据存入localstorage */
const saveSettingToLocal = () => {
  const loading = Loading.service({
    lock: true,
    text: '正在保存主题,玩命加载中……',
    spinner: 'el-icon-loading',
    background: 'rgba(0, 0, 0, 0.7)',
  })
  let defaultSettings = {
    "topNav": storeSettings.value.topNav,
    "tagsView": storeSettings.value.tagsView,
    "fixedHeader": storeSettings.value.fixedHeader,
    "sidebarLogo": storeSettings.value.sidebarLogo,
    "dynamicTitle": storeSettings.value.dynamicTitle,
    "sideTheme": storeSettings.value.sideTheme,
    "menuBgColor": storeSettings.value.menuBgColor,
    "menuTextColor": storeSettings.value.menuTextColor,
    "headerTextColor": storeSettings.value.headerTextColor,
    "theme": storeSettings.value.theme,
    "dangerColor": storeSettings.value.dangerColor,
    "warningColor": storeSettings.value.warningColor,
    "infoColor": storeSettings.value.infoColor,
    "successColor": storeSettings.value.successColor,
  };
  // 把配置好的风格存入localStoreage
  localStorage.setItem("layout-setting", JSON.stringify(defaultSettings));
  loading.close();
  showSettings.value = false;
}
const resetSetting = () => {
  ElLoading.service({
    lock: true,
    text: "正在清除设置缓存并刷新，请稍后...",
    spinner: "el-icon-loading",
    background: "rgba(0, 0, 0, 0.7)"
  });
  localStorage.removeItem("layout-setting")
  setTimeout("window.location.reload()", 1000)
}
/**是否需要tagview */
const tagsView = computed({
  get: () => storeSettings.value.tagsView,
  set: (val) => {
    store.dispatch('settings/changeSetting', {
      key: 'tagsView',
      value: val
    })
  }
})
/**是否需要固定头部 */
const fixedHeader = computed({
  get: () => storeSettings.value.fixedHeader,
  set: (val) => {
    store.dispatch('settings/changeSetting', {
      key: 'fixedHeader',
      value: val
    })
  }
})

/**是否需要侧边栏的logo */
const sidebarLogo = computed({
  get: () => storeSettings.value.sidebarLogo,
  set: (val) => {
    store.dispatch('settings/changeSetting', {
      key: 'sidebarLogo',
      value: val
    })
  }
})


/**是否需要侧边栏的动态网页的title */
const dynamicTitle = computed({
  get: () => storeSettings.value.dynamicTitle,
  set: (val) => {
    store.dispatch('settings/changeSetting', {
      key: 'dynamicTitle',
      value: val
    })
    // 动态设置网页标题
    useDynamicTitle()
  }
})


/**当主题发生改变，请求在线的网站，生成颜色 */
watch(theme, (val) => {
  genColorOnline(val)
})
/**在线生成颜色 */
const genColorOnline = (color) => {
  const loading = Loading.service({
    lock: true,
    text: '正在获取在线主题,玩命加载中……',
    spinner: 'el-icon-loading',
    background: 'rgba(0, 0, 0, 0.7)',
  })
  axios({
    url: '/onlineColor/api/painter/support',
    method: 'get',
    params: {
      primary: color.split('#')[1]
    }
  }).then(res => {
    //  这里获取到的是一个数组，数组里面结构如下
    /**
     * danger: (9) ['#FDD4D2', '#FBA7AB', '#F3798C', '#E7567B', '#D82463', '#B91A61', '#9B125D', '#7D0B55', '#67064F']
    info: (9) ['#CDF0FD', '#9CDCFB', '#69C0F5', '#43A3EC', '#0B79E0', '#085DC0', '#0545A1', '#033181', '#02226B']
    primary: (9) ['#FCCFD9', '#F9A0BD', '#EE6EA5', '#DD4897', '#C71585', '#AB0F80', '#8F0A78', '#73066B', '#5D045F']
    success: (9) ['#EBFBD4', '#D4F7AA', '#B0E97B', '#8AD357', '#5AB728', '#419D1D', '#2D8314', '#1B6A0C', '#0F5707']
    warning: (9) ['#FFF4CC', '#FFE699', '#FFD466', '#FFC23F', '#FFA500', '#DB8500', '#B76900', '#934F00', '#7A3D00']F
     */
    // 判断当前的primary颜色下标，获取danger, info, success, warning
    const primaryIndex = res.data.primary.indexOf(color);
    /**需要替换el的主题 */
    const newThemes = {
      theme: color,
      dangerColor: res.data.danger[primaryIndex],
      warningColor: res.data.warning[primaryIndex],
      infoColor: res.data.info[primaryIndex],
      successColor: res.data.success[primaryIndex],
    }

    //设置颜色
    settingTheme(curThemes.value, newThemes);
    loading.close();
    Message.success('设置成功！')

    // 保存到store中
    for (const key in newThemes) {
      if (Object.hasOwnProperty.call(newThemes, key)) {
        store.dispatch('settings/changeSetting', {
          key: key,
          value: newThemes[key]
        })
      }
    }
  }).catch(err => {
    loading.close();
    Message.error('获取在线主题失败，请检查网络！！！')
  })
}

/**
 * 设置主题
 */
const settingTheme = (curThemes, newThemes) => {
  // 需要生成的新的样式
  let newSyles = originElement;
  // 把当前样式和需要替换的样式直接替换
  for (const key in curThemes) {
    if (Object.hasOwnProperty.call(curThemes, key)) {
      // 获取原样式的所有样式数组和最新的进行替换
      const originColorArrs = getElColor(curThemes[key].split('#')[1]);
      const newColorArrs = getElColor(newThemes[key].split('#')[1]);
      // 更新样式
      originColorArrs.forEach((color, index) => {
        newSyles = newSyles.replace(new RegExp(color, 'ig'), newColorArrs[index])
      })
    }
  }
  // 判断当前是否存在自定义的样式
  let styleTag = document.getElementById(ELEMENT_SPECIAL_ID);
  // 如果不存在直接创建一个style
  if (!styleTag) {
    styleTag = document.createElement('style')
    styleTag.setAttribute('id', ELEMENT_SPECIAL_ID)
    document.head.appendChild(styleTag)
  }
  // 找出所有的颜色
  styleTag.innerText = newSyles;
}

const openSetting = () => {
  showSettings.value = true;
}
/**对外暴露一个方法，来设置主题 */
defineExpose({
  settingTheme,
  openSetting,
})

</script>
<template>
  <div>
    <el-drawer :visible.sync="showSettings" :withHeader="false" direction="rtl" size="300px">
      <div class="setting-drawer--container">
        <div class="setting-drawer-title">
          <h3 class="drawer-title">经典主题风格设置</h3>
        </div>
        <div class="setting-drawer-block-checbox">
          <!-- 暗色调 -->
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
          <!-- 亮色调 -->
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
          <!-- 自定义色调 -->
          <div class="setting-drawer-block-checbox-item" @click="openCustomDia" title="自定义">
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
        <div class="drawer-item">
          <span>主题颜色</span>
          <span class="comp-style">
            <el-color-picker v-model="theme" :predefine="predefineColors" />
          </span>
        </div>
        <el-divider />

        <h3 class="drawer-title">系统布局配置</h3>

        <!-- <div class="drawer-item">
        <span>开启 TopNav</span>
        <span class="comp-style">
          <el-switch v-model="topNav" class="drawer-switch" />
        </span>
        </div>-->

        <div class="drawer-item">
          <span>开启 Tags-Views</span>
          <span class="comp-style">
            <el-switch v-model="tagsView" class="drawer-switch" />
          </span>
        </div>

        <div class="drawer-item">
          <span>固定 Header</span>
          <span class="comp-style">
            <el-switch v-model="fixedHeader" class="drawer-switch" />
          </span>
        </div>

        <div class="drawer-item">
          <span>显示 Logo</span>
          <span class="comp-style">
            <el-switch v-model="sidebarLogo" class="drawer-switch" />
          </span>
        </div>

        <div class="drawer-item">
          <span>动态标题</span>
          <span class="comp-style">
            <el-switch v-model="dynamicTitle" class="drawer-switch" />
          </span>
        </div>
        <el-divider />
        <el-button type="primary" plain icon="el-icon-document-add" @click="saveSettingToLocal">保存配置</el-button>
        <el-button plain icon="el-icon-refresh" @click="resetSetting">重置配置</el-button>
      </div>
    </el-drawer>

    <el-dialog :title="'自定义颜色'" width="400px" append-to-body v-model="showCustomDia">
      <!-- 选择自定义颜色 -->
      <el-form :model="customForm" ref="customFormRef" label-width="120px">
        <el-form-item label="左侧菜单背景" prop="menuBgColor">
          <el-color-picker v-model="customForm.menuBgColor" />
        </el-form-item>
        <el-form-item label="菜单标题颜色" prop="headerTextColor">
          <el-color-picker v-model="customForm.headerTextColor" />
        </el-form-item>
        <el-form-item label="菜单字体颜色" prop="menuTextColor">
          <el-color-picker v-model="customForm.menuTextColor" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="changeTheme">确 定</el-button>
          <el-button @click="showCustomDia = false">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style lang='scss' scoped>
.setting-drawer--container {
  padding: 10px 20px 20px 20px;
}
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

.drawer-item {
  color: rgba(0, 0, 0, 0.65);
  padding: 12px 0;
  font-size: 14px;

  .comp-style {
    float: right;
    margin: -3px 8px 0px 0px;
  }
}
</style>