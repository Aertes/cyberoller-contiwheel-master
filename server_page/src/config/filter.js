import Vue from 'vue'
import dateFormat from 'dateformat'
import { toDate } from '../helper/Date'

Vue.filter('date', (val, key) => dateFormat(val, key))
Vue.filter('timestamp', (val, key) => dateFormat(new Date().setTime(val), key))
Vue.filter('dateString', (val, key) => val ? dateFormat(toDate(val), key) : '')

