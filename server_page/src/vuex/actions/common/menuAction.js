import { MENU } from '../../mutation-types'
import getData from '../../api/indexApi'
import xhrType from '../../api/xhrUrls'

export const getMenuList = ({commit}) => {
  commit(MENU.xhrs.GET_MENU_LIST.START)
  getData(xhrType.GET_MENU).then(res => {
    if (res.data.code === 200) {
      commit(MENU.xhrs.GET_MENU_LIST.SUCCESS, res.data.data)
      if (process.env.NODE_ENV !== 'production') {
        console.log('%c 加载菜单成功', 'color: #20a0ff; font-weight: bold')
      }
    } else {
      if (process.env.NODE_ENV !== 'production') {
        console.log('%c 加载菜单失败', 'color: #ff9494; font-weight: bold')
      }
    }
  }, () => {
    if (process.env.NODE_ENV !== 'production') {
      console.log('%c 菜单请求失败', 'color: #ff9494; font-weight: bold')
    }
  })
}

export const updateMenuState = ({commit}, url) => {
  commit(MENU.events.UPDATE_STATE, url)
  if (process.env.NODE_ENV !== 'production') {
    console.log(`%c 修改当前展示URL: ${url}`, 'color: #20a0ff; font-weight: bold')
  }
}
