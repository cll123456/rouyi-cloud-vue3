import Vue from 'vue';
import Vuex from 'vuex'
import app from './modules/app';
import settings from './modules/settings';
import user from './modules/user'
import tagsView from './modules/tagsView'
import permission from './modules/permission'
import getters from './getter';


Vue.use(Vuex);

// 创建一个新的 store 实例
const store = new Vuex.Store({
  modules: {
    app,
    user,
    tagsView,
    permission,
    settings
  },
  getters
});


export default store;