// main.js
import { createApp } from "vue";
import App from "./App.vue";
import vuetify from './plugins/vuetify'; 
import router from './router';

import "bootstrap/dist/css/bootstrap.min.css";


const app = createApp(App);
app.use(router);
app.use(vuetify);

app.mount("#app");