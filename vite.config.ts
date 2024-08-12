import { defineConfig } from 'vite'
import postcssEnv from 'postcss-preset-env'
import { resolve } from 'node:path'
import { checker } from 'vite-plugin-checker'
import vue from '@vitejs/plugin-vue'
import { viteMockServe } from 'vite-plugin-mock'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@component': resolve(__dirname, './src/components'),
      '@view': resolve(__dirname, './src/view'),
      '@router': resolve(__dirname, './src/router')
    }
  },
  css: {
    preprocessorOptions: {},
    postcss: {
      plugins: [postcssEnv]
    }
  },
  plugins: [
    checker({
      vueTsc: true
    }),
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()]
    }),
    Components({
      resolvers: [ElementPlusResolver()]
    }),
    viteMockServe()
  ]
})
