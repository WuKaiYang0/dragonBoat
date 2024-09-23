import axios from '@utils/request'
import { TeamData } from '@typings/team'
import { BackDataFormat } from '@typings/common'
export const getTeamInfo = (token: string) =>
  axios.get<BackDataFormat<TeamData>>('/team/queryTeamById', {
    headers: {
      Authorization: token
    }
  })
