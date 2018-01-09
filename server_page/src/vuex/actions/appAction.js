import { APP } from '../mutation-types'
import xhrType from '../api/xhrUrls'
import getDate from '../api/indexApi'

export const click = ({ commit }) => {
  commit(APP.events.COMMON_CLICK)
}

export const login = ({ commit }, query) => {
  return new Promise((resolve, reject) => {
    getDate(xhrType.LOGIN, query).then(res => {
      if (res.data.code === 200) {
        commit(APP.xhrs.GET_USER.SUCCESS, res.data.data)
        if (process.env.NODE_ENV !== 'production') {
          console.log(`%c 登录成功`, 'color: #20a0ff; font-weight: bold')
        }
        resolve(res.data)
      } else {
        if (process.env.NODE_ENV !== 'production') {
          console.log(`%c 登录失败`, 'color: #20a0ff; font-weight: bold')
        }
        reject(res.data)
      }
    }, () => {
      if (process.env.NODE_ENV !== 'production') {
        console.log(`%c 登录失败`, 'color: #20a0ff; font-weight: bold')
      }
      reject()
    })
  })
}

export const getUser = ({ commit }) => {
  return new Promise((resolve, reject) => {
    getDate(xhrType.GET_USER).then(res => {
      if (res.data.code === 200) {
        commit(APP.xhrs.GET_USER.SUCCESS, res.data.data)
        if (process.env.NODE_ENV !== 'production') {
          console.log(`%c 登录成功`, 'color: #20a0ff; font-weight: bold')
        }
        let roles = res.data.data.roles || []
        for (let role of roles) {
          getDate(xhrType.SEARCH_ROLE_FUNC, {
            roleId: role.id
          }).then(resRole => {
            if (resRole.data.code === 200) {
              commit('ROLE', res.data.data.menus)
            }
          })
        }
        resolve(res.data)
      } else {
        if (process.env.NODE_ENV !== 'production') {
          console.log(`%c 登录失败`, 'color: #20a0ff; font-weight: bold')
        }
        reject(res.data)
      }
    }, () => {
      if (process.env.NODE_ENV !== 'production') {
        console.log(`%c 登录失败`, 'color: #20a0ff; font-weight: bold')
      }
      reject()
    })
  })
}

export const loginOut = () => {
  getDate(xhrType.LOGIN_OUT)
}
