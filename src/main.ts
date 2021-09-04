import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './scss/index.css'
import PrimeVue from 'primevue/config';
import Paginator from 'primevue/paginator';
import 'primevue/resources/themes/saga-blue/theme.css';
import 'primevue/resources/primevue.min.css';
import 'primeicons/primeicons.css';
// App.use(PrimeVue);
// App.component('Paginator', Paginator);
createApp(App)
  .use(router)
  .use(store)
  .use(PrimeVue)
  .component('Paginator', Paginator)
  .mount('#app')
