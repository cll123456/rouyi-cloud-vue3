// vite.config.js
import { createVuePlugin } from 'vite-plugin-vue2';
// 支持打包成ie浏览器
import legacy from '@vitejs/plugin-legacy';
// 支持setup函数
import ScriptSetup from 'unplugin-vue2-script-setup/vite';
import path from 'path';
// 处理svg文件
import { svgBuilder } from './vite-plugin/svg-loader'

export default {
  plugins: [
    createVuePlugin(/* options */),

    ScriptSetup({ /* options */ }),
    // 这里已经将src/icons/svg/下的svg全部导入，无需再单独导入
    svgBuilder('./src/assets/icons/svg/'),
    legacy({
      targets: ['ie >= 11'],
      additionalLegacyPolyfills: ['regenerator-runtime/runtime']
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')//设置别名
    },
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue']
  },

  server: {
    port: 4001,//启动端口
    // open: true,
    proxy: {
      // 选项写法
      '/api': {
        target: 'http://vue.ruoyi.vip',//代理到官网地址
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/api/, '')
      },
      // 配置获取在线主题的网络请求
      '/onlineColor': {
        target: 'https://app.uibakery.io/',//代理到官网地址
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/onlineColor/, '')
      },
    },
  }
}