<template>
  <section class="content-header">
    <h1>
      {{menu.showMenu.s_menu && menu.showMenu.s_menu.name}}
    </h1>
    <ol class="breadcrumb">
      <li>
        <router-link to="/app/main"><i class="fa fa-dashboard"></i> home</router-link>
      </li>
      <li class="active" v-if="menu.showMenu.f_menu">
        {{menu.showMenu.f_menu && menu.showMenu.f_menu.name}}
      </li>
      <li class="active" v-if="menu.showMenu.s_menu">
        {{menu.showMenu.s_menu && menu.showMenu.s_menu.name}}
      </li>
    </ol>
  </section>
</template>
<script>
  import { mapGetters } from 'vuex'

  export default {
    computed: mapGetters([
      'menu'
    ])
  }
</script>
