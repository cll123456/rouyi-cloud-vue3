---
sidebarDepth: 2
---


# 依赖分析

> 本系统的依赖相比Vue2的版本来说是少了许多，全部的依赖如下：

```
"dependencies": {
    "@element-plus/icons": "^0.0.11",         # elment的icons
    "@vueuse/core": "^6.4.1",                 # vue 官方提供的助手函数
    "axios": "^0.21.4",                       # 发送网络请求
    "echarts": "^5.2.1",                      # 用于生成图表
    "element-plus": "^1.1.0-beta.20",         # ui 组件库
    "fuse.js": "^6.4.6",                      # 用于快速搜索数据，用在搜索路由的搜索器中
    "js-cookie": "^3.0.1",                    # 使用cookie
    "jsencrypt": "^3.2.1",                    # 用于加密保存密码
    "nprogress": "^0.2.0",                    # 用于网站的进度条
    "vue": "^3.2.20",
    "vue-router": "^4.0.11",
    "vuex": "^4.0.2"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^1.6.1",           # vite为vue提供的官方插件
    "@vue/compiler-sfc": "^3.2.6",            # 解析.vue文件组件
    "eslint": "^7.32.0",                      # 用于代码检查
    "eslint-plugin-vue": "^7.18.0",           # 用于.vue 文件的代码检查
    "sass": "^1.41.1",                        # css 预处理器
    "vite": "^2.5.4",                         # vue 官方推荐的构建工具
    "vite-plugin-compression": "^0.3.5",      # 代码压缩工具
    "vite-plugin-element-plus": "^0.0.12",    # element-plus 官方推荐的按需加载包
    "vite-plugin-svg-icons": "^1.0.4",        # vite 解析svg 文件
    "vitepress": "^0.20.0"                    # 生成文档
  }
```