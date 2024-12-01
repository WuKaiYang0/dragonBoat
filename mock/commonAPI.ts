import type { MockMethod } from 'vite-plugin-mock'
export default [
  {
    url: `/login/byAccount`,
    method: 'post',
    response() {
      return {
        code: 200,
        message: '登录成功',
        data: {
          token: 'success'
        }
      }
    }
  },
  {
    url: `/unit/team/member/type`,
    method: 'get',
    response() {
      return {
        code: 200,
        data: [
          { name: '鼓手', id: 0 },
          { name: '舵手', id: 1 },
          { name: '划手', id: 2 },
          { name: '锣手', id: 3 },
          { name: '替补', id: 4 }
        ]
      }
    }
  }
] as MockMethod[]
