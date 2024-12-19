export type BackDataFormat<T> = { code: number; data: T; message: string }
import * as icon from '@element-plus/icons-vue'
import {
  AgeTypeOnDamand,
  CompItemCategoryOnDamand,
  NaionTypeOnDamand,
  PeopleTypeOnDamamd,
  SexTypeOnDamand
} from '../enums'
import type { RouteMeta, RouteRecordNameGeneric } from 'vue-router'
export type Time = string
export type Route = {
  path: string
  name: string
  children?: Route[]
  meta: RouteMeta
}
export type Meta = {
  icon?: keyof typeof icon
  title: string
}
export type TagSetting = {
  active: boolean
  fullPath: string
  name: RouteRecordNameGeneric
  meta: RouteMeta
}
export type ActiveRoute = Omit<TagSetting, 'active'>

export type CompetitionBaseInfo = {
  /**id */
  id: number
  /**赛事名称 */
  name: string
  /**比赛开始时间 */
  startDate: Time
  /**比赛结束时间 */
  endDate: Time
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
}
export type CompetitionInfoData = {
  /**服务器存放文件的路径 */
  filePath: string
  /**创建时间 */
  createTime: Time
  /**更新时间 */
  updateTime: Time
  /**逻辑删除 */
  deleted: 0 | 1
} & CompetitionBaseInfo
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
export type AllDataInCompItem = CompetitionBaseInfo & {
  groups: CompetitionRules
} & { statusVal?: string }

export type AthletesType = '鼓手' | '舵手' | '替补' | '划手' | '锣手'

export type DataInAthletesType = {
  id: number
  typeName: AthletesType
}
export type CreateCompetitionData = Omit<CompetitionBaseInfo, 'id' | 'status'>

export type CompetitionItem = {
  /**组别 */
  category: string
  competitionId: number
  id: number
  name: string
  createTime: Time
  updateTime: Time
}
