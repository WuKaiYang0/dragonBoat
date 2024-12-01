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
  }
] as MockMethod[]
