import { createApp } from 'vue'
import App from './App.vue'
// If you want to use ElMessage, import it.
import ElementPlus from 'element-plus'
import "element-plus/theme-chalk/src/message.scss"
// 引入公共样式
import './assets/styles/index.scss'
// 引入路由
import router from './router'
import 'virtual:svg-icons-register' 
// 引入store
import store from './store'

import SvgIcon from './components/SvgIcon/index.vue'
// 判断当前登录
import './permission'
// 注册指令
import installDirective from './directives'

const app = createApp(App);

// 使用element-plus 并且设置全局的大小
app.use(ElementPlus)

installDirective(app)

app.use(router)
app.use(store)
app.component('svg-icon', SvgIcon)
app.mount('#app')
