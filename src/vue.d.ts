import $requests from '@http/index'

declare module 'vue' {
  interface ComponentCustomProperties {
    $requests: typeof $requests
  }
}
