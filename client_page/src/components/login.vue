<template>
  <div>
    <div class="login_div" @keyup.enter="submit()">
      <img src="../assets/img/login.png" alt="">
      <div class="content_box">
        <div class="title">
          Welcome!
        </div>
        <div class="text">
          Please log in with your personal username and password.
        </div>
        <div>
          <div style="margin-top: 10px">
            <span class="form_title">UserName:</span>
            <span><input type="text" v-model="loginInfo.name"></span>
          </div>
          <div style="margin-top: 10px">
            <span class="form_title">Password:</span>
            <span><input type="password" v-model="loginInfo.password"></span>
          </div>
          <div class="text">
            {{loginText ? '' : 'User name or password is incorrect, please try again.'}}
          </div>
          <div style="height: 30px; margin-top: 5px;">
            <span class="login_btn" @click="submit()">Login</span>
          </div>
        </div>
        <div class="text">
          Forgot password? Please click
          <router-link :to="'/resetSend'" style="font-weight: 500; text-decoration: underline; color: #0066ff;">Here
          </router-link>
        </div>
        <!--<div class="text">-->
        <!--[Apply for access]-->
        <!--</div>-->
      </div>
    </div>
  </div>
</template>
<script>
  import xhrUrls from '../config/xhrUrls'
  import getData from '../config/indexApi'
  export default {
    data () {
      return {
        loginText: true,
        isLogin: false,
        loginInfo: {
          name: '',
          password: ''
        }
      }
    },
    methods: {
      submit () {
        this.isLogin = true
        getData(xhrUrls.LOGIN, {
          ...this.loginInfo
        }).then((data) => {
          if (data.data.code === 200) {
            this.$router.push({
              path: '/main'
            })
          } else {
            this.loginText = false
            console.log(data.data.message)
            this.isLogin = false
          }
        }, res => {
          this.loginText = false
          console.log(res.data.message)
          this.isLogin = false
        })
      }
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss">
  .login_div {
    width: 600px;
    height: 612px;
    margin-top: -300px;
    margin-left: -300px;
    top: 50%;
    left: 50%;
    position: absolute;

  img {
    position: absolute;
    width: 600px;
    height: 612px;
    top: 0;
    left: 0;
  }

  .content_box {
    position: absolute;
    z-index: 5;
    text-align: center;
    width: 100%;
    top: 50%;
    left: 0;
    font-size: 12px;

  input {
    border: none;
  }

  .title {
    font-size: 20px;
  }

  .form_title {
    display: inline-block;
    width: 70px;
  }

  .login_btn {
    padding: 5px 10px;
    line-height: 30px;
    background: #ffa340;
    cursor: pointer;
  }

  }
  }
</style>
