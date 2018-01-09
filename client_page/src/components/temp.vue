<template>
  <div v-if="detail">
    <div class="temp_common" style="position: relative;padding: 10px;" :style="mainStyle" v-if="!loading">
      <div class="tempCss" :style="winStyle">
        <create :data="htmlPath" :choose="detail.defineAreas"></create>
      </div>
      <div class="optionView" :style="commonStyle">
        <p style="color: #fff">
          Print | DIN A4 | Portriat | {{detail.defineAreas.length}} images layout
        </p>
        <div>
          <p style="color: #ffa340;">Please choose your images</p>
          <div class="clearfix" style="overflow: inherit;">
            <template v-for="one of detail.defineAreas">
              <template v-if="one.area_type == 'Text Area'">
                <div class="option_line clearfix" style="overflow: visible;">
                  <div class="tip">
                    {{one.block_name}}
                  </div>
                  <div style="width: 290px;">
                    <template v-for="(t, key) of one.text" v-if="t.isShow">
                      <div style="position: relative; margin-bottom: 35px;">
                        <!--<textarea class="choose" v-model="t.text" style="width: 100%"-->
                        <!--:placeholder="one.text.length > 1 ? 'Please input body text' : 'Please input title text'">-->
                        <!--</textarea>-->
                        <text-edit v-model="t.text"
                                   :placeholder="one.text.length > 1 ? 'Please input body text' : 'Please input title text'"></text-edit>
                        <span @click="one.text[key].fontSize++"
                              style="position: absolute; left: 53px; font-size: 12px;top: 2px; width: 40px;line-height: 30px;cursor: pointer; height: 30px; z-index: 1000; border-right: 1px solid #f1f1f1; color: #666;">
                          <i class="fa fa-plus"></i>
                        </span>
                        <span @click="one.text[key].fontSize--"
                              style="position: absolute; left: 93px; font-size: 12px;top: 2px; width: 40px;line-height: 30px;cursor: pointer; height: 30px; z-index: 1000; border-right: 1px solid #f1f1f1; color: #666;">
                          <i class="fa fa-minus"></i>
                        </span>
                        <!--<span @click.stop="chooseFontName(one.id, key)"-->
                        <!--style="position: absolute; right: -55px; top: 0px; width: 20px;cursor: pointer;line-height: 20px; height: 20px;background: #ffa340;">-->
                        <!--<i class="fa fa-font"></i>-->
                        <!--</span>-->
                        <span @click="t.isShow = false, one.showCount--, t.text=''"
                              style="position: absolute;left: 133px; font-size: 12px;top: 2px; width: 40px;line-height: 30px;cursor: pointer; height: 30px; z-index: 1000; border-right: 1px solid #f1f1f1; color: #666;">
                          <i class="fa fa-remove"></i>
                        </span>
                        <div class="fontDiv" v-show="fontNameShow == one.id && fontNameCount == key">
                          <div @click="one.text[key].fontName = 'Continental Stag Sans'">Continental Stag Sans</div>
                          <div @click="one.text[key].fontName = '方正兰亭黑简体'">方正兰亭黑简体</div>
                          <div @click="one.text[key].fontName = '方正大标宋繁体'">方正大标宋繁体</div>
                          <div @click="one.text[key].fontName = 'A-OTF Gothic MB101 Pro'">A-OTF Gothic MB101 Pro</div>
                          <div @click="one.text[key].fontName = 'Nanum Gothic'">Nanum Gothic</div>
                        </div>
                      </div>
                    </template>
                    <div style="color: #fff; border: 1px #fff dashed; cursor: pointer;"
                         @click="showText(one)" v-if="one.showCount < one.text_count">
                      <i class="fa fa-plus"></i>
                    </div>
                  </div>
                </div>
              </template>
              <template v-if="one.area_type == 'Visual Area'">
                <div class="option_line">
                  <div class="tip">
                    {{one.block_name}}
                  </div>
                  <div class="choose" @click.stop="editKey = one.id">
                    Choose image
                  </div>
                  <div class="edit" @click="one.img && editTemp(one)" style="cursor: pointer;">
                    Edit
                  </div>
                  <div class="edit">
                    OK
                  </div>
                  <div class="imgList" @click.stop v-if="editKey == one.id && one.img_url">
                    <div style="padding: 5px 20px;">
                      <div class="row">
                        <div class="col-xs-6" v-for="img of JSON.parse(one.img_url)" style="margin-bottom: 5px;">
                          <img :src="baseUrl + img" alt=""
                               @click="one.img = img">
                        </div>
                      </div>
                      <!--<div>-->
                      <!--<span style="cursor: pointer; color: #ffa340;"-->
                      <!--@click="chooseProduct = true">Product Image</span>-->
                      <!--|-->
                      <!--<span style="cursor: pointer; color: #ffa340;"-->
                      <!--@click="chooseProduct = false">Surroundings</span>-->
                      <!--</div>-->
                      <!--<div class="row" v-if="chooseProduct">-->
                      <!--<div class="col-xs-6" v-for="img of imageList" style="margin-bottom: 5px;">-->
                      <!--<img :src="img.img_url" alt="" @click="one.img = img.img_url">-->
                      <!--</div>-->
                      <!--</div>-->
                      <!--<div class="row" v-if="!chooseProduct">-->
                      <!--<div class="col-xs-6" v-for="one of imageListS" style="margin-bottom: 5px;">-->
                      <!--<img :src="img.img_url" alt="" @click="one.img = img.img_url">-->
                      <!--</div>-->
                      <!--</div>-->
                    </div>
                  </div>
                </div>
              </template>
            </template>
            <!--<p style="font-size: 16px;">-->
            <!--Confirm-->
            <!--<span style="color: #ffa340;">-->
            <!--Visual area-->
            <!--</span>-->
            <!--and start edit-->
            <!--<span style="color: #ffa340;">-->
            <!--communication area-->
            <!--</span>-->
            </p>
          </div>
        </div>
      </div>
      <div class="bottom_temp" style="padding-top: 10px">
        <span style="
        float: left;
        background: #ffa340;
        font-size: 14px;
        margin-right: 20px;
        color: #000;
        cursor: pointer;
        line-height: 30px;
        width: 50px;
        padding: 0 10px;"
              @click="back()">Back</span>

        <span style="
      float: right;
    background: #ffa340;
    font-size: 14px;
    margin-right: 20px;
    color: #000;
    line-height: 30px;
    padding: 0 10px; cursor: pointer;"
              @click="saveTemp()">Submit</span>
        <span style="
      float: right;
    background: #ffa340;
    font-size: 14px;
    margin-right: 20px;
    color: #000;
    line-height: 30px;
    padding: 0 10px;cursor: pointer;"
              @click="noSubSave()">Save</span>
        <span style="
              float: right;
              background: #ffa340;
              text-align: center;
              font-size: 14px;
              margin-right: 20px;
              color: #000;
              line-height: 30px;
              padding: 0 10px;cursor: pointer;"
              @click="seeTemp()">Preview</span>
        <span v-if="errTip" style="color: #ffa340;float: right;line-height: 30px;margin-right: 20px;">
          Please add images/text.
        </span>
      </div>
    </div>
    <div class="temp_common" v-if="loading" style="color: #ffa340; text-align: center;">
      <template v-if="isCreate">
        <template v-if="lastDo == 'Saved'">
          Saved！To continue editing please go to
          <router-link :to="'/main/info'">My Works.</router-link>
          .
        </template>
        <template v-if="lastDo !== 'Saved'">
          Submitted！To check the approval process please go to
          <router-link :to="'/main/info'">My Works.</router-link>
          .
        </template>
        <div class="bottom_temp" style="padding-top: 10px">
        <span style="
        float: left;
        background: #ffa340;
        font-size: 14px;
        margin-right: 20px;
        color: #000;
        cursor: pointer;
        line-height: 30px;
        width: 50px;
        padding: 0 10px;"
              @click="back()">Back</span>
          </span>
        </div>
      </template>
      <template v-if="!isCreate">
        <i class="fa fa-refresh fa-spin"></i> File generation
      </template>
    </div>
    <div v-if="seeUrl"
         style="position: fixed; left: 0; width: 100%; height: 100%; overflow-y: auto; top: 0;background: rgba(0,0,0,0.6); z-index: 3000;">
      <div style="width: 100%">
        <img :src="seeUrl" alt="" style="width: 80%; margin:10% auto; display: block;" :style="{width: zoom + '%'}">
        <div @click="seeUrl = ''"
             style="position: fixed; right: 50px; top: 50px; font-size: 50px; color: #fff; cursor: pointer; background: #000">
          <i class="fa fa-close"></i>
        </div>
        <div class="block" @click.stop style="width: 200px;
    position: fixed;
    z-index: 1000;
    margin-left: 50%;
    left: -100px;
    bottom: 100px;">
          <el-slider :min="50" :max="100" v-model="zoom"></el-slider>
        </div>
      </div>
    </div>
    <div v-if="seeLoading"
         style="position: fixed; left: 0; width: 100%; height: 100%; overflow-y: auto; top: 0;background: rgba(0,0,0,0.8); z-index: 3000;">
      <div style="width: 100%">
        <div class="overlay" style="width: 100%;text-align: center;">
          <img src="../assets/img/loading.gif" style="width: 10%; margin-top: 300px; border-radius: 300px;">
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  /* eslint-disable new-cap */

  import $ from '../plugins/jQuery/jquery-2.2.3.min'
  import couper from '../lib/couper'
  import xhrUrls from '../config/xhrUrls'
  import messageBox from './forms/msgBox'
  import getData from '../config/indexApi'
  import create from './create.vue'
  import { baseUrl } from '../config/config'
  import textEdit from './text.vue'
  let winWidth = document.documentElement.clientWidth
  let timer

  const createTextDom = (array) => {
    let fontSize
    let isShow
    let dom = $('<p>')
    for (let one of array) {
      isShow = one.isShow
      fontSize = one.fontSize
      dom.append($(`<font face="${one.fontName}">${one.text}</font>`))
    }
    return {
      fontSize,
      isShow,
      text: {
        dom,
        value: dom.text()
      }
    }
  }

  const getDomText = (dom, fontSize, isShow) => {
    let reArray = []
    for (let one of dom) {
      if (one.child) {
        for (let child of one.child) {
          child.value && reArray.push({
            fontSize,
            isShow,
            fontName: child.font || '',
            text: child.value
          })
        }
      }
    }
    return reArray
  }

  const getTextArray = ({ text, fontSize, isShow }) => {
    return getDomText(text.dom, fontSize, isShow)
  }

  export default {
    components: { create, textEdit },
    props: ['mainStyle', 'id', 'queryCount'],
    destroyed () {
      if (this.$router.beforeHooks.length > 1) {
        this.$router.beforeHooks.pop()
      }
      window.onbeforeunload = null
    },
    created () {
      $(document).click(() => {
        this.editKey = 0
        this.fontNameShow = ''
      })
      window.onbeforeunload = function () {
        return 'You are going to leave this page'
      }
      this.$router.beforeEach((to, from, next) => {
        if (this.$parent.tab3 === 3 && this.$parent.showPage === 3) {
          messageBox.confirm('Save the file before creating new?', {
            confirmButtonText: 'Save',
            cancelButtonText: 'Do Not Save'
          }).then(() => {
            this.noSubSave()
          }, () => {
            this.$router.beforeHooks.pop()
            next()
          })
        } else {
          this.$router.beforeHooks.pop()
          next()
        }
      })
//      getData(xhrUrls.SEARCH_IMAGE_LIST, {
//        ...this.listQuery,
//        page: 1,
//        pageSize: 1000,
//        img_type: 'Product Image'
//      }).then(res => {
//        this.imageList = res.data.data.pageInfo.rows
//      }, res => {
//      })
//      getData(xhrUrls.SEARCH_IMAGE_LIST, {
//        ...this.listQuery,
//        page: 1,
//        pageSize: 1000,
//        img_type: 'Surroundings'
//      }).then(res => {
//        this.imageListS = res.data.data.pageInfo.rows
//      }, res => {
//      })
    },
    mounted () {
      this.queryEditLayout()
    },
    methods: {
      showText (obj) {
        for (let key of Object.keys(obj.text)) {
          if (!obj.text[key].isShow) {
            obj.text[key].isShow = true
            obj.showCount++
            return
          }
        }
      },
      showErrTip () {
        this.errTip = true
        clearTimeout(timer)
        timer = setTimeout(() => {
          this.errTip = false
        }, 3000)
      },
      back () {
        if (this.isCreate) {
          this.$parent.tab3 = 1
        } else {
          messageBox.confirm('Save the file before creating new?', {
            confirmButtonText: 'Save',
            cancelButtonText: 'Do Not Save'
          }).then(() => {
            this.noSubSave()
          }, () => {
            this.$parent.tab3 = 1
          })
        }
      },
      init () {
        if (window.edit) {
          this.workId = window.edit.id
          let param = JSON.parse(window.edit.param)
          for (let key of this.detail.defineAreas) {
            for (let vKey of param) {
              if (key.links_self === vKey.key) {
                if (key.area_type === 'Visual Area') {
                  key.img = vKey.value
                } else {
                  key.showCount = 0
                  for (let textKey of Object.keys(key.text)) {
                    if (vKey.value[textKey]) {
//                      if (vKey.value[textKey].length) {
                      let obj = createTextDom(vKey.value[textKey])
//                      key.text[textKey].fontName = vKey.value[textKey].fontName
//                      key.text[textKey].fontSize = vKey.value[textKey].fontSize
//                      key.text[textKey].isShow = vKey.value[textKey].isShow
//                      key.text[textKey].text = vKey.value[textKey].text
                      key.text[textKey].fontSize = obj.fontSize
                      key.text[textKey].isShow = obj.isShow
                      key.text[textKey].text = obj.text
//                      }else {
//
//                      }
                    }
                    if (vKey.value[textKey] && vKey.value[textKey].text) {
                      key.showCount++
                      key.text[textKey].isShow = true
                    }
                  }
                  key.showCount = key.showCount === 0 ? 1 : key.showCount
                }
              }
            }
          }
          window.edit = null
        }
      },
      chooseFontName (id, key) {
        this.fontNameShow = id
        this.fontNameCount = key
      },
      editTemp (obj) {
        console.log(obj)
        let points = this.htmlPath[0].rectangle[obj.self]
        let width
        let height
        if (points) {
          width = points.anchors[2].x - points.anchors[0].x
          height = points.anchors[2].y - points.anchors[0].y
        }
        console.log(width)
        console.log(height)
        couper((dataUrl, file) => {
          obj.img = dataUrl
          let formData = new window.FormData()
          formData.append('imgFile', file, 'a.jpg')
          getData(xhrUrls.UPLOAD_IMG, formData).then(res => {
            if (res.data.code === 200) {
              obj.img = res.data.data.url
            }
          }, res => {
            console.log(res)
          })
        }, baseUrl + obj.img, width, height)
      },
      getQuery () {
        let subData = []
        let messageCount = 0
        for (let one of this.detail.defineAreas) {
          if (one.img) {
            messageCount++
            console.log(one.img)
            let img = new window.Image()
            img.onload = () => {
              let points = this.htmlPath[0].rectangle[one.self]
              let width = points.anchors[2].x - points.anchors[0].x
              let height = points.anchors[2].y - points.anchors[0].y
              let x = width / img.width
              let y = height / img.height
              let transformList = one['itemTransform'].split(' ')
              transformList[0] = x
              transformList[3] = y
              subData.push({
                key: one['links_self'],
                value: one.img,
                type: 'img',
                itemTransform: {
                  itemTransform: transformList.join(' '),
                  width: img.width,
                  height: img.height
                }
              })
              console.log('push')
            }
            img.src = baseUrl + one.img
          }
          if (Object.keys(one.text).length) {
            let value = []
            console.log(one)
            for (let key of Object.keys(one.text)) {
              if (one.text[key] && one.text[key].text) {
                messageCount++
                value.push(getTextArray(one.text[key]))
              }
            }
            value.length && subData.push({
              key: one['links_self'],
              value,
              type: 'text'
            })
          }
        }
        if (!messageCount) {
          return false
        }
        return subData
      },
      noSubSave () {
        this.lastDo = 'Saved'
        let query = this.getQuery()
//        console.log(query)
        if (!query) {
          this.showErrTip()
          return
        }
        this.loading = true
        setTimeout(() => {
          let q = {
            id: this.id,
            param: JSON.stringify(query)
          }
          console.log(this.workId)
          if (this.workId) {
            q.workId = this.workId
          }
          getData(xhrUrls.SAVE_LAYOUT, q).then(res => {
            this.queryCount()
            this.$router.beforeHooks.pop()
            this.isCreate = true
          }, res => {
            this.loading = false
            console.log(res)
          })
        }, 2000)
      },
      saveTemp () {
        messageBox.confirm('Please note that you’re not able to recall after submitting', {
          confirmButtonText: 'Submit',
          cancelButtonText: 'Cancel'
        }).then(() => {
          this.lastDo = 'Submitted'
          let query = this.getQuery()
          if (!query) {
            this.showErrTip()
            return
          }
          this.loading = true
          setTimeout(() => {
            let q = {
              id: this.id,
              param: JSON.stringify(query)
            }
            if (this.workId) {
              q.workId = this.workId
            }
            getData(xhrUrls.CREATE_NEW_LAYOUT, q).then(res => {
              this.queryCount()
              this.isCreate = true
              this.$router.beforeHooks.pop()
            }, res => {
              this.loading = false
              console.log(res)
            })
          }, 2000)
        }, () => {
        })
      },
      seeTemp () {
//        this.getQuery()
        let query = this.getQuery()
        if (!query) {
          this.showErrTip()
          return
        }
        this.seeLoading = true
        setTimeout(() => {
          let q = {
            id: this.id,
            param: JSON.stringify(query)
          }
          if (this.workId) {
            q.workId = this.workId
          }
          getData(xhrUrls.SEE_NEW_LAYOUT, q).then(res => {
            if (res.data.code === 200) {
              this.seeUrl = baseUrl + res.data.data.url
              this.seeLoading = false
            } else {
              this.seeLoading = false
            }
          }, res => {
            this.seeLoading = false
            console.log(res)
          })
        }, 2000)
      },
      queryEditLayout () {
        getData(xhrUrls.SEARCH_LAYOUT_DETAIL, {
          id: this.id
        }).then(res => {
          if (res.data.code === 200) {
            let detail = res.data.data
            for (let one of detail.defineAreas) {
              one.img = ''
              one.tx = 0
              one.ty = 0
              one.text = []
              one.showCount = 1
              for (let i = 0; i < one.text_count; i++) {
                one.text.push({
                  text: '',
                  isShow: i === 0,
                  fontSize: parseInt(one.font_size.split(',')[i]),
                  fontName: one.font_name ? parseInt(one.font_name.split(',')[i]) : ''
                })
              }
            }
            this.detail = detail
            console.log(detail)
            let html = JSON.parse(detail.layout.html_path)
            this.htmlPath = html
            let bi = html[0].width / html[0].height
            let width = winWidth * 0.5 / 2
            let height = width / bi
            if (height > parseInt(this.mainStyle.height) - 120) {
              height = parseInt(this.mainStyle.height) - 120
              width = height * bi
            }
            this.winStyle.width = width + 'px'
            this.commonStyle.width = winWidth * 0.8 / 2 + 'px'
            this.commonStyle.height = parseInt(this.mainStyle.height) - 100 + 'px'
            this.winStyle.height = height + 'px'
            this.init()
          }
        })
      }
    },
    data () {
      return {
        zoom: 10,
        baseUrl,
        errTip: false,
        workId: '',
        fontNameCount: 0,
        fontNameShow: '123',
        htmlPath: null,
        seeUrl: '',
        lastDo: '',
        isCreate: false,
        commitData: {},
        chooseProduct: true,
        imageList: [],
        imageListS: [],
        detail: null,
        editKey: 0,
        loading: false,
        seeLoading: false,
        winStyle: {
          width: 0,
          height: 0
        },
        commonStyle: {
          width: 0,
          height: 0
        }
      }
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss" type="text/scss">
  .fontDiv {
    position: absolute;
    right: -30px;
    top: 0px;
    width: 200px;
    height: 100px;
    overflow-y: auto;
    border: 1px solid #ffa340;
    color: #ffa340;
    background: #000;
    z-index: 50;
  }

  .fontDiv div {
    line-height: 20px;
    text-align: left;
    cursor: pointer;
    padding: 5px 10px;
  }

  .fontDiv div:hover {
    background: #ffa340;
    color: #000;
  }

  .chooseTip {
    height: 30px;
    width: 30px;
    line-height: 30px;
    background: #000;
    border: 1px solid #ffa340;
    color: #ffa340;
    font-size: 24px;
    text-align: center;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate3d(-50%, -50%, 0);
  }

  .temp_center {
    position: absolute;
    height: 100%;
    left: 50%;
    transform: translate3d(-50%, 0, 0);
  }

  .option_line {
    min-height: 30px;
    position: relative;
    margin-bottom: 20px;
    min-width: 370px;

    >
    div {
      text-align: center;
      float: left;
    }

    .tip {
      height: 30px;
      width: 30px;
      line-height: 30px;
      background: #000;
      border: 1px solid #ffa340;
      color: #ffa340;
      margin-right: 20px;
      font-size: 24px;
      text-align: center;
    }

    .choose {
      text-align: left;
      background: #ffa340;
      font-size: 14px;
      color: #000;
      line-height: 30px;
      width: 150px;
      margin-right: 20px;
      padding: 0 10px;
    }

    .edit {
      background: #ffa340;
      font-size: 14px;
      margin-right: 20px;
      color: #000;
      line-height: 30px;
      width: 50px;
      padding: 0 10px;
    }

    .imgList {
      position: absolute;
      top: 35px;
      left: 0;
      width: 95%;
      height: 300px;
      box-sizing: border-box;
      overflow-y: auto;
      z-index: 8000;
      min-height: 30px;
      background: #000;
      border: 1px solid #ffa340;

      img {
        width: 100%;
      }

    }
    .imgList2 {
      position: absolute;
      bottom: 35px;
      left: 0;
      width: 95%;
      height: 300px;
      box-sizing: border-box;
      overflow-y: auto;
      z-index: 800;
      min-height: 30px;
      background: #000;
      border: 1px solid #ffa340;

      img {
        width: 100%;
      }

    }
  }

  .optionView {
    position: absolute;
    margin-top: 20px;
    right: 0;
    top: 0;
    overflow-y: auto;
  }

  .tempCss {
    margin-top: 30px;
    position: absolute;

    img {
      width: 100%;
      height: 100%;
    }

  }

  .bottom_temp {
    border-top: 1px solid #fff;
    height: 50px;
    position: absolute;
    bottom: 0;
    width: 100%;
    left: 0;
  }

  textarea:active, textarea:focus {
    border: 1px solid #ffa340;
  }

  .temp_common {
    overflow-y: inherit !important;
  }

  .temp2 {
    position: absolute;
  }

  pre {
    background: none !important;
  }
</style>
