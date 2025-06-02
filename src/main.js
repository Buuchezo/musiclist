import { createApp } from 'vue'
import App from './App.vue'
import { createVuetify } from 'vuetify' // Named import
import 'vuetify/styles'

const app = createApp(App)

app.use(createVuetify)

app.mount('#app')
