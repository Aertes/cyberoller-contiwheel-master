import Router from 'vue-router'

const routerMap = new Router({
  routes: [
    {
      path: '/login',
      component: resolve => require(['../components/login.vue'], resolve)
    },
    {
      path: '/resetSend',
      component: resolve => require(['../components/resetSend.vue'], resolve)
    },
    {
      path: '/reset/:name',
      component: resolve => require(['../components/reset.vue'], resolve)
    },
    {
      path: '/main',
      component: resolve => require(['../App.vue'], resolve),
      children: [
        {
          path: 'app',
          component: resolve => require(['../components/main.vue'], resolve)
        },
        {
          path: 'info',
          component: resolve => require(['../components/info.vue'], resolve)
        },
        {
          path: 'lib',
          component: resolve => require(['../components/lib.vue'], resolve)
        },
        {
          path: 'password',
          component: resolve => require(['../components/password.vue'], resolve)
        }
      ]
    }
  ]
})
routerMap.beforeEach((to, from, next) => {
  /**
   * 路由配置
   */
  switch (to.fullPath) {
    case '/':
      next('/login')
      break
    default:
      next()
      break
  }
})

export default routerMap
