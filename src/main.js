import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store' 

// use bootstrap
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

// use css style
import './assets/css/font.css'
import './assets/css/style.css'
import './assets/css/responsive.css'

// use fontawesome
import '@fortawesome/fontawesome-free/css/all.min.css'
import '@fortawesome/fontawesome-free/js/all.min.js'

// use firebase
import './plugins/firebase'

const app = createApp(App)
app.use(router)
app.use(store)
app.mount('#app')