import { createApp } from 'vue';
import App from '@/App';
import { store } from '@/store';

import '@/main.css';

const app = createApp(App);

app.use(store);

app.mount('#app');
