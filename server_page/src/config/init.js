import Vue from 'vue'
import './directive'
import './filter'
import sEasyLoading from '../components/loading/easyLoading.vue'
import aWindow from '../components/transition/window.vue'
import aFadeInDown from '../components/transition/fadeInDown.vue'

import checkbox from '../components/forms/checkbox.vue'
import select from '../components/forms/select.vue'
import date from '../components/forms/date.vue'
import date2 from '../components/forms/date2.vue'
import table from '../components/table/table.vue'
import tree from '../components/tree/tree.vue'

Vue.component('a-window', aWindow)
Vue.component('a-fade-in-down', aFadeInDown)

Vue.component('s-easy-loading', sEasyLoading)
Vue.component('s-checkbox', checkbox)
Vue.component('s-date', date)
Vue.component('s-date2', date2)
Vue.component('s-select', select)
Vue.component('s-table', table)
Vue.component('s-tree', tree)

