import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
    publicDir: './public',
    root: './public',
    base: './',

    build: {
        outDir: path.resolve(__dirname, 'dist'),
        minify: 'esbuild',
        target: 'esnext',
        cssCodeSplit: true,

        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (id.includes('node_modules')) {

                        if (id.includes('vue'))
                            return 'vue'

                        if (id.includes('vue-router'))
                            return 'router'

                        return 'vendor'
                    }
                    if (id.includes('/components/'))
                        return 'components'
                    if (id.includes('/layouts/'))
                        return 'layouts'
                    if (id.includes('/styles/'))
                        return 'styles'
                    
                },
            },
        },
    },

    plugins: [
        vue(),
        vueDevTools(),
    ],
})