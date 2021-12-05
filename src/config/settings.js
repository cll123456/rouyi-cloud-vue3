import variable from './../assets/styles/variables.module.scss';
/**
 * 系统配置
 */
export default {
  /**
   * 网页标题
   */
  title: '若依V3',
  /**
   * 侧边栏主题 深色主题theme-dark，浅色主题theme-light
   */
  sideTheme: 'theme-dark',
  /**
   * 菜单背景颜色
   */
  menuBgColor: variable.menuBackground,
  /**
   * 菜单文本颜色
   */
  menuTextColor: variable.menuColor,
  /**
   * 头部文本颜色
   */
  headerTextColor: variable.logoTitleColor,

  /**
   * 网页主要颜色
   */
   primaryColor: variable.primaryColor,
   /**
    * 网页成功颜色
    */
   successColor: variable.successColor,
   /**
    * 网页danger颜色
    */
   dangerColor: variable.dangerColor,
   /**
    * 网页info颜色
    */
   infoColor: variable.infoColor,
   /**
    * 网页warning也拿
    */
   warningColor: variable.warningColor,

  /**
   * 是否系统布局配置
   */
  showSettings: false,

  /**
   * 是否显示顶部导航
   */
  topNav: false,

  /**
   * 是否显示 tagsView
   */
  tagsView: true,

  /**
   * 是否固定头部
   */
  fixedHeader: false,

  /**
   * 是否显示logo
   */
  sidebarLogo: true,

  /**
   * 是否显示动态标题
   */
  dynamicTitle: false,

  /**
   * @type {string | array} 'production' | ['production', 'development']
   * @description Need show err logs component.
   * The default is only used in the production env
   * If you want to also use it in dev, you can pass ['production', 'development']
   */
  errorLog: 'production',
}
