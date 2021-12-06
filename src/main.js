import Vue from 'vue'
import App from './App.vue'
import VueCompositionAPI from '@vue/composition-api'
import router from './router';
import store from './store'
Vue.use(VueCompositionAPI);
import ElementUI from 'element-ui';
import '@/assets/styles/index.scss';
import './permission';
import 'vite-plugin-svg-icons/register';


Vue.use(ElementUI);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app')