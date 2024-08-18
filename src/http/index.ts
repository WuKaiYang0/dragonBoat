import * as common from './api/common'
import { getCurrentInstance } from 'vue'
export const requests = {
  common
}
export default getCurrentInstance().appContext.config.globalProperties.$requests
