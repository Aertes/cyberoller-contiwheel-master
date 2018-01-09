<template>
  <div>
    <div class="wrapper">
      <header class="main-header" style="background: #000;">
        <router-link to="/app/main">
          <a class="logo" style=" background: #ffa13f;">
          <span class="logo-mini">
            <span class="crm">Real</span>
          </span>
            <span class="logo-lg">
            <img src="../assets/img/logo.png" alt="" style="width: 100px;"/>
          </span>
          </a>
        </router-link>
        <nav class="navbar navbar-static-top" style="background: #000;">
          <a href="#" class="sidebar-toggle" data-toggle="offcanvas" role="button">
            <span class="sr-only"></span>
          </a>
          <div class="navbar-custom-menu">
            <ul class="nav navbar-nav">
              <li class="dropdown user user-menu" v-if="app.user">
                <a href="#" class="dropdown-toggle" data-toggle="dropdown">
                  <span class="hidden-xs">{{app.user.user.name}}</span>
                </a>
                <ul class="dropdown-menu">
                  <!-- User image -->
                  <li class="user-header" style="height: auto; background: #ffa13f;">
                    <p>
                      {{app.user.user.name}}
                      <small>角色:
                        <template v-for="role of app.user.roles">
                          {{role.name}}
                        </template>
                      </small>
                    </p>
                  </li>
                  <li class="user-footer">
                    <!--<div class="pull-left">-->
                    <!--<router-link to="/app/userOption">-->
                    <!--<a class="btn btn-default btn-flat">-->
                    <!--<i class="fa fa-wrench"></i>-->
                    <!--setting-->
                    <!--</a>-->
                    <!--</router-link>-->
                    <!--</div>-->
                    <div class="pull-right">
                      <a href="#" class="btn btn-default btn-flat" @click="exit()">
                        <i class="fa fa-sign-out"></i>
                        Exit
                      </a>
                    </div>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </nav>
      </header>
      <s-menu></s-menu>
      <div class="content-wrapper">
        <s-nav></s-nav>
        <section class="content">
          <router-view></router-view>
        </section>
      </div>
      <footer class="main-footer">
        <div class="pull-right hidden-xs">
          <b>版本</b> 1.0.9
        </div>
        <strong> &copy; 2017-2020 Continental China.</strong>
      </footer>
    </div>
  </div>
</template>
<script>
  import menu from './common/menu.vue'
  import nav from './common/nav.vue'
  import $ from '../plugins/jQuery/jquery-2.2.3.min'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    created () {
      this.getUser().then((data) => {
        if (data.code === 200) {
        } else {
          this.$router.push({
            path: '/login'
          })
        }
      }, res => {
        this.$router.push({
          path: '/login'
        })
      })
    },
    components: {
      sMenu: menu,
      sNav: nav
    },
    computed: mapGetters([
      'app'
    ]),
    mounted () {
      $(window).resize()
    },
    methods: {
      ...mapActions([
        'getUser'
      ]),
      exit () {
//        this.loginOut()
        this.$router.push({ path: '/login' })
      }
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss">
  @import '../assets/css/page/index';

  .skin-blue-light .main-header .navbar .sidebar-toggle:hover {
    background: #000;
  }
</style>
