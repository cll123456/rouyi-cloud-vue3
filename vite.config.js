import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path';
import VitePluginElementPlus from 'vite-plugin-element-plus'
import viteSvgIcons from 'vite-plugin-svg-icons';
import viteCompression from 'vite-plugin-compression';
// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    plugins: [
      vue(),
      VitePluginElementPlus({
        // 如果你需要使用 [component name].scss 源文件，你需要把下面的注释取消掉。
        // 对于所有的 API 你可以参考 https://github.com/element-plus/vite-plugin-element-plus
        // 的文档注释
        // useSource: true
        format: mode === 'development' ? 'esm' : 'cjs',
      }),
      // 这里已经将src/icons/svg/下的svg全部导入，无需再单独导入
      viteSvgIcons({
        // 配置路劲在你的src里的svg存放文件
        iconDirs: [path.resolve(process.cwd(), 'src/assets/icons/svg')],
        symbolId: 'icon-[dir]-[name]',
      }),
      // 启动gzip压缩
      viteCompression()
    ],
    resolve: {
      alias: {
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
    },
  }
})
