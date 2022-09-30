import { createApp } from 'vue'
import './style.css'
import App from './views/App.vue'
// vue Router
import router from "@/routers/index";
// pinia store
import pinia from "@/store/index"
import { DropdownMenu, DropdownItem } from 'vant';
import { Form } from 'vant';

const app = createApp(App);
app.use(router)
app.use(pinia);
app.use(DropdownMenu);
app.use(DropdownItem);
app.use(Form)
app.mount('#app');
