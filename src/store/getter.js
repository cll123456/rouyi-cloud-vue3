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
  // visitedViews: state => state.tagsView.visitedViews,
  // cachedViews: state => state.tagsView.cachedViews,
  // token: state => state.user.token,
  // avatar: state => state.user.avatar,
  // name: state => state.user.name,
  // introduction: state => state.user.introduction,
  // roles: state => state.user.roles,
  // permissions: state => state.user.permissions,
  // permission_routes: state => state.permission.routes,
  // topbarRouters:state => state.permission.topbarRouters,
  // defaultRoutes:state => state.permission.defaultRoutes,
  // sidebarRouters:state => state.permission.sidebarRouters,
}
export default getters