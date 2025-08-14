import {createApp} from 'vue'

import '@/style.css'
import App from '@/App.vue'
import locale from "@/locale.ts";




createApp(App)
    .use(locale)
    .mount('#app')
