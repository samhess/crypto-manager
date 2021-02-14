import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
// import bootstrap scripts, requires popperjs
import 'bootstrap'
// import custom styles and bootstrap default styles
import '@/assets/styles.scss'
// import bootstrap icons
import 'bootstrap-icons/font/bootstrap-icons.css'

createApp(App).use(router).mount('#app')
