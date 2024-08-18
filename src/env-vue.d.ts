/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly DB_PROXY_URl: string
  readonly DB_LOCAL_URL: string
  readonly DB_LOCAL_PORT: number
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
import { requests } from '@http/index'
declare module 'vue' {
  interface ComponentCustomProperties {
    $requests: typeof requests
  }
}
export {}
