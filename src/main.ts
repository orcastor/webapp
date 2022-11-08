import { createApp } from 'vue'
import './style.css'
import App from './views/App.vue'
// vue Router
import router from "@/routers/index";

import { setCallback } from "@/api/index";

import 'element-plus/es/components/message/style/css';
import { ElMessage } from 'element-plus';
setCallback(ElMessage);

const app = createApp(App);
app.use(router);

app.mount('#app');
