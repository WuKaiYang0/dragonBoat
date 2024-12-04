//导入CSS
import '@styles/variables.css'
import '@styles/common.css'
import '@styles/elementUI.css'
//加入标签
const metaNode = document.createElement('link')
import logo from '../public/statics/logo.png'
metaNode.setAttribute('href', logo)
metaNode.setAttribute('rel', 'icon')
document.querySelector('head').appendChild(metaNode)
import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import router from './router/index'
import $requests from '@http/index'
import { ElMessage } from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
const app = createApp(App)
//注册全局elementUI图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.config.globalProperties.$requests = $requests
app.config.globalProperties.$message = ElMessage
app.use(createPinia())
app.use(router)
app.mount('#app')
