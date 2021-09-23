import { createStore } from 'vuex';
import app from './modules/app';
import settings from './modules/settings';
import getters from './getter';
// 创建一个新的 store 实例
const store = createStore({
  modules: {
    app,
    settings
  },
  getters
});


export default store;