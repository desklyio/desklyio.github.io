import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'
import {viteSingleFile} from "vite-plugin-singlefile"


export default defineConfig((config) => ({
    plugins: [
        vueDevTools(),
        vue(),
        tailwindcss(),
        ...(config.mode === 'single' ? [viteSingleFile()] : [])
    ],
    base: './'
}))
