import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
// 引入公共样式
import './assets/styles/index.scss'
// 引入路由
import router from './router'
// 引入store
import store from './store'
import Cookies from 'js-cookie'
import 'vite-plugin-svg-icons/register';; // 引入所有的svg图标
import SvgIcon from './components/SvgIcon/index.vue'

const app = createApp(App);

// 使用element-plus 并且设置全局的大小
app.use(ElementPlus, {
  size: Cookies.get('size') || 'medium'
})

app.use(router)
app.use(store)
app.component('svg-icon', SvgIcon)
app.mount('#app')
