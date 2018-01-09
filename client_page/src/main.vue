<template>
  <div id="body">
    <router-view></router-view>
  </div>
</template>

<style lang="scss" rel="stylesheet/scss">
  #body {
    overflow-y: scroll;
    position: absolute;
    width: 100%;
    height: 100%;
    background: url("assets/img/bg.jpg") center repeat-x;
    background-size: auto 100%;
  }
</style>
