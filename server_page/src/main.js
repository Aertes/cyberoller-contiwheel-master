import './assets/css/init.scss'
import './assets/css/anim.scss'
import 'animate.css/animate.css'

import './plugins/bootstrap/css/bootstrap.css'
import 'font-awesome/css/font-awesome.min.css'
import './plugins/adminlte/css/skins/skin-blue-light.css'
import './plugins/iCheck/all.css'
import './plugins/select2/select2.css'
import './plugins/datepicker/datepicker3.css'
import './plugins/daterangepicker/daterangepicker.css'
import './plugins/adminlte/css/AdminLTE.css'

import './plugins/jQuery/jquery-2.2.3.min'
import './plugins/bootstrap/js/bootstrap'
import './plugins/slimScroll/jquery.slimscroll'
import './plugins/adminlte/js/app'

import Vue from 'vue'
import Router from 'vue-router'
import App from './App.vue'

import './config/init'
import router from './config/router'

import store from './vuex/indexVuex'

Vue.use(Router)

/* eslint-disable no-new */
new Vue({
  router,
  store,
  el: '#app',
  render: h => h(App)
}).$mount('#body')

