import GroupFactory from './mutation/GroupFactory'

export const APP = new GroupFactory(
  'APP', ['COMMON_CLICK'], ['GET_USER']
)
// 导航条
export const NAV = new GroupFactory(
  'NAV', [], ['SET']
)
// 菜单
export const MENU = new GroupFactory(
  'MENU', ['UPDATE_STATE'], ['GET_MENU_LIST']
)
// 首页
export const MAIN = new GroupFactory(
  'MAIN', ['OPEN_UPDATE', 'CLOSE_UPDATE', 'SUBMIT_UPDATE'], ['GET_CHAT', 'UPDATE_CHAT']
)
