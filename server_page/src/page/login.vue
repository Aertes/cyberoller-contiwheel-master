<template>
  <div class="hold-transition login-page">
    <div class="login-box">
      <div class="login-logo" style="background: #ffa13f;
position: fixed;
padding: 30px 50px;
left: 10%;
top: 0;">
        <img src="../assets/img/logo.png" alt="">
      </div>
      <!-- /.login-logo -->
      <div class="login-box-body" @keyup.enter="submit()" style="background: none;margin-top: 200px;">
        <div class="form-group has-feedback">
          <input type="email" class="form-control"
                 placeholder="Username" style="letter-spacing:2px;"
                 v-model="loginInfo.name">
          <span class="fa fa-user form-control-feedback"></span>
        </div>
        <div class="form-group has-feedback">
          <input type="password" class="form-control"
                 placeholder="Password" style="letter-spacing:2px;"
                 v-model="loginInfo.password">
          <span class="fa fa-lock form-control-feedback"></span>
        </div>
        <!--<div class="form-group has-feedback">-->
        <!--<div class="row">-->
        <!--<div class="col-xs-6">-->
        <!--<input type="text" class="form-control" placeholder="验证码">-->
        <!--</div>-->
        <!--<div class="col-xs-6 login-img" @click="getRandom()">-->
        <!--<img :src="showImgUrl" alt=""/>-->
        <!--</div>-->
        <!--</div>-->
        <!--<div class="clearfix"><span class="help-block pull-right"></span></div>-->
        <!--</div>-->
        <div class="row">
          <div class="col-xs-12">
            <a v-if="!isLogin" type="submit" class="btn btn-primary btn-block btn-flat"
               style="background: #ffa13f; border: none; color: #000;" @click="submit()">Login</a>
            <a v-if="isLogin" type="submit" class="btn btn-default btn-block btn-flat disabled"><i
              class="fa fa-spin fa-refresh" style="margin-right: 20px"></i> Login</a>
          </div>
        </div>
        <div class="row" style="padding-top: 10px; color: red;">
          <div class="col-xs-12">
            <p>{{errMessage}}</p>
          </div>
        </div>
      </div>
    </div>
    <div
      style="position: fixed; width: 100%; border-top: 2px solid #fff; text-align: center; bottom: 0; left: 0;font-size: 16px; padding: 30px 0; color: #fff">
      CopyRight 2017
    </div>
  </div>
</template>
<script type="text/babel">
  import { mapActions } from 'vuex'
  export default {
    data () {
      return {
        imgUrl: '/validatecode.do?',
        random: null,
        isLogin: false,
        errMessage: '',
        loginInfo: {
          name: '',
          password: ''
        }
      }
    },
    computed: {
      showImgUrl: function () {
        return this.imgUrl + this.random
      }
    },
    methods: {
      ...mapActions([
        'login'
      ]),
      submit () {
        this.isLogin = true
        this.login({
          ...this.loginInfo
        }).then(() => {
          this.$router.push({
            path: '/app/image/1'
          })
        }, data => {
          console.log(data.message)
          this.errMessage = data && data.message || '网路链接错误,请刷新后尝试'
          this.isLogin = false
        })
      },
      getRandom () {
        this.random = Math.random()
      }
    }
  }
</script>
<style>
  .login-page {
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    background: #000000;
  }

  .login-img img {
    width: 100%;
    border: 1px solid #d2d6de;
    height: 34px;
  }
</style>
