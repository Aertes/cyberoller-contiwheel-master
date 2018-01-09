import { APP } from '../mutation-types'

const state = {
  user: null
}

const mutations = {
  [APP.xhrs.GET_USER.SUCCESS] (state, user) {
    state.user = user
  }
}

export default {
  state,
  mutations
}
