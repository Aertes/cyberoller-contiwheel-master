import { NAV } from '../../mutation-types'

const state = {
  top: {
    title: '',
    explain: '',
    f_menu: null,
    s_menu: null,
    paths: []
  }
}

const mutations = {
  [NAV.xhrs.SET.SUCCESS] (state, {f, s}) {
    state.top.title = f.name
    state.top.f_menu = f
    state.top.s_menu = s
  }
}

export default {
  state,
  mutations
}
