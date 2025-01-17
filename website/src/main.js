import { createApp } from 'vue'
import App from './App.vue'
import router from './routes'
import "./styles.less"
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import http from './http'
const app = createApp(App)


app.use(router)
app.use(ElementPlus)


app.config.globalProperties.$http = http

app.mount('#app')







