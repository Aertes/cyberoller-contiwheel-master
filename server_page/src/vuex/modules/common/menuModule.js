import { MENU, APP } from '../../mutation-types'
import router from '../../../config/router'
// import vue from 'vue'
const state = {
  loading: true,
  menuList: [],
  showState: {
    parentId: null,
    checkId: null
  },
  showMenu: {
    f_menu: null,
    s_menu: null
  },
  nowShowUrl: '',
  grant: {}
}
// 修改当前需要active的菜单id
const updateShowState = state => {
  for (let fMenu of state.menuList) {
    if (fMenu.child) {
      for (let sMenu of fMenu.child) {
        if (state.nowShowUrl === sMenu.url) {
          state.showState = {
            checkId: sMenu.id,
            parentId: fMenu.id
          }
          state.showMenu = {
            f_menu: fMenu,
            s_menu: sMenu
          }
          return
        }
      }
    }
  }
  state.showState.checkId = null
  router.push({
    path: state.menuList[0].child[0].url
  })
}

const mutations = {
  // 获取菜单成功
  // [MENU.xhrs.GET_MENU_LIST.SUCCESS] (state, menu) {
  [APP.xhrs.GET_USER.SUCCESS] (state, { menus }) {
    state.grant = {}
    let menuAll = {}
    let menuList = []
    for (let menu of menus) {
      menuAll[menu.id] = menu
    }
    for (let menu of menus) {
      if (menu.parent_id !== '-1' && menu.id !== 'f68b7ae4048b11e78ed86c92bf3149c7') {
        menuAll[menu.parent_id].child = menuAll[menu.parent_id].child || []
        menuAll[menu.parent_id].child.push(menu)
      }
    }
    for (let menu of Object.keys(menuAll)) {
      if (menuAll[menu].parent_id === '-1' && menuAll[menu].id !== 'f68b7ae4048b11e78ed86c92bf3149c7') {
        menuList.push(menuAll[menu])
      }
    }
    state.menuList = menuList
    updateShowState(state)
    state.loading = false
  },
  // 开始获取菜单
  // [MENU.xhrs.GET_MENU_LIST.START] (state) {
  [APP.xhrs.GET_USER.START] (state) {
    state.loading = true
  },
  // 修改当前展示的菜单,没有加载成功等加载成功触发,加载成功手触发
  [MENU.events.UPDATE_STATE] (state, url) {
    state.nowShowUrl = url
    if (!state.loading) {
      updateShowState(state)
    }
  },
  'ROLE' (state, menus) {
    let grant = state.grant
    for (let menu of menus) {
      grant[menu.id] = true
    }
    state.grant = {}
    state.grant = grant
  }
}

export default {
  state,
  mutations
}
