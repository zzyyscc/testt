import { createApp } from 'vue'
// import './style.css'
import App from "./App.vue"
import router from './router/index'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import myconfirm from './utils/myconfirm'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
//引入Pinia构造函数
import { createPinia } from 'pinia'
// 实例化 Pinia
const pinia = createPinia()
const app = createApp(App);
app.use(router).use(ElementPlus, { locale: zhCn }).use(pinia).mount('#app')
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
//全局挂载
app.config.globalProperties.$myconfirm = myconfirm;
