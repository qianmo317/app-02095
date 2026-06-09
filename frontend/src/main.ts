import { createApp } from 'vue'
import { createPinia } from 'pinia'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import App from './App.vue'
import router from './router'
import { setupStoreBridge } from './stores/storeBridge'
import './styles/global.scss'

const app = createApp(App)
const pinia = createPinia()

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.config.errorHandler = (err, _instance, info) => {
  console.error(`[PetHome Error] ${info}:`, err)
  import('element-plus').then(({ ElMessage }) => {
    ElMessage.error('系统发生异常，请刷新页面重试')
  })
}

app.use(pinia)
setupStoreBridge()
app.use(router)
app.mount('#app')
