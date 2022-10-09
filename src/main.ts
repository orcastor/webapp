import { createApp } from 'vue'
import './style.css'
import App from './views/App.vue'
// vue Router
import router from "@/routers/index";
// pinia store
import pinia from "@/store/index"
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const app = createApp(App);
app.use(router);
app.use(pinia);

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.mount('#app');
