import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

const app = createApp(App);

// Zarejestruj Vuex Store
app.use(store);

// Zarejestruj Vue Router
app.use(router);

// Zamontuj aplikację
app.mount('#app');
