import { TeamRegister } from '@/typings/team/index'
import axios from '../../utils/request'
import { BackDataFormat } from '@/typings/common'
/**获取邮箱验证码 */
export const getLoginVerifyByEmail = (email: string) =>
  axios.get<BackDataFormat<null>>(`/login/getVerify?email=${email}`)
/**通过邮箱登录 */
export const postLoginByEmail = (form: { email: string; verify: string }) =>
  axios.post<BackDataFormat<{ token: string }>>('/login/byEmail', form, {
    headers: {
      'content-type': 'application/json'
    }
  })
/**通过账号登录 */
export const postLoginByAccount = (form: { account: string; password: string }) =>
  axios.post<BackDataFormat<{ token: string }>>('/login/byAccount', form, {
    headers: {
      'content-type': 'application/json'
    }
  })
/**队伍注册 */
export const registerTeam = (form: TeamRegister) =>
  axios.post<BackDataFormat<null>>('/team/regist', form, {
    headers: {
      'content-type': 'application/json'
    }
  })
/**测试 */
export const test = (body: Record<string, string | number>) =>
  axios.post('/post', body, {
    headers: {
      'Content-Type': 'application/json'
    }
  })

const res = async () => await test({ name: 'wky', age: 18 })
