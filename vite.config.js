import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';
import viteCompression from 'vite-plugin-compression';

// import Components from 'unplugin-vue-components/vite'
// import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import OptimizationPersist from 'vite-plugin-optimize-persist'
import PkgConfig from 'vite-plugin-package-config'
const pathSrc = path.resolve(__dirname, 'src')

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    plugins: [
      vue(),
      // Components({
      //   resolvers: [
      //     ElementPlusResolver({
      //       importStyle: 'sass',
      //     }),
      //   ],
      // }),
      PkgConfig(),
      OptimizationPersist(),
      // 这里已经将src/icons/svg/下的svg全部导入，无需再单独导入
      createSvgIconsPlugin({
        // 配置路劲在你的src里的svg存放文件
        iconDirs: [path.resolve(process.cwd(), 'src/assets/icons/svg')],
        symbolId: 'icon-[dir]-[name]',
      }),

      // 启动gzip压缩
      viteCompression()
    ],
    resolve: {
      alias: {
        '~/': `${pathSrc}/`,
        '@': path.resolve(__dirname, './src')//设置别名
      },
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue']
    },
    server: {
      port: 4000,//启动端口
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
})
