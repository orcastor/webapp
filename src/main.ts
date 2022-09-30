import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
// pinia store
import pinia from "@/store/index"
import { Form } from 'vant';

const app = createApp(App);
app.use(Form)
app.use(pinia);
app.mount('#app');
