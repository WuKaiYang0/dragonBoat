import { Time } from '@/typings/common'
import dayjs from 'dayjs'
export const setTime: () => Time = () => dayjs().format('YYYY-MM-DD hh:mm:ss')
