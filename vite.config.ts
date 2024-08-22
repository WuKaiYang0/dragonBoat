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
import fs from 'fs'
const envPrefix = 'DB_'
//解析src下所有目录，默认别名@ -> src;另外，tsconfig.json文件需要手动添加paths。
const resolveAlias = (prefix: string) => {
  let o = {}
  const dirNames = fs
    .readdirSync('./src', { withFileTypes: true })
    .filter((item) => item.isDirectory())
    .map((item) => item.name)
    .forEach((name) => {
      o[`${prefix}${name}`] = resolve(__dirname, `./src/${name}`)
    })
  o[prefix] = resolve(__dirname, './src')
  return o
}
export default defineConfig(({ command, mode }) => {
  //在不同的环境（命令）下，通过不同的接口前缀，代理不同的接口地址
  const resolveProxy = (mode: string) => {
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
      proxy: resolveProxy(mode)
    },
    resolve: {
      alias: resolveAlias('@')
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
        resolvers: [
          // 自动导入 Element Plus 相关函数，如：ElMessage, ElMessageBox... (带样式)
          ElementPlusResolver()
        ]
      }),
      Components({
        resolvers: [
          //自动注册 Element Plus 组件
          ElementPlusResolver()
        ]
      }),
      viteMockServe(),
      //按需引入ElementUI样式
      ElementPlus({})
    ]
  }
})
