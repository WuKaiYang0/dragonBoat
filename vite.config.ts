import { defineConfig, loadEnv } from 'vite'
import postcssEnv from 'postcss-preset-env'
import { resolve } from 'node:path'
import { checker } from 'vite-plugin-checker'
import vue from '@vitejs/plugin-vue'
import { viteMockServe } from 'vite-plugin-mock'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { cwd } from 'node:process'
import ElementPlus from 'unplugin-element-plus/vite'
const envPrefix = 'DB_'
export default defineConfig(({ command, mode }) => {
  const resloveProxy = (mode: string) => {
    const o = {}
    const p = `/${mode}`
    o[p] = {
      target: loadEnv(mode, cwd(), envPrefix).DB_PROXY_URl,
      changeOrigin: true,
      rewrite: (path) => path.replace(p, '')
    }
    return o
  }
  return {
    envPrefix,
    server: {
      port: parseInt(loadEnv(mode, cwd(), envPrefix).DB_LOCAL_PORT),
      proxy: resloveProxy(mode)
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, './src'),
        '@component': resolve(__dirname, './src/components'),
        '@view': resolve(__dirname, './src/view'),
        '@router': resolve(__dirname, './src/router'),
        '@assets': resolve(__dirname, './src/assets'),
        '@styles': resolve(__dirname, './src/styles'),
        '@utils': resolve(__dirname, './src/utils'),
        '@http': resolve(__dirname, './src/http'),
        '@stores': resolve(__dirname, './src/stores')
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
      viteMockServe(),
      //按需引入ElementUI样式
      ElementPlus({})
    ]
  }
})
