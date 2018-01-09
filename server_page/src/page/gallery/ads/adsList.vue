<template>
  <div>
    <div class="box box-default animated fadeInUp" v-if="nowPage === 'list'">
      <div class="box-body">
        <div class="form-horizontal row" @keyup.enter="searchAds({page: 1})">
          <div class="col-xs-12 col-sm-6 col-md-3 search">
            <div class="form-group">
              <label class="col-sm-4 control-label nowrap">Select Menu:</label>
              <div class="col-sm-8">
                <s-select :noSearch="true" v-model="listQuery.menu">
                  <option value="0">- Select Menu -</option>
                  <option value="71c1532212f211e790656c92bf3149c7">Promotion</option>
                  <option value="d6a394fe12f211e790656c92bf3149c7">Retail/POSM</option>
                </s-select>
              </div>
            </div>
          </div>
          <div class="col-xs-12 col-sm-6 col-md-3 search">
            <div class="form-group">
              <label class="col-sm-4 control-label nowrap">Select Product:</label>
              <div class="col-sm-8">
                <s-select v-model="listQuery.product" :noSearch="true">
                  <option value="0">- Select Product -</option>
                  <template v-for="pro of productList">
                    <option :value="pro.id">{{pro.name}}</option>
                  </template>
                </s-select>
              </div>
            </div>
          </div>
          <div class="col-xs-12 col-sm-6 col-md-3 search">
            <div class="form-group">
              <label class="col-sm-4 control-label nowrap">Select Material:</label>
              <div class="col-sm-8">
                <s-select v-model="listQuery.material" :noSearch="true">
                  <option value="0">- Select Material -</option>
                  <template v-for="mat of materialList">
                    <option :value="mat.id" v-if="listQuery.menu == mat.p_id">{{mat.name}}</option>
                  </template>
                </s-select>
              </div>
            </div>
          </div>
          <div class="col-xs-12 col-sm-6 col-md-3 search">
            <div class="form-group">
              <label class="col-sm-4 control-label nowrap">Select Size:</label>
              <div class="col-sm-8">
                <s-select v-model="listQuery.size" :noSearch="true">
                  <option value="0">- Select Size-</option>
                  <template v-for="size of sizeList">
                    <option :value="size.id" v-if="listQuery.material == size.p_id">{{size.name}}</option>
                  </template>
                </s-select>
              </div>
            </div>
          </div>
          <div class="col-xs-12 col-sm-6 col-md-3 search">
            <div class="form-group">
              <label class="col-sm-4 control-label nowrap">Ads Type:</label>
              <div class="col-sm-8">
                <s-select v-model="listQuery.ad_type" :noSearch="true">
                  <option value="0">- Select Type -</option>
                  <option value="AVI">AVI</option>
                  <option value="RM">RM</option>
                  <option value="MOV">MOV</option>
                  <option value="MP3">MP3</option>
                  <option value="PDF">PDF</option>
                  <option value="XLSX">XLSX</option>
                  <option value="DOCX">DOCX</option>
                  <option value="PPTX">PPTX</option>
                  <option value="MP4">MP4</option>
                  <option value="PSD">PSD</option>
                  <option value="AI">AI</option>
                  <option value="ZIP">ZIP</option>
                  <option value="JPG">JPG</option>
                  <option value="PNG">PNG</option>
                  <option value="GIF">GIF</option>
                  <option value="TIF">TIF</option>
                </s-select>
              </div>
            </div>
          </div>
          <div class="col-xs-12 col-sm-6 col-md-3 search">
            <div class="form-group">
              <label class="col-sm-4 control-label nowrap">DPI:</label>
              <div class="col-sm-8">
                <input type="text" class="form-control"/>
              </div>
            </div>
          </div>
          <div class="col-xs-12 col-sm-6 col-md-3 search">
            <div class="form-group">
              <label class="col-sm-4 control-label nowrap">Label:</label>
              <div class="col-sm-8">
                <input type="text" class="form-control"/>
              </div>
            </div>
          </div>
          <div class="col-xs-12" style="margin-bottom: 20px">
            <a class="btn btn-success btn-flat" @click="searchAds({page: 1})">
              <i class="fa fa-search"></i>
              Search
            </a>
            <a class="btn btn-default btn-flat" @click="openWindow('add')">
              <i class="fa fa-plus"></i>Add
            </a>
          </div>
        </div>
      </div>
      <div class="box-footer">
        <div class="row">
          <div class="col-xs-3">
            <div class="ad_list_li"
                 v-if="index % 4 === 0"
                 @click="clickAd(ad)"
                 v-for="(ad, index) of adsList">
              <img :src="baseUrl + ad.ad_previwe"
                   style="width: 100%;">
              <span class="ad_del" @click.stop="deleteAd(ad.id)">Delete</span>
            </div>
          </div>
          <div class="col-xs-3">
            <div class="ad_list_li"
                 v-if="index % 4 === 1"
                 @click="clickAd(ad)"
                 v-for="(ad, index) of adsList">
              <img :src="baseUrl + ad.ad_previwe"
                   style="width: 100%;">
              <span class="ad_del" @click.stop="deleteAd(ad.id)">Delete</span>
            </div>
          </div>
          <div class="col-xs-3">
            <div class="ad_list_li"
                 v-if="index % 4 === 2"
                 @click="clickAd(ad)"
                 v-for="(ad, index) of adsList">
              <img :src="baseUrl + ad.ad_previwe"
                   style="width: 100%;">
              <span class="ad_del" @click.stop="deleteAd(ad.id)">Delete</span>
            </div>
          </div>
          <div class="col-xs-3">
            <div class="ad_list_li"
                 v-if="index % 4 === 3"
                 @click="clickAd(ad)"
                 v-for="(ad, index) of adsList">
              <img :src="baseUrl + ad.ad_previwe"
                   style="width: 100%;">
              <span class="ad_del" @click.stop="deleteAd(ad.id)">Delete</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <a-window>
      <div v-if="nowPage === 'add'">
        <add @close="close()" @reload="searchAds()"></add>
      </div>
    </a-window>
    <a-window>
      <div v-if="nowPage === 'info'">
        <info @close="close()" :image="chooseImg" @edit="edit()"></info>
      </div>
    </a-window>
    <a-window>
      <div v-if="nowPage === 'edit'">
        <edit @close="close()" @reload="searchAds()" :image="chooseImg"></edit>
      </div>
    </a-window>
  </div>
</template>
<script>
  import add from './adsAdd.vue'
  import info from './adsInfo.vue'
  import edit from './adsEdit.vue'
  import getData from '../../../vuex/api/indexApi'
  import xhrUrls from '../../../vuex/api/xhrUrls'
  import messageBox from '../../../components/msgbox'
  import { baseUrl } from '../../../config/config'

  export default {
    components: {
      add,
      info,
      edit
    },
    created () {
      this.initProduct()
      this.searchAds()
    },
    data () {
      return {
        baseUrl,
        nowPage: 'list',
        chooseImg: null,
        listQuery: {
          menu: '0',
          product: '0',
          material: '0',
          size: '0',
          ad_type: '0',
          ad_format: '0'
        },
        adsList: [],
        productList: [],
        materialList: [],
        sizeList: []
      }
    },
    methods: {
      deleteAd (id) {
        messageBox.confirm('isDelete?').then(() => {
          getData(xhrUrls.DELETE_ADS_INFO, {
            id
          }).then(res => {
            if (res.data.code === 200) {
              messageBox.alert('Success')
              this.searchAds()
            } else {
              messageBox.alert('Failed')
            }
          }, res => {
            messageBox.alert('Network Failure')
          })
        }, () => {
        })
      },
      clickAd (img) {
        for (let product of this.productList) {
          if (img.product === product.id) {
            img.productStr = product.name
          }
        }
        for (let material of this.materialList) {
          if (img.material === material.id) {
            img.materialStr = material.name
          }
        }
        for (let size of this.sizeList) {
          if (img.size === size.id) {
            img.sizeStr = size.name
          }
        }
        this.chooseImg = img
        this.openWindow('info')
        console.log(img)
      },
      edit () {
        console.log('123123')
        this.openWindow('edit')
      },
      initProduct () {
        this.loading = true
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
          this.loading = false
        })
      },
      close () {
        this.nowPage = 'list'
      },
      openWindow (key) {
        this.nowPage = key
      },
      searchAds ({ page = 1, count = 1000 } = {}) {
        getData(xhrUrls.SEARCH_ADS_LIST, {
          ...this.listQuery,
          page: parseInt(page),
          pageSize: parseInt(count),
          product: this.listQuery.product.length === 1 ? '' : this.listQuery.product,
          material: this.listQuery.material.length === 1 ? '' : this.listQuery.material,
          size: this.listQuery.size.length === 1 ? '' : this.listQuery.size,
          ad_type: this.listQuery.ad_type.length === 1 ? '' : this.listQuery.ad_type,
          ad_format: this.listQuery.ad_format.length === 1 ? '' : this.listQuery.ad_format
        }).then(res => {
          if (res.data.code === 200) {
            if (parseInt(page) === 1) {
              this.adsList = res.data.data.pageInfo.rows
            } else {
              this.adsList.push(...res.data.data.pageInfo.rows)
            }
          }
          console.log(res)
        }, res => {
          console.log(res)
        })
      }
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss">
  .ad_list_li {
    border: 1px solid #ccc;
    padding: 10px;
    margin-bottom: 10px;
    cursor: pointer;
    position: relative;

  .ad_del {
    display: none;
    background: rgba(0, 0, 0, 0.5);
    color: #fff;
    padding: 5px 10px;
    position: absolute;
    right: 2px;
    top: 2px;
  }

  }

  .ad_list_li:hover .ad_del {
    display: block;
  }
</style>