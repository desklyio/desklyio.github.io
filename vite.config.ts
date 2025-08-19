import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'
import {viteSingleFile} from "vite-plugin-singlefile"
import {VitePWA} from 'vite-plugin-pwa'
import path from "node:path";


export default defineConfig((config) => ({
    plugins: [
        vueDevTools(),
        vue(),
        tailwindcss(),
        VitePWA({
            injectRegister: 'auto',
            registerType: 'autoUpdate',
            manifest: {
                name: 'deskly',
                short_name: 'deskly',
                start_url: '/',
                display: 'standalone',
                background_color: '#ffffff',
                theme_color: '#3584ff',
                icons: [
                    {
                        src: '/favicon.png',
                        sizes: '256x256',
                        type: 'image/png'
                    },
                ]
            }
        }),
        ...(config.mode === 'single' ? [viteSingleFile()] : [])
    ],
    base: './',
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
            '@public': path.resolve(__dirname, './public'),
            '@icons': path.resolve(__dirname, './node_modules/bootstrap-icons/icons'),
        },
    },
}))
