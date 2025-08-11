import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'
import {viteSingleFile} from "vite-plugin-singlefile"
import path from "node:path";


export default defineConfig((config) => ({
    plugins: [
        vueDevTools(),
        vue(),
        tailwindcss(),
        ...(config.mode === 'single' ? [viteSingleFile()] : [])
    ],
    base: './',
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
}))
