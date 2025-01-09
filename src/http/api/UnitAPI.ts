import axios from '@utils/request'
import type { TeamMember, UnitData, UnitTeamListData } from '@/typings/user/unit'
import type { BackDataFormat } from '@typings/common'
export const getUserInfo = (token: string) =>
  axios.get<BackDataFormat<UnitData>>('/team/queryTeamById', {
    headers: {
      Authorization: token
    }
  })

export const addTeamListByUnitId = (token: string, data: { name: string; unitId: number }) =>
  axios.post<BackDataFormat<UnitTeamListData>>('/unit/team/regist', data, {
    headers: {
      Authorization: token
    }
  })

export const getUnitTeamList = (
  token: string,
  data: { page: number; pageSize: number; name?: string }
) =>
  axios.post<BackDataFormat<UnitTeamListData>>('/unit/team/list', data, {
    headers: {
      Authorization: token
    }
  })
/**
 *
 * @param token token
 * @param data.id 队伍id
 * @param data.name 队伍名称
 * @returns
 */
export const updateUnitTeamList = (token: string, data: { id: number; name: string }) =>
  axios.put<BackDataFormat<null>>('/unit/team', data, {
    headers: {
      Authorization: token
    }
  })

/**
 *
 * @param token token
 * @param id 队伍id
 */
export const deleteUnitTeamList = (token: string, id: number) =>
  axios.delete<BackDataFormat<null>>(`/unit/team?id=${id}`, {
    headers: {
      Authorization: token
    }
  })

export const updateUnitTeamName = (token: string, data: { id: number; name: string }) =>
  axios.put<BackDataFormat<null>>('/unit/team', data, {
    headers: {
      Authorization: token
    }
  })

export const deleteUnitTeam = (token: string, id: number) =>
  axios.delete(`/unit/team?id=${id}`, {
    headers: {
      Authorization: token
    }
  })

export const getUnitTeamMemberQueryMember = (
  token: string,
  data: { page: number; pageSize: number; name?: string; teamId: number }
) =>
  axios.post<BackDataFormat<{ totals: number; datas: TeamMember[] }>>(
    '/unit/team/member/queryMember',
    data,
    {
      headers: {
        Authorization: token
      }
    }
  )

export const addUnitTeamMember = (token: string, data: Omit<TeamMember, 'id'>) =>
  axios.post<BackDataFormat<null>>('/unit/team/member/addMember', data, {
    headers: {
      Authorization: token
    }
  })

export const updateUnitTeamMember = (token: string, data: TeamMember) =>
  axios.put<BackDataFormat<null>>('/unit/team/member/updateMember', data, {
    headers: {
      Authorization: token
    }
  })

export const deleteUnitTeamMember = (token: string, id: number) =>
  axios.delete<BackDataFormat<null>>(`/unit/team/member/deleteMember?id=${id}`, {
    headers: {
      Authorization: token
    }
  })
