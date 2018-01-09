import Vue from 'vue'
import Vuex from 'vuex'
import actions from './actions/indexAction'
import getters from './getters/indexGetter'
import modules from './modules/indexModule'
import createLogger from 'vuex/dist/logger'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  actions,
  getters,
  modules,
  strict: debug,
  plugins: debug ? [createLogger({})] : []
})
