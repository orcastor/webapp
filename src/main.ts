import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { Button, Field, Form, CellGroup } from 'vant'
// pinia store
import pinia from "@/store/index"

const app = createApp(App);
app.use(Button);
app.use(Field);
app.use(Form);
app.use(CellGroup);
app.use(pinia);
app.mount('#app');
