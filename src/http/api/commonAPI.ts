import type { TeamRegister } from '@/typings/user/unit/index'
import axios from '../../utils/request'
import type {
  AllDataInCompItem,
  BackDataFormat,
  CompetitionInfoData,
  CompetitionItem,
  CompetitionItemBaseInfo,
  CreateCompetitionData,
  CreateCompetitionItemData,
  CreateCompetitionItemDataJSON,
  DataInAthletesType,
  UpdateCompetitionData
} from '@/typings/common'
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
export const logout = (token: string) =>
  axios.get<BackDataFormat<null>>('/login/logout', {
    headers: {
      Authorization: token
    }
  })
/**队伍注册 */
export const registerTeam = (form: TeamRegister) =>
  axios.post<BackDataFormat<null>>('/team/regist', form, {
    headers: {
      'content-type': 'application/json'
    }
  })
export const postQueryCompetition = (form: {
  page: number
  row: number
  name?: string
  location?: string
  introduction?: string
}) =>
  axios.post<BackDataFormat<AllDataInCompItem[]>>('/competition/queryCom', form, {
    headers: {
      'content-type': 'application/json'
    }
  })

export const getUnitTeamMemberType = (token: string) =>
  axios.get<BackDataFormat<DataInAthletesType[]>>('/unit/team/member/type', {
    headers: {
      Authorization: token
    }
  })

export const getCompetitionQueryCom = (
  token: string,
  data: { page: number; row: number; name?: string; location?: string; introduction?: string }
) =>
  axios.post<BackDataFormat<CompetitionInfoData[]>>('/competition/queryCom', data, {
    headers: {
      Authorization: token
    }
  })

export const postCompetitionCreateCom = (token: string, data: CreateCompetitionData) =>
  axios.post<BackDataFormat<null>>('/competition/createCom', data, {
    headers: {
      Authorization: token
    }
  })
export const addCompetitionGroupCreate = (token: string, data: CreateCompetitionItemDataJSON) =>
  axios.post<BackDataFormat<null>>('/competition/group/create', data, {
    headers: {
      Authorization: token
    }
  })
export const updateCompetition = (token: string, data: UpdateCompetitionData) =>
  axios.put<BackDataFormat<null>>('/competition/updateCom', data, {
    headers: {
      Authorization: token
    }
  })
export const deleteCompetitionDeleteCom = (token: string, id: number) =>
  axios.delete<BackDataFormat<null>>(`/competition/deleteCom?id=${id}`, {
    headers: {
      Authorization: token
    }
  })

export const getCompetitionGroupList = (
  token: string,
  data: {
    page: number
    pageSize: number
    name?: string
    competitionCategory?: string
    competitionLength?: string
    competitionId: number
  }
) =>
  axios.post<BackDataFormat<{ datas: CompetitionItem[]; totals: number }>>(
    '/competition/group/list',
    data,
    {
      headers: {
        Authorization: token
      }
    }
  )

/**测试 */
export const test = (body: Record<string, string | number>) =>
  axios.post('/post', body, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
