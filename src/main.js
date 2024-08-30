import { createApp } from 'vue'
import App from './App.vue'
import router from './router'; // Import the router configuration
// require('./bootstrap');

// createApp(App).mount('#app')

const app = createApp(App);

app.use(router);
app.mount('#app');
