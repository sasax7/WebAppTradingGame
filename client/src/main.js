// main.js
import "bootstrap/dist/css/bootstrap.min.css";
import { createApp } from "vue";
import { VueCookieNext } from 'vue-cookie-next';
import Vue3Toastify from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import App from "./App.vue";
import vuetify from './plugins/vuetify';
import router from './router';

const app = createApp(App);
app.use(router);
app.use(vuetify);
app.use(Vue3Toastify);
app.use(VueCookieNext);
app.mount("#app");