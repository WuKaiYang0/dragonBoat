export type BackDataFormat<T> = { code: number; data: T; message: string }
import * as icon from '@element-plus/icons-vue'
import {
  AgeTypeOnDamand,
  CompItemCategoryOnDamand,
  CompItemStatus,
  NaionTypeOnDamand,
  PeopleTypeOnDamamd,
  SexTypeOnDamand
} from '../enums'
export type Time = string
export type Route = {
  path: string
  name: string
  children?: Route[]
  meta: Meta
}
export type Meta = {
  icon?: keyof typeof icon
  title: string
}
export type TagSetting = { active: boolean; fullPath: string; meta: Meta }
export type ActiveRoute = Omit<TagSetting, 'active'>

export type Competition = {
  /**id */
  id: number
  /**赛事名称 */
  name: string
  /**比赛开始时间 */
  start_date: Time
  /**比赛结束时间 */
  end_date: Time
  /**赛事介绍 */
  introduction: string
  /**地点 */
  location: string
  /**报名截止时间 */
  deadline: Time
  /**赛事图 */
  photo: string
  /**0:报名中，1:截止报名，2:已结束 */
  status: 0 | 1 | 2
  /**服务器存放文件的路径 */
  file_path: string
  /**创建时间 */
  create_time: Time
  /**更新时间 */
  update_time: Time
  /**逻辑删除 */
  deleted: 0 | 1
}
export type CompetitionRules = {
  id: number
  comId: number
  ageType: [AgeTypeOnDamand, Time]
  nationType: [NaionTypeOnDamand, number, number]
  peopleType: [PeopleTypeOnDamamd, [number, number], number, number, number]
  sexType: [SexTypeOnDamand, number, number]
  name: string
  createTime: Time
  updateTime: Time
  remark: string
  deleted: 0 | 1
  event: CompItemCategoryOnDamand
}
export type AllDataInCompItem = Competition & {
  groups: CompetitionRules
} & { statusVal?: string }
