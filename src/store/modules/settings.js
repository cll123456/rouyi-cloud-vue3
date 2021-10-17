import defaultSettings from '../../config/settings.js'

const { warningColor,
  infoColor,
  dangerColor,
  successColor,
  primaryColor,
  sideTheme,
  menuBgColor,
  menuTextColor,
  headerTextColor,
  showSettings,
  topNav,
  tagsView,
  fixedHeader,
  sidebarLogo,
  dynamicTitle } = defaultSettings
/**
 * 布局设置
 */
const storageSetting = JSON.parse(localStorage.getItem('layout-setting')) || '';

const state = {
  /**
   * 网页的标题
   */
  title: '',
  /**
   * 网页的主题颜色
   */
  theme: storageSetting.theme || primaryColor,
  /**
   * 网页成功颜色
   */
  successColor: storageSetting.theme || successColor,
  /**
   * 网页danger颜色
   */
  dangerColor: storageSetting.theme || dangerColor,
  /**
   * 网页info颜色
   */
  infoColor: storageSetting.theme || infoColor,
  /**
   * 网页warning也拿
   */
  warningColor: storageSetting.theme || warningColor,
  /**
   * 侧边栏主题
   */
  sideTheme: storageSetting.sideTheme || sideTheme,
  /**
   * 菜单背景颜色
   */
  menuBgColor: storageSetting.menuBgColor || menuBgColor,
  /**
   * 菜单文本颜色
   */
  menuTextColor: storageSetting.menuTextColor || menuTextColor,
  /**
   * 头部文本颜色
   */
  headerTextColor: storageSetting.headerTextColor || headerTextColor,
  /**
   * 显示设置按钮
   */
  showSettings: showSettings,
  /**
   * 是否显示顶部导航
   */
  topNav: storageSetting.topNav === undefined ? topNav : storageSetting.topNav,
  /**
   * 是否显示 tagsView 头下面的tab
   */
  tagsView: storageSetting.tagsView === undefined ? tagsView : storageSetting.tagsView,
  /**
   * 固定头部
   */
  fixedHeader: storageSetting.fixedHeader === undefined ? fixedHeader : storageSetting.fixedHeader,
  /**
   * 侧边logo
   */
  sidebarLogo: storageSetting.sidebarLogo === undefined ? sidebarLogo : storageSetting.sidebarLogo,
  /**
   * 动态标题
   */
  dynamicTitle: storageSetting.dynamicTitle === undefined ? dynamicTitle : storageSetting.dynamicTitle
}
const mutations = {
  /**
   * 修改系统设置
   * @param {*} state 
   * @param {*} param1 
   */
  CHANGE_SETTING: (state, { key, value }) => {
    if (state.hasOwnProperty(key)) {
      state[key] = value
    }
  }
}

const actions = {
  /**
   * 修改布局设置
   * @param {*} param0 
   * @param {*} data 
   */
  changeSetting({ commit }, data) {
    commit('CHANGE_SETTING', data)
  },
  /**
   * 设置网页标题
   * @param {*} param0 
   * @param {*} title 
   */
  setTitle({ commit }, title) {
    state.title = title
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

