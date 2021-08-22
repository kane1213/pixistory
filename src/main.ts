import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './scss/index.css'
import Pagination from 'v-pagination-3'

createApp(App)
  .use(router)
  .use(store)
  .use(Pagination)
  .mount('#app')
