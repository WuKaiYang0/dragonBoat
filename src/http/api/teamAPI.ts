import axios from '@utils/request'
export const getAllTeamInfo = (token: string) =>
  axios.get('/team/queryTeam', {
    headers: {
      Authorization: token
    }
  })
