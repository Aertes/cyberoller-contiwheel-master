import { NAV } from '../../mutation-types'

// const navList = {
//   'main': {
//     title: '首页',
//     explain: '欢迎使用 Seltek CRM'
//   }
// }

export const setNav = ({ commit }, data) => {
  commit(NAV.xhrs.SET.SUCCESS, data)
  if (process.env.NODE_ENV !== 'production') {
    console.log('%c 导航条初始化', 'color: #20a0ff; font-weight: bold')
  }
}
