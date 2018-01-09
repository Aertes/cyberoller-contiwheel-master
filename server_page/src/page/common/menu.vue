<template>
  <aside class="main-sidebar" style="background-color: #000;">
    <s-easy-loading v-if="menu.loading"></s-easy-loading>
    <a-window>
      <section class="sidebar" v-if="!menu.loading">
        <ul class="sidebar-menu">
          <li v-for="f_menu of menu.menuList" class="treeview"
              v-if="menu.grant[f_menu.id]" :class="{active: menu.showState.parentId === f_menu.id}">
            <a href="#">
              <!--<i class="fa" :class="f_menu.icon"></i>-->
              <span>{{f_menu.name}}</span>
              <span class="pull-right-container">
              <i class="fa fa-angle-left pull-right"></i>
            </span>
            </a>
            <ul class="treeview-menu" v-if="f_menu.child && f_menu.child.length">
              <li v-for="s_menu of f_menu.child" :class="{activeMenu: menu.showState.checkId === s_menu.id}">
                <!--<router-link :to="s_menu.url || ''">-->
                <a @click="go(f_menu, s_menu)" style="cursor: pointer;"
                   v-if="menu.grant[s_menu.id]">
                  <!--<i class="fa" :class="s_menu.icon"></i>-->
                  {{s_menu.name}}
                </a>
                <!--</router-link>-->
              </li>
            </ul>
          </li>
        </ul>
      </section>
    </a-window>
  </aside>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'

  export default {
    created () {
//      this.getMenuList()
      this.updateMenuState(this.$route.fullPath)
    },
    computed: mapGetters([
      'menu'
    ]),
    methods: {
      ...mapActions([
        'getMenuList', 'updateMenuState', 'setNav'
      ]),
      go (f, s) {
        this.setNav({
          f, s
        })
        this.$router.push({
          path: s.url
        })
      }
    },
    watch: {
      $route (route) {
        this.updateMenuState(route.fullPath)
      }
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss" type="text/scss">
  @import '../../assets/css/page/common/menu';

  .skin-blue-light .sidebar a {
    color: #fff;
  }

  .skin-blue-light .sidebar a:hover {
    color: #000;
  }
</style>
