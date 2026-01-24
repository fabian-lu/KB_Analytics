import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import i18n from './i18n'
import { vScrollbarAutohide } from './directives/scrollbarAutohide'
import './index.css'

const app = createApp(App)
app.use(router)
app.use(i18n)
app.directive('scrollbar-autohide', vScrollbarAutohide)
app.mount('#app')
