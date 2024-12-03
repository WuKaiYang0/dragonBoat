import { WhatColor } from '@/typings/enums'
import { Route, Time } from '@/typings/common'
import dayjs from 'dayjs'

export const getColor = (color: string | WhatColor) => color
export const setTime: () => Time = () => dayjs().format('YYYY-MM-DD hh:mm:ss')
export const outputAgeAndBirthdayByIdCard = (idCard: string, format: string) => {
  if (idCard.trim().length === 18) {
    const d = new Date()
    const year_date = idCard.slice(6, 14)
    const year = year_date.slice(0, 4)
    const date = year_date.slice(4, year_date.length)
    const month = date.slice(0, 2)
    const day = date.slice(2, date.length)
    const currentYear = d.getFullYear()
    const currentMonth = d.getMonth() + 1
    const currentDay = d.getDay()
    const biggerOneYear =
      new Date(`${currentYear}/${currentMonth}/${currentDay}`).getTime() <=
      new Date(`${currentYear}/${month}/${day}`).getTime()
        ? 1
        : 0
    const age = currentYear - Number(year) + biggerOneYear
    return {
      age,
      birthday: `${year}${format}${month}${format}${day}`
    }
  } else {
    throw new Error('身份证位数不对')
  }
}
export const locateRoute = (routes: Route[], pathName: string[]) => {
  const routeArr = [] as Route[]
  let index = 0
  return (function _locateRoute(_routes: Route[]) {
    for (let i = 0; i < _routes.length; i++) {
      const currentRoute = _routes[i]
      const currentName = pathName[index]
      if (currentRoute.name === currentName) {
        routeArr.push(Object.assign({}, currentRoute, { children: [] }))
        index += 1
        if (pathName[index] && currentRoute.children && currentRoute.children.length > 0) {
          return _locateRoute(currentRoute.children)
        } else {
          const routeTitleArr = routeArr.map((item) => item.meta.title)
          const routePathArr = routeArr.map((item) => item.path)
          return {
            _routeArr: routeArr,
            _routeTitleArr: routeTitleArr,
            _currentRoute: routeArr[routeArr.length - 1],
            _routePathArr: routePathArr
          }
        }
      }
    }
  })(routes)
}
