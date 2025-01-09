import type { MockMethod } from 'vite-plugin-mock'
import teamLists from './json/teamList.json'
import memberLists from './json/memberList.json'
import { BackDataFormat } from '../src/typings/common/index'
import { TeamMember, UnitTeamListData } from '../src/typings/user/unit'
export default [
  {
    url: `/team/queryTeamById`,
    method: 'get',
    response() {
      return {
        code: 200,
        message: '获取成功',
        data: {
          teamId: 1,
          name: '华师测试测试队',
          gender: 0,
          nation: 0,
          age: 18,
          birthday: 2000 - 1 - 1,
          phone: 18027111021,
          idCard: 4414,
          type: 0,
          coatSize: 'L',
          trousersSize: 'L',
          photo: ''
        }
      }
    }
  },
  {
    url: `/unit/team/list`,
    method: 'post',
    response() {
      return {
        code: 200,
        message: '获取成功',
        data: {
          totals: teamLists.length,
          datas: teamLists
        }
      }
    }
  },
  {
    url: '/unit/team/member/queryMember',
    method: 'post',
    response() {
      return {
        code: 200,
        message: '获取成功',
        data: {
          totals: memberLists.length,
          datas: memberLists
        }
      } as BackDataFormat<{ totals: number; datas: TeamMember[] }>
    }
  },
  {
    url: `/unit/team`,
    method: 'delete',
    response() {
      teamLists.pop()
      console.log(teamLists.length)

      return {
        code: 200,
        message: '成功',
        data: null
      } as BackDataFormat<null>
    }
  },
  {
    url: `/unit/team/regist`,
    method: 'post',
    response() {
      teamLists.push({
        /**队伍ID */ id: 1,
        /**队伍名称 */
        name: `大众组${teamLists.length}`,
        /**单位ID */
        unitId: 1,
        /**创建时间 */
        createTime: '2020-1-1',
        /**更新时间 */
        updateTime: '2020-1-1',
        /**是否删除 */
        deleted: 0
      })
      return {
        code: 200,
        message: '成功',
        data: null
      } as BackDataFormat<null>
    }
  },
  {
    url: `/unit/team/member/deleteMember`,
    method: 'delete',
    response() {
      memberLists.pop()
      return {
        code: 200,
        message: '成功',
        data: null
      } as BackDataFormat<null>
    }
  }
] as MockMethod[]
