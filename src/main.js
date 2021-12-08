import Vue from 'vue'
import App from './App.vue'
import VueCompositionAPI from '@vue/composition-api'
import router from './router';
import store from './store'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import '@/assets/styles/index.scss';
import './permission';
import 'vite-plugin-svg-icons/register';
import directive from './directives/index' // directive

Vue.use(ElementUI);
Vue.use(directive);
Vue.use(VueCompositionAPI);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app')