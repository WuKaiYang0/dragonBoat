import { Time } from '../common'

export type UnitBaseInfo = {
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
export type TeamRegister = Omit<UnitBaseInfo, 'email'> & {
  /**队伍密码 */
  password: string
  /**邮箱验证码 */
  verify?: string
} & Partial<Pick<UnitBaseInfo, 'email'>>

export type UnitData = {
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
} & UnitBaseInfo

export type TeamMember = {
  id: number
  teamId: number
  name: string
  gender: number
  nation: number
  age: number
  birthday: Time
  phone: string
  idCard: string
  type: number
  coatSize: string
  trousersSize: string
  photo: string
}

export type UnitTeamListData = {
  totals: number
  datas: {
    /**队伍ID */
    id: number
    /**队伍名称 */
    name: string
    /**单位ID */
    unitId: number
    /**创建时间 */
    createTime: Time
    /**更新时间 */
    updateTime: Time
    /**是否删除 */
    deleted: 0 | 1
  }[]
}
