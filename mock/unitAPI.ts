import type { MockMethod } from 'vite-plugin-mock'
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
          totals: 1,
          datas: [
            {
              /**队伍ID */
              id: 1,
              /**队伍名称 */
              name: '大众组',
              /**单位ID */
              unitId: 1,
              /**创建时间 */
              createTime: '2020-1-1',
              /**更新时间 */
              updateTime: '2020-1-1',
              /**是否删除 */
              deleted: 0
            }
          ]
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
          totals: 1,
          datas: [
            {
              id: 1,
              teamId: 1,
              name: 'fake name',
              gender: 1,
              nation: 1,
              age: 12,
              birthday: 2021 - 1 - 1,
              phone: '12345678',
              idCard: '44142320000416173X',
              type: 1,
              coatSize: 'XL',
              trousersSize: 'XL',
              photo: ''
            }
          ]
        }
      }
    }
  }
] as MockMethod[]
