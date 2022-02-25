import Cookies from 'js-cookie'

const state = {
  /**
   * 侧边栏状态
   */
  sidebar: {
    /**
     * 是否打开
     */
    opened: Cookies.get('sidebarStatus') ? !!+Cookies.get('sidebarStatus') : true,
    /**
     * 是否需要动画
     */
    withoutAnimation: false
  },
  /**
   * 当前设备类型
   */
  device: 'desktop',
  /**
   * 当前设备的字体大小
   */
  size: Cookies.get('size') || 'default'
}

/**
 * mutations
 */
const mutations = {
  /**
   * 切换侧边栏
   * @param {*} state 
   */
  TOGGLE_SIDEBAR: state => {
    state.sidebar.opened = !state.sidebar.opened
    state.sidebar.withoutAnimation = false
    if (state.sidebar.opened) {
      Cookies.set('sidebarStatus', 1)
    } else {
      Cookies.set('sidebarStatus', 0)
    }
  },
  /**
   * 带有动画关闭
   * @param {*} state 
   * @param {*} withoutAnimation 
   */
  CLOSE_SIDEBAR: (state, withoutAnimation) => {
    Cookies.set('sidebarStatus', 0)
    state.sidebar.opened = false
    state.sidebar.withoutAnimation = withoutAnimation
  },
  /**
   * 切换设备
   * @param {*} state 
   * @param {*} device 
   */
  TOGGLE_DEVICE: (state, device) => {
    state.device = device
  },
  /**
   * 设置全局的字体大小
   * @param {*} state 
   * @param {*} size 
   */
  SET_SIZE: (state, size) => {
    state.size = size
    Cookies.set('size', size)
  }
}

const actions = {
  toggleSideBar({ commit }) {
    commit('TOGGLE_SIDEBAR')
  },
  closeSideBar({ commit }, { withoutAnimation }) {
    commit('CLOSE_SIDEBAR', withoutAnimation)
  },
  toggleDevice({ commit }, device) {
    commit('TOGGLE_DEVICE', device)
  },
  setSize({ commit }, size) {
    commit('SET_SIZE', size)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
