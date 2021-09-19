import { createStore } from 'vuex';
import app from './modules/app'
// 创建一个新的 store 实例
const store = createStore({
  modules: {
    app
  }
});


export default store;