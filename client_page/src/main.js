import './config/language'
import Vue from 'vue'
import Router from 'vue-router'
import App from './main.vue'

import router from './config/router'

import './assets/style/init.scss'
import 'animate.css/animate.css'

import './plugins/bootstrap/css/bootstrap.css'
import 'font-awesome/css/font-awesome.min.css'
import './plugins/select2/select2.css'
import './plugins/adminlte/css/AdminLTE.css'

import './plugins/jQuery/jquery-2.2.3.min'
import './plugins/bootstrap/js/bootstrap'
import './plugins/slimScroll/jquery.slimscroll'
import './plugins/adminlte/js/app'
import './plugins/select2/select2'

import dateFormat from 'dateformat'
Vue.filter('date', (val, key) => dateFormat(val, key))

Vue.use(Router)

/* eslint-disable no-new */
new Vue({
  router,
  el: '#app',
  render: h => h(App)
}).$mount('#body')

import select from './components/forms/select.vue'
import table from './components/table/table.vue'
import {
  Slider
} from 'element-ui'
import 'element-ui/lib/theme-default/index.css'

Vue.use(Slider)
Vue.component('s-select', select)
Vue.component('s-table', table)
