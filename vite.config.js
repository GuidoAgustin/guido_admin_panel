import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  // 👇 CONFIGURACIÓN PARA SILENCIAR LAS ADVERTENCIAS DE SASS
  css: {
    preprocessorOptions: {
      scss: {
        // Esto le dice a Sass que ignore las advertencias de funciones viejas
        // usadas por Bootstrap 4
        silenceDeprecations: ['legacy-js-api', 'import', 'global-builtin', 'color-functions', 'abs-percent'],
        quietDeps: true
      }
    }
  }
})