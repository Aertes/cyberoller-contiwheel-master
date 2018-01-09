import Router from 'vue-router'

const routerMap = new Router({
  routes: [
    {
      path: '/login',
      component: resolve => require(['../page/login.vue'], resolve)
    },
    {
      path: '/app',
      component: resolve => require(['../page/index.vue'], resolve),
      children: [
        // 首页报表
        {
          path: 'main',
          component: resolve => require(['../page/common/main.vue'], resolve),
          name: 'main'
        },
        // 个人设置
        {
          path: 'userOption',
          component: resolve => require(['../page/common/userOption.vue'], resolve)
        },
        {
          path: 'user',
          component: resolve => require(['../page/setting/user/userList.vue'], resolve)
        },
        {
          path: 'role',
          component: resolve => require(['../page/setting/role/roleList.vue'], resolve)
        },
        {
          path: 'org',
          component: resolve => require(['../page/setting/org/orgList.vue'], resolve)
        },
        {
          path: 'size',
          component: resolve => require(['../page/setting/size/sizeList.vue'], resolve)
        },
        {
          path: 'material',
          component: resolve => require(['../page/setting/material/materialList.vue'], resolve)
        },
        {
          path: 'product',
          component: resolve => require(['../page/setting/product/productList.vue'], resolve)
        },
        {
          path: 'image/:id',
          component: resolve => require(['../page/gallery/image/imageList.vue'], resolve)
        },
        {
          path: 'structure/:id',
          component: resolve => require(['../page/setting/structure/structure.vue'], resolve)
        },
        {
          path: 'information',
          component: resolve => require(['../page/product/information/information.vue'], resolve)
        },
        {
          path: 'regulations',
          component: resolve => require(['../page/product/regulations/regulations.vue'], resolve)
        },
        {
          path: 'ads',
          component: resolve => require(['../page/gallery/ads/adsList.vue'], resolve)
        },
        {
          path: 'layout',
          component: resolve => require(['../page/layout/layoutList.vue'], resolve)
        },
        {
          path: 'work',
          component: resolve => require(['../page/common/work.vue'], resolve)
        },
        {
          path: 'msg',
          component: resolve => require(['../page/common/msg.vue'], resolve)
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
