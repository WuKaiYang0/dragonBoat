import { Time } from '../common'

export type TeamBaseInfo = {
  /**队伍名称 */
  name: string
  /**队伍账号 */
  account: string
  /**队伍邮箱 */
  email: string
  /**队伍单位 */
  unit: string
  /**队伍介绍 */
  intro: string
  /**手机号码 */
  phone: string
}
export type TeamRegister = Omit<TeamBaseInfo, 'email'> & {
  /**队伍密码 */
  password: string
  /**邮箱验证码 */
  verify?: string
} & Partial<Pick<TeamBaseInfo, 'email'>>

export type TeamData = {
  createTime: Time
  updateTime: Time
  deleted: number
  page: null
  row: null
  id: number
  photoFile?: string
  message?: string
  status?: 0 | 1
  verify?: string
} & TeamBaseInfo
