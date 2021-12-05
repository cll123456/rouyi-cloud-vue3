/**
 * 定义store的getters来，直接使用一些变量
 */
const getters = {
  /**
   * 侧边栏状态
   * @param {*} state 
   * @returns 
   */
  sidebar: state => state.app.sidebar,
  /**
   * 页面布局大小
   * @param {*} state 
   * @returns 
   */
  size: state => state.app.size,
  /**
   * 设备的类型，宽度<992的是移动端
   * @param {*} state 
   * @returns 
   */
  device: state => state.app.device,
  /**
   * 不需要缓存的页面 
   * @param {*} state 
   * @returns 
   */
  visitedViews: state => state.tagsView.visitedViews,
  /**
   * 缓存的页面
   * @param {*} state 
   * @returns 
   */
  cachedViews: state => state.tagsView.cachedViews,
  /**
   * token
   * @param {*} state 
   * @returns 
   */
  token: state => state.user.token,
  /**
   * 头像
   * @param {*} state 
   * @returns 
   */
  avatar: state => state.user.avatar,
  /**
   * 用户名称
   * @param {*} state 
   * @returns 
   */
  name: state => state.user.name,
  /**
   * 个人简介
   * @param {*} state 
   * @returns 
   */
  introduction: state => state.user.introduction,
  /**
   * 角色
   * @param {*} state 
   * @returns 
   */
  roles: state => state.user.roles,
  /**
   * 权限
   * @param {*} state 
   * @returns 
   */
  permissions: state => state.user.permissions,
  /**
   * 权限路由
   * @param {*} state 
   * @returns 
   */
  permission_routes: state => state.permission.routes,
  /**
   * topbar 路由
   * @param {*} state 
   * @returns 
   */
  topbarRouters:state => state.permission.topbarRouters,
  /**
   * 默认路由
   * @param {*} state 
   * @returns 
   */
  defaultRoutes:state => state.permission.defaultRoutes,
  /**
   * 侧边栏路由
   * @param {*} state 
   * @returns 
   */
  sidebarRouters:state => state.permission.sidebarRouters,
}
export default getters