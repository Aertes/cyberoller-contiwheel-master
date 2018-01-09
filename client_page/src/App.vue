<template>
  <div id="body">
    <div class="lun_tai" ref="menu">
      <div class="lun_con" :style="lunStyle">
        <div class="mask" v-if="childShow" ref="mask"></div>
        <canvas id="canvas" width="790" height="790" style="margin: 20px;"></canvas>
      </div>
      <img @click="showMenu()" src="./assets/img/mouseoff.gif">
      <img @click="showMenu()" class="mouseover" src="./assets/img/mouseover.png">
    </div>
    <div class="main_tip" v-if="!childShow">
      <div style="text-align: right; padding: 30px 50px 0 0;color: #ffa340;">
        Welcome
        <span style="margin-right: 10px;"></span>
        [
        <router-link :to="'/main/password'" style="color: #ffa340;">
          {{user && user.name}}
        </router-link>
        <span style="margin-right: 20px;">]</span>|
        <router-link :to="'/main/lib'" style="color: #ffa340; margin-right: 20px; margin-left: 20px;">
          Library
        </router-link>
        |
        <router-link :to="'/main/info'"
                     style="color: #ffa340; margin-right: 20px; margin-left: 20px;position: relative;">
          My Works <span v-if="count"
                         style="position: absolute; background: red; color: #fff; border-radius: 10px; padding: 0 7px; text-align: center; top: -15px; right: -15px;">
          {{count}}
        </span>
        </router-link>
        |
        <a href="" style="color: #ffa340; margin-left: 20px;">Log out</a>
      </div>
      <p ref="img" v-show="menu2">
        <i style="font-weight: 600;">Content</i> :{{menu1}} <br><br><i style="font-weight: 600;">Channel</i> : {{menu2}}
        <!--Please select from the wheel the section that would best suit you query-->
      </p>
      <p ref="img" v-show="menu2" style="margin-top: 100px; border: none;">
        <span @click="shouConfirm()">
          Confirm
          <!--<img ref="shou" src="./assets/img/shou.png" alt="">-->
        </span>
      </p>
    </div>
    <div class="common_view" v-if="childShow">
      <div style="text-align: right; padding: 30px 50px 0 0;color: #ffa340;">
        Welcome
        <span style="margin-right: 10px;"></span>
        [
        <router-link :to="'/main/password'" style="color: #ffa340;">
          {{user && user.name}}
        </router-link>
        <span style="margin-right: 20px;">]</span>
        |
        <router-link :to="'/main/lib'" style="color: #ffa340; margin-right: 20px; margin-left: 20px;">
          Library
        </router-link>
        |
        <router-link :to="'/main/info'"
                     style="color: #ffa340; margin-right: 20px; margin-left: 20px;position: relative;">
          My Works
          <span v-if="count"
                style="position: absolute; background: red; color: #fff; border-radius: 10px; padding: 0 7px; text-align: center; top: -15px; right: -15px;">
          {{count}}
        </span>
        </router-link>
        |
        <a href="" style="color: #ffa340; margin-left: 20px;">Log out</a>
      </div>
      <router-view :queryCount="queryCount" :menu="menu2" :mId="menuId"></router-view>
    </div>
  </div>
</template>

<script>
  import createSvg from './components/svg'
  import velocity from 'velocity-animate'
  import xhrUrls from './config/xhrUrls'
  import getData from './config/indexApi'

  let winWidth = document.documentElement.clientWidth
  let winHeight = document.documentElement.clientHeight

  export default {
    created () {
      this.queryCount()
      getData(xhrUrls.GET_USER).then((data) => {
        if (data.body.code === 200) {
          this.user = data.body.data.user
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
      let widthZoom = 1
      if (winWidth / 2 < 900) {
        widthZoom = (winWidth / 2) / 900
      }
      let heightZoom = 1
      if (winHeight < 900) {
        heightZoom = winHeight / 900
      }
      this.lunStyle.transform = `scale(${widthZoom > heightZoom ? heightZoom : widthZoom})`
    },
    mounted () {
      if (this.$route.fullPath === '/main/lib' || this.$route.fullPath === '/main/info' || this.$route.fullPath === '/main/password') {
        this.childShow = true
        velocity(this.$refs.mask, {
          opacity: 0
        }, { duration: 0 })
        velocity(this.$refs.menu, {
          left: '-35%'
        }, {
          duration: 300,
          complete: () => {
            velocity(this.$refs.mask, {
              opacity: 1
            }, { duration: 200 })
          }
        })
      } else if (this.$route.fullPath !== '/main') {
        this.shouConfirm(true)
      } else {
        this.showMenu()
      }
      createSvg(data => {
        if (data.parent) {
          this.menu1 = data.parent.name
          this.menu2 = data.name
        } else {
          this.menu1 = data.name
          this.menu2 = data.child[2].name
        }
        velocity(this.$refs.img, {
          opacity: 0,
          marginLeft: -100
        }, { duration: 0 })
        velocity(this.$refs.shou, {
          opacity: 0,
          marginTop: 10
        }, { duration: 0 })
        velocity(this.$refs.img, {
          opacity: 1,
          marginLeft: 0
        }, {
          duration: 600,
          complete: () => {
            velocity(this.$refs.shou, {
              opacity: 1,
              marginTop: 0
            }, { duration: 300 })
          }
        })
      })
    },
    methods: {
      queryCount () {
        getData(xhrUrls.SEARCH_MESSAGE_COUNT).then(res => {
          this.count = res.data.data.count
        })
      },
      shouConfirm (isNotGo) {
        console.log(this.menu2)
        if ((this.menu2 === 'Promotion' || this.menu2 === 'Retail/ Point of Sales Materials') && this.menu1 === 'Product') {
          this.menuId = this.menu2 === 'Promotion' ? '71c1532212f211e790656c92bf3149c7' : 'd6a394fe12f211e790656c92bf3149c7'
          this.childShow = true
          velocity(this.$refs.mask, {
            opacity: 0
          }, { duration: 0 })
          velocity(this.$refs.menu, {
            left: '-35%'
          }, {
            duration: isNotGo ? 0 : 300,
            complete: () => {
              velocity(this.$refs.mask, {
                opacity: 1
              }, { duration: 200 })
            }
          })
          if (!isNotGo) {
            this.$router.push('/main/app')
          }
        } else {
          !isNotGo && window.alert('Function under construction...')
        }
      },
      showMenu () {
        this.childShow = false
        this.$router.push('/main')
        velocity(this.$refs.menu, {
          left: 0
        }, { duration: 300 })
      }
    },
    data () {
      return {
        count: 0,
        user: null,
        menu1: 'Product',
        menu2: 'Retail/ Point of Sales Materials',
        menuId: '',
        lunStyle: {
          transform: '',
          width: '790px',
          height: '790px'
        },
        childShow: false
      }
    },
    watch: {
      $route (route) {
        if (route.fullPath === '/main/lib' || route.fullPath === '/main/info' || route.fullPath === '/main/password') {
          this.childShow = true
          velocity(this.$refs.mask, {
            opacity: 0
          }, { duration: 0 })
          velocity(this.$refs.menu, {
            left: '-35%'
          }, {
            duration: 300,
            complete: () => {
              velocity(this.$refs.mask, {
                opacity: 1
              }, { duration: 200 })
            }
          })
        } else if (route.fullPath !== '/main') {
          this.shouConfirm(true)
        } else {
          this.showMenu()
        }
      }
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss" type="text/scss">

  .canvas-container {
    margin: -20px;
  }

  .lun_tai {
    position: absolute;
    width: 50%;
    height: 100%;
    top: 0;
    z-index: 500;
    left: 0;
    .mouseover {
      opacity: 0;
    }
    .mouseover:hover {
      opacity: 1;
    }

    img {
      width: 30px;
      position: absolute;
      top: 50%;
      margin-top: -8px;
      right: -90px;
      cursor: pointer;
      margin-right: 50px;
    }

  }

  .mask {
    position: absolute;
    width: 100%;
    height: 100%;
    opacity: 0;
    top: 0;
    left: 0;
    border-radius: 400px;
    background: linear-gradient(to right, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0));
    z-index: 1000;
  }

  .lun_con {
    position: absolute;
    top: 50%;
    left: 50%;
    margin-left: -395px;
    margin-top: -395px;
  }

  .fadeOutNow {
    display: block;
  }

  .main_tip {
    position: absolute;
    width: 50%;
    height: 100%;
    top: 0;
    right: 0;

    p {
      position: absolute;
      top: 40%;
      left: 20%;
      font-size: 16px;
      color: #fff;
      width: 400px;
      border: 1px solid #333;
      text-align: center;
      padding: 20px 10px;
      display: block;

      span {
        display: inline-block;
        background: #ffa340;
        color: #000;
        margin-top: 30px;
        font-size: 18px;
        padding: 5px 10px;
        cursor: pointer;
        position: relative;

        >
        img {
          position: absolute;
          top: 80%;
          left: 80%;
          width: 50px;
          opacity: 0;
        }

      }
    }
  }

  .common_view {
    position: absolute;
    width: 80%;
    height: 100%;
    top: 0;
    right: 0;
    overflow: hidden;
  }
</style>
