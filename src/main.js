import { createApp } from 'vue'
import App from './App.vue'
import router from './router'; // 라우터
import store from './store'; // vuex

createApp(App).use(store).use(router).mount('#app') // use router
