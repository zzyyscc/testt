import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    host: '0.0.0.0', //解决控制台 ：Network: use --host to expose
    port: 8080, //配置端口号
    hmr: true, //开启热更新
    open: true, //
    // proxy: {
    //   '/api': {
    //     target: 'http://localhost:8089/', //接口地址
    //     changeOrigin: true,
    //     rewrite: (path) => path.replace(/^\/api/, '')
    //   },
    // }

  },
  resolve: {
    alias: [
      {
        find: '@',
        replacement: resolve(__dirname, 'src')
      }
    ]
  },
  define: {
    'process.env': {
      //'BASE_API': "http://192.168.31.70:8089"
      'BASE_API': "http://localhost:8089"
    }
  },



})
