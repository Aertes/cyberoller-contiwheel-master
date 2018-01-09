<template>
  <div>
    <div class="main_window">
      <p class="main_title" style="font-weight: 900;">
        Product &nbsp;&nbsp; > &nbsp;&nbsp; {{menu}}
      </p>
      <div style="font-size: 15px">
        <div style="max-width: 400px;" class="select_input">
          <s-select title="select Product" v-model="selectValue" style="height: 30px;">
            <option value="0" v-if="selectValue == 0">
              - Select Product -
            </option>
            <option :value="pro.id" v-for="pro of productList" v-if="pro.isAvailable == 1">
              {{pro.name}}
            </option>
          </s-select>
        </div>
      </div>
      <div v-if="selectValue != 0">
        <div class="main_line">
          <div class="row">
            <div class="col-xs-4 row_tab" @click="checkTab(1)" :class="{active: showPage == 1}"
                 style=" font-weight: 900;">
              Product Informaiton
            </div>
            <div class="col-xs-4 row_tab" @click="checkTab(2)" :class="{active: showPage == 2}"
                 style=" font-weight: 900;">
              Design Regulations
            </div>
            <div class="col-xs-4 row_tab" @click="checkTab(3)" :class="{active: showPage == 3}"
                 style=" font-weight: 900;">
              Create
            </div>
          </div>
        </div>
        <div style="border-top:none;" v-if="showPage == 1" :style="win1" class="main_line">
          <ul class="informaiton_list">
            <li class="title_1" v-for="tree of treeData[menuId]">
              <div style=" font-weight: 900;">{{tree.name}}</div>
              <ul>
                <li class="title_2" v-for="tree2 of tree.child">
                  <div><span class="yuan" style="font-size: 12px; position: relative; top: -1px;">●</span>
                    {{tree2.name}}
                  </div>
                  <ul>
                    <li v-for="tree3 of tree2.child">
                      <div class="content_text" v-if="tree3.type == 'text'" style=" font-weight: 500;">
                        {{tree3.content}}
                      </div>
                      <div class="content_img clearfix" v-if="tree3.type == 'img'" style="overflow: inherit;">
                        <div v-for="image of tree3.images"
                             style="position:relative;width: 153px; float: left; margin-right: 10px;"
                             class="content_img_hover" @mousemove="move($event)">
                          <img :src="baseUrl + image.url">
                          <div class="content_img_detail">
                            <img :src="baseUrl + image.url">
                            {{image.text}}
                          </div>
                        </div>
                      </div>
                    </li>
                  </ul>
                </li>
              </ul>
            </li>
          </ul>
        </div>
        <div v-if="showPage == 2">
          <div class="row" style="max-width: 600px; font-size: 15px;">
            <div class="clearfix" style="margin-top: 20px;">
              <div class="col-xs-3" style="line-height: 28px; color: #ffa340; font-weight: 600;">
                Material List
              </div>
              <div class="col-xs-8">
                <s-select v-model="selectSize">
                  <option value="0" v-if="selectSize == 0">
                    - Select Material -
                  </option>
                  <template v-for="mat of materialList">
                    <option :value="mat.id" v-if="mat.p_id == menuId && mat.isAvailable == 1">{{mat.name}}</option>
                  </template>
                </s-select>
              </div>
            </div>
            <div class="clearfix" style="margin-top: 20px;">
              <div class="col-xs-3" style="line-height: 28px; color: #ffa340;font-weight: 600;">
                Size
              </div>
              <div class="col-xs-8">
                <s-select v-model="selectList">
                  <option value="0" v-if="selectList == 0">
                    - Select Size -
                  </option>
                  <template v-for="size of sizeList">
                    <option :value="size.id" v-if="selectSize == size.p_id && size.isAvailable == 1">
                      {{size.name}}
                    </option>
                  </template>
                </s-select>
              </div>
            </div>
          </div>
          <div class="main_line tree_data_2" :style="win2" v-if="selectList && selectSize">
            <div style="text-align: left">
              <div v-if="treeData2">
                <div class="row">
                  <div class="col-xs-4">
                    <div class="form-group">
                      <img v-if="treeData2.overall" style="width: 100%;" :src="baseUrl + treeData2.overall" />
                      <br>
                    </div>
                  </div>
                  <div class="col-xs-6 col-xs-offset-2">
                    <label style="text-decoration: underline;">Design Guide</label>
                    <div class="form-group" style="margin-top: 10px" v-if="treeData2.frame">
                      <label>Frame Size</label>
                      <p>{{treeData2.frame}}</p>
                    </div>
                    <div class="form-group" v-if="treeData2.quality">
                      <label>Quality Seal Size</label>
                      <p>{{treeData2.quality}}</p>
                    </div>
                    <div class="form-group">
                      <label>Log without tagline including protection area</label>
                      <p>{{treeData2.log}}</p>
                    </div>
                    <div class="form-group" v-if="treeData2.logo">
                      <label>Logo with tagline including protection area</label>
                      <p>{{treeData2.logo}}</p>
                    </div>
                    <div class="form-group" v-if="treeData2.xValue">
                      <label>X-value</label>
                      <p>{{treeData2.xValue}}</p>
                    </div>
                  </div>
                </div>
                <div class="row" style="margin-top: 20px;">
                  <div class="col-xs-4">
                    <div class="form-group">
                      <img v-if="treeData2.layout" style="width: 100%;" :src="baseUrl + treeData2.layout" />
                      <br>
                    </div>
                  </div>
                  <div class="col-xs-6  col-xs-offset-2">
                    <label style="text-decoration: underline;">Layout Principle</label>
                    <div class="form-group" style="margin-top: 10px" v-if="treeData2.visual">
                      <label>Visual Area</label>
                      <pre>{{treeData2.visual}}</pre>
                    </div>
                    <div class="form-group" v-if="treeData2.communication">
                      <label>Communication Area</label>
                      <pre>{{treeData2.communication}}</pre>
                    </div>
                    <div class="form-group">
                      <pre style="color: #ffa340;" v-if="treeData2.tips">{{treeData2.tips}}</pre>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="showPage == 3 && tab3 != 3">
        <div class="row" style="max-width: 600px; font-size: 15px;">
          <div class="clearfix" style="margin-top: 20px;">
            <div class="col-xs-3" style="line-height: 28px; color: #ffa340; font-weight: 600;">
              Material List
            </div>
            <div class="col-xs-8">
              <s-select v-model="selectSize2">
                <option value="0" v-if="selectSize2 == 0">
                  - Select Material -
                </option>
                <template v-for="mat of materialList">
                  <option :value="mat.id" v-if="mat.p_id == menuId && mat.isAvailable == 1">{{mat.name}}</option>
                </template>
              </s-select>
            </div>
          </div>
          <div class="clearfix" style="margin-top: 20px;">
            <div class="col-xs-3" style="line-height: 28px; color: #ffa340;font-weight: 600;">
              Size
            </div>
            <div class="col-xs-8">
              <s-select v-model="selectList2">
                <option value="0" v-if="selectList2 == 0">
                  - Select Size -
                </option>
                <template v-for="size of sizeList">
                  <option :value="size.id" v-if="size.p_id == selectSize2 && size.isAvailable == 1">{{size.name}}
                  </option>
                </template>
              </s-select>
            </div>
          </div>
        </div>
        <div class="main_line" style="font-size: 14px" :style="win2"
             v-show="selectList2 != 0 && selectSize2 != 0 && tab3 == 1">
          <div class="row">
            <div class="col-xs-4 tab3" style="line-height: 40px" :class="{tab3_active: tab3Choose == 1}"
                 @click="queryEditLayout()">
              Edit Your Own
            </div>
            <div class="col-xs-4 tab3" style="line-height: 40px" :class="{tab3_active: tab3Choose == 2}"
                 @click="queryAdLayout()">
              Choose from existing ad
            </div>
            <div class="col-xs-4 tab3" style="line-height: 40px" :class="{tab3_active: tab3Choose == 3}"
                 @click="tab3Choose = 3">
              Contact agency for local adaptation
            </div>
          </div>
          <div v-show="tab3Choose == 1"
               style="position: relative;"
               :style="win22">
            <div style="position: absolute;margin-top: 30px;width: 100%; height: 100%;">
              <div ref="framePanel"
                   style="width: 80%; margin: auto;top: 50%;height: 1px; position: relative; text-align: left;">
                <template v-for="(layout, index) of layoutList">
                  <img style="width: 32%; cursor: pointer; transform: translate3d(0, -50%, 0);"
                       :src="baseUrl + layout.view_png"
                       @click="chooseLayout = layout, tab3 = 3"
                       v-if="index === layoutListShowCount">
                  <img style="width: 32%; cursor: pointer;transform: translate3d(0, -50%, 0);"
                       :src="baseUrl + layout.view_png"
                       @click="chooseLayout = layout, tab3 = 3"
                       v-if="index === layoutListShowCount + 1">
                  <img style="width: 32%; cursor: pointer;transform: translate3d(0, -50%, 0);"
                       :src="baseUrl + layout.view_png"
                       @click="chooseLayout = layout, tab3 = 3"
                       v-if="index === layoutListShowCount + 2">
                </template>
              </div>
              <div
                @click="layoutGo(-3)"
                style="width: 50px;height: 50px; position: absolute; top: 50%;
              font-size: 50px; color: #ffa340; cursor: pointer;
              margin-left: 0;
              left: 0;margin-top: -25px;"><i class="fa fa-caret-left"></i></div>
              <div
                @click="layoutGo(3)"
                style="width: 50px;height: 50px; position: absolute; top: 50%;
                margin-right: 0;
              font-size: 50px; color: #ffa340;cursor: pointer;
              right: 0;margin-top: -25px;"><i class="fa fa-caret-right"></i></div>
            </div>
            <!--<div-->
            <!--@click="tab3 = 3"-->
            <!--style="position: absolute; bottom: 0; right: 30px;-->
            <!--background: #ffa340;-->
            <!--color: #000;-->
            <!--margin-bottom: 10px;-->
            <!--cursor: pointer;-->
            <!--font-size: 18px;-->
            <!--padding: 5px 10px;">-->
            <!--next-->
            <!--</div>-->
          </div>
          <div v-show="tab3Choose == 2"
               style="position: relative;"
               :style="win22">
            <div style="position: absolute;margin-top: 30px;width: 100%; height: 100%;">
              <div ref="framePanel"
                   style="width: 80%; top: 50%; height: 1px;margin: auto; position: relative; text-align: left;">
                <template v-for="(layout, index) of adsList">
                  <img style="width: 32%;transform: translate3d(0, -50%, 0); cursor: pointer;"
                       :src="baseUrl + layout.ad_previwe"
                       @click="down(layout)"
                       v-if="index === adListShowCount">
                  <img style="width: 32%;transform: translate3d(0, -50%, 0); cursor: pointer;"
                       :src="baseUrl + layout.ad_previwe"
                       @click="down(layout)"
                       v-if="index === adListShowCount+1">
                  <img style="width: 32%;transform: translate3d(0, -50%, 0); cursor: pointer;"
                       :src="baseUrl + layout.ad_previwe"
                       @click="down(layout)"
                       v-if="index === adListShowCount+2">
                </template>
              </div>
              <div
                @click="adGo(-3)"
                style="width: 50px;height: 50px; position: absolute; top: 50%;
              font-size: 50px; color: #ffa340; cursor: pointer;
              margin-left: 0;
              left: 0;margin-top: -25px;"><i class="fa fa-caret-left"></i></div>
              <div
                @click="adGo(3)"
                style="width: 50px;height: 50px; position: absolute; top: 50%;
                margin-right: 0;
              font-size: 50px; color: #ffa340;cursor: pointer;
              right: 0;margin-top: -25px;"><i class="fa fa-caret-right"></i></div>
            </div>
          </div>
          <div v-if="tab3Choose == 3" style="position: relative" :style="win21">
            <div class="banner_main"
                 style="width: 100%;text-align: left; position: absolute; left: 50%;transform: translate3d(-50%, 0%, 0);">
              <div>
                <div style="background: #ffa340; color: #000000; padding: 5px 5px; font-weight: 900;">
                  To: Pico Plus
                </div>
                <div style="background: #e2e2e2; color: #000000; padding: 5px 5px; font-weight: 900;">
                  Subject: Request for local adaptation
                </div>
                <div style="height: 240px; background: #fff; color: #666; box-sizing: border-box;">
                  <textarea style="height: 100%; width: 100%;padding: 15px;" v-model="emailMsg"></textarea>
                </div>
                <div
                  @click="emailMsg && sendEMail()"
                  style="background: #ffa340; color: #000000; padding: 5px 5px;
                    font-weight: 900; text-align: right;"
                  :style="{color: emailMsg ? '#000000' : '#ccc', cursor: emailMsg ? 'pointer' : 'not-allowed'}">
                  <button>Confirm and send</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="showPage == 3 && tab3 == 3">
      <temp ref="temp" :mainStyle="win1" :queryCount="queryCount" :id="chooseLayout.id"></temp>
    </div>
    <div v-if="sendLoading"
         style="position: fixed; left: 0; width: 100%; height: 100%; overflow-y: auto; top: 0;background: rgba(0,0,0,0.8); z-index: 3000;">
      <div style="width: 100%">
        <div class="overlay" style="width: 100%;text-align: center;">
          <img src="../assets/img/loading.gif" style="width: 100%;">
        </div>
      </div>
    </div>
    <div v-if="seeAd.ad_previwe" @click="seeAd = {}"
         style="position: fixed; left: 0; width: 100%; height: 100%; overflow-y: auto; top: 0;background: rgba(0,0,0,0.8); z-index: 3000;">
      <div style="width: 100%; text-align: center;">
        <span @click.stop="downFile(seeAd)"
              style="background: #ffa340; font-size: 30px; padding: 10px 30px;margin-top: 10px;cursor: pointer;display: inline-block;">Download</span>
        <div class="overlay" style="width: 100%;text-align: center;">
          <img :src="seeAd.ad_previwe" alt="" style="width: 80%; margin:10% auto; display: block;">
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import messageBox from './forms/msgBox'
  import temp from './temp.vue'
  import create from './create.vue'
  import xhrUrls from '../config/xhrUrls'
  import getData from '../config/indexApi'
  import $ from '../plugins/jQuery/jquery-2.2.3.min'
  import { baseUrl } from '../config/config'

  let winWidth = document.documentElement.clientWidth
  let winHeight = document.documentElement.clientHeight

  export default {
    props: ['menu', 'mId', 'queryCount'],
    components: { temp, create },
    computed: {
      menuId () {
        return this.mwId || this.mId
      }
    },
    created () {
      this.initProduct()
      this.win1.height = winHeight - 212 + 'px'
      this.win2.height = winHeight - 320 + 'px'
      this.win21.height = winHeight - 320 - 60 + 'px'
      this.win22.height = winHeight - 320 - 100 + 'px'
      this.imgStyle.width = winWidth * 0.45 + 'px'
    },
    data () {
      return {
        baseUrl,
        mwId: '',
        seeAd: {},
        emailMsg: `Request from: Continental Shanghai

Item: Standee

Size: 1:3

Creative requirement: Please write your brief here

Deadline: 2017/04/05`,
        sendLoading: false,
        toRight: 0,
        layoutList: [],
        adsList: [],
        chooseLayout: null,
        layoutListShowCount: 0,
        adListShowCount: 0,
        materialList: [],
        sizeList: [],
        productList: [],
        treeData: [],
        treeData2: null,
        tab3: 1,
        tbb3Img: false,
        selectValue: '0',
        selectSize: '0',
        selectList: '0',
        // mock
        selectSize2: '0',
        // mock
        selectList2: '0',
        tab3Choose: 1,
        showPage: 1,
        win1: {
          height: 0,
          overflowY: 'auto',
          overflowX: 'hidden'
        },
        win2: {
          height: 0,
          overflowY: 'auto',
          overflowX: 'hidden'
        },
        win21: {
          height: 0
        },
        win22: {
          height: 0,
          overflowY: 'auto',
          overflowX: 'hidden'
        },
        imgStyle: {
          width: 0
        },
        index: 1
      }
    },
    methods: {
      checkTab (value) {
        if (this.showPage === 3 && this.tab3 === 3 && !this.$refs.temp.isCreate) {
          messageBox.confirm('Save the file before creating new?', {
            confirmButtonText: 'Save',
            cancelButtonText: 'Do Not Save'
          }).then(() => {
            this.$refs.temp.noSubSave()
          }, () => {
            this.showPage = value
            this.tab3 = 1
          })
        } else {
          this.showPage = value
          this.tab3 = 1
        }
      },
      move (event) {
        let $img = $(event.target)
        $img = $img.is('.content_img_hover') ? $img : $img.parents('.content_img_hover')
        let top = $img.offset().top
        console.log(top)
        $img.find('.content_img_detail').css({
          top: -top + 300
        })
//        console.log($img.offset().top)
//        if ($img.offset().top > 400) {
//          $img.find('.content_img_detail').addClass('content_img_detail_bottom')
//        } else {
//          $img.find('.content_img_detail').removeClass('content_img_detail_bottom')
//        }
      },
      editInit () {
        if (window.edit) {
          this.selectValue = window.edit.product
          for (let mat of this.materialList) {
            if (mat.id === window.edit.material) {
              this.mwId = mat.p_id
              this.chooseLayout = { id: window.edit.define_id }
              this.showPage = 3
              this.tab3 = 3
            }
          }
        }
      },
      sendEMail () {
        this.sendLoading = true
        getData(xhrUrls.SEND_EMAIL, {
          message: this.emailMsg
        }).then(() => {
          this.sendLoading = false
          this.emailMsg = null
          messageBox('send success')
        }, res => {
          this.sendLoading = false
        })
      },
      down (ad) {
        console.log(ad)
        this.seeAd = ad
      },
      downFile (ad) {
        window.open(ad.ad_file)
      },
      layoutGo (count) {
        this.toRight = count
        let nextCount = this.layoutListShowCount + count
        if (nextCount < 0) {
          nextCount = this.layoutList.length - 1
        }
        if (nextCount > (this.layoutList.length - 1)) {
          nextCount = 0
        }
        this.layoutListShowCount = nextCount
      },
      adGo (count) {
        this.toRight = count
        let nextCount = this.adListShowCount + count
        if (nextCount < 0) {
          nextCount = this.adsList.length - 1
        }
        if (nextCount > (this.adsList.length - 1)) {
          nextCount = 0
        }
        this.adListShowCount = nextCount
      },
      queryEditLayout (tab) {
        if (!tab) {
          this.tab3Choose = 1
        }
        getData(xhrUrls.SEARCH_LAYOUT_LIST, {
          page: 1,
          pageSize: 1000,
          product: this.selectValue,
          l_size: this.selectList2
        }).then(res => {
          if (res.data.code === 200) {
            this.layoutList = res.data.data.pageInfo.rows
          }
        })
      },
      queryAdLayout (tab) {
        if (!tab) {
          this.tab3Choose = 2
        }
        getData(xhrUrls.SEARCH_ADS_LIST, {
          page: 1,
          pageSize: 1000,
          product: this.selectValue,
          g_size: this.selectList2
        }).then(res => {
          if (res.data.code === 200) {
            this.adsList = res.data.data.pageInfo.rows
          }
        })
      },
      initProduct () {
        Promise.all([getData(xhrUrls.SEARCH_PRODUCT_LIST, {
          page: 0,
          pageSize: 1000
        }), getData(xhrUrls.SEARCH_MATERIAL_LIST, {
          page: 0,
          pageSize: 1000
        }), getData(xhrUrls.SEARCH_SIZE_LIST, {
          page: 0,
          pageSize: 1000
        })]).then(([product, material, size]) => {
          this.productList = product.data.data.pageInfo.rows
          this.materialList = material.data.data.pageInfo.rows
          this.sizeList = size.data.data.pageInfo.rows
          this.editInit()
        })
      },
      getInfo () {
        if (this.selectValue !== '0' && this.selectSize && this.selectList) {
          getData(xhrUrls.SEARCH_REGULATIONS_INFO, {
            product: this.selectValue,
            material: this.selectSize,
            p_size: this.selectList,
            menu: this.menuId
          }).then(res => {
            if (res.data.data.productRegulations) {
              this.treeData2 = JSON.parse(res.data.data.productRegulations.content)
            } else {
              this.treeData2 = null
            }
          }, res => {
            console.log(res)
          })
        }
      }
    },
    watch: {
      selectSize2 (value) {
        if (value !== '0') {
          this.selectList2 = '0'
        }
      },
      selectList2 (value) {
        if (value !== '0') {
          this.queryEditLayout(true)
          this.queryAdLayout(true)
        }
      },
      selectValue (value) {
        if (value !== '0') {
          getData(xhrUrls.SEARCH_INFORMATION_INFO, {
            product: value
          }).then(res => {
            if (res.data.data.productInformation) {
              this.treeData = JSON.parse(res.data.data.productInformation.content)
            } else {
              this.treeData = []
            }
          }, res => {
            console.log(res)
          })
          if (this.selectList2 !== '0') {
            this.queryEditLayout(true)
            this.queryAdLayout(true)
          }
          this.getInfo()
          if (this.showPage === 3 && this.tab3 === 3 && !this.$refs.temp.isCreate) {
            messageBox.confirm('Save the file before creating new?', {
              confirmButtonText: 'Save',
              cancelButtonText: 'Do Not Save'
            }).then(() => {
              this.$refs.temp.noSubSave()
            }, () => {
              this.tab3 = 1
            })
          } else {
            this.tab3 = 1
          }
        }
      },
      selectSize (value) {
//        for (let one of this.sizeList) {
//          if (one.p_id === value) {
//            this.selectList = one.id
//            break
//          }
//        }
        this.selectList = 0
        this.getInfo()
      },
      selectList () {
        this.getInfo()
      }
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss" type="text/scss">
  .main_window {
    color: #fff;
    padding: 0 20px 20px;
    font-size: 20px;
  }

  .main_line {
    text-align: center;
    margin-top: 20px;
    border: 1px solid #fff;
    border-left: none;
    border-right: none;

    .col-xs-4 {
      margin: 8px 0;
      cursor: pointer;
    }

    .row_tab + .row_tab {
      border-left: 1px solid #fff;
    }

    .tab3 + .tab3 {
      border-left: 3px solid #000;
    }

    .tab3 {
      background: #ffa340;
      color: #000;
    }

    .tab3_active {
      background: #fff;
    }

    .active {
      color: #ffa340;
    }

  }

  .informaiton_list {
    text-align: left;

    .title_1 > div {
      color: #ffa340;
      font-size: 15px;
    }

    .title_1 > ul {
      padding-left: 20px;
    }

    .title_2 {
      margin-top: 10px;
    }

    .title_2 > ul {
      padding-left: 14px;
    }

    .content_text {
      font-size: 14px;
      color: #828282;
      margin-bottom: 10px;
    }

    .content_img {
      margin-top: 8px;
      margin-bottom: 20px;
    }

    .content_img img {
      width: 100%;
      height: 90px;
      float: left;
      margin-right: 5px;
      border: 1px solid #ffa340;
    }

    .title_2 {
      font-size: 15px;
      color: #fefefe;
    }

  }

  .tree_data_2 {
    font-size: 15px;

    label {
      font-size: 16px;
      color: #ffa340;
      margin-bottom: 0;
    }

    p, pre {
      color: #828282;
    }

    pre {
      white-space: pre-wrap;
      word-wrap: break-word;
      font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
      border: none;
    }

  }

  .content_img_detail {
    position: absolute;
    display: none;
    border: 1px #ffa340 solid;
    width: 500px;
    top: 0;
    left: 100px;
    padding: 20px;
    background: #161616;
    z-index: 100;
  }

  .content_img_detail img {
    width: 100% !important;
    height: inherit !important;
    margin-bottom: 20px !important;
  }

  .content_img_hover:hover .content_img_detail {
    display: block;
  }

  .yuan {
    font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
  }
</style>
