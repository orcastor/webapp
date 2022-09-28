import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { Button, Field, Form, CellGroup } from 'vant'

const app = createApp(App);
app.use(Button);
app.use(Field);
app.use(Form);
app.use(CellGroup);
app.mount('#app');
