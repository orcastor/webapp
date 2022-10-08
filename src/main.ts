import { createApp } from 'vue'
import './style.css'
import App from './views/App.vue'
// vue Router
import router from "@/routers/index";
// pinia store
import pinia from "@/store/index"

const app = createApp(App);
app.use(router);
app.use(pinia);

app.mount('#app');
