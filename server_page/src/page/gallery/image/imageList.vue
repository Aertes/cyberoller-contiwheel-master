<template>
  <div>
    <div class="row  animated fadeInUp" v-if="nowPage === 'list'">
      <div class="col-md-3 col-sm-12 col-xs-12">
        <div class="box box-default" style="max-height: 750px; min-height: 300px; overflow-y: auto; ">
          <div class="overlay" v-if="loading">
            <i class="fa fa-refresh fa-spin"></i>
          </div>
          <div class="box-body">
            <s-tree :data="tree"
                    v-model="treeView"
                    title="lib"
                    treeId="id"
                    name="name"></s-tree>
          </div>
        </div>
      </div>
      <div class=" col-md-9 col-sm-12 col-xs-12">
        <div class="box box-default">
          <div class="box-body">
            <div class="form-horizontal row" @keyup.enter="searchImage({page: 1})">
              <!--<div class="col-xs-12 col-sm-6 col-md-3 search">-->
              <!--<div class="form-group">-->
              <!--<label class="col-sm-4 control-label nowrap">Select Product:</label>-->
              <!--<div class="col-sm-8">-->
              <!--<s-select v-model="listQuery.product" :noSearch="true">-->
              <!--<option value="0">- Select Product -</option>-->
              <!--<template v-for="pro of productList">-->
              <!--<option :value="pro.id">{{pro.name}}</option>-->
              <!--</template>-->
              <!--</s-select>-->
              <!--</div>-->
              <!--</div>-->
              <!--</div>-->
              <!--search-->
              <!--<div class="col-xs-12 col-sm-6 col-md-3 search">-->
              <!--<div class="form-group">-->
              <!--<label class="col-sm-4 control-label nowrap">Image Type:</label>-->
              <!--<div class="col-sm-8">-->
              <!--<s-select v-model="listQuery.img_type" :noSearch="true">-->
              <!--<option value="0">全部</option>-->
              <!--<option value="Product Image">Product Image</option>-->
              <!--<option value="Surroundings">Surroundings</option>-->
              <!--</s-select>-->
              <!--</div>-->
              <!--</div>-->
              <!--</div>-->
              <!--<div class="col-xs-12 col-sm-6 col-md-3 search" style="height: 49px;">-->
              <!--<div class="form-group">-->
              <!--<label class="col-sm-1 control-label nowrap">-->
              <!--<s-checkbox type="checkbox" v-model="imgType1"></s-checkbox>-->
              <!--</label>-->
              <!--<label class="col-sm-4 control-label nowrap">Product Image</label>-->
              <!--<label class="col-sm-1 control-label nowrap">-->
              <!--<s-checkbox type="checkbox" v-model="imgType2"></s-checkbox>-->
              <!--</label>-->
              <!--<label class="col-sm-4 control-label nowrap">Surroundings</label>-->
              <!--</div>-->
              <!--</div>-->
              <!--<div class="col-xs-12 col-sm-6 col-md-3 search">-->
              <!--<div class="form-group">-->
              <!--<label class="col-sm-4 control-label nowrap">Format:</label>-->
              <!--<div class="col-sm-8">-->
              <!--&lt;!&ndash;<s-select v-model="listQuery.img_format" :noSearch="true">&ndash;&gt;-->
              <!--<s-select v-model="img_format" :noSearch="true">-->
              <!--<option value="0">- Select Format -</option>-->
              <!--<option value="JPG">JPG</option>-->
              <!--<option value="PNG">PNG</option>-->
              <!--<option value="GIF">GIF</option>-->
              <!--<option value="TIF">TIF</option>-->
              <!--</s-select>-->
              <!--</div>-->
              <!--</div>-->
              <!--</div>-->
              <!--<div class="col-xs-12 col-sm-6 col-md-3 search">-->
              <!--<div class="form-group">-->
              <!--<label class="col-sm-4 control-label nowrap">Type:</label>-->
              <!--<div class="col-sm-8" style="position: relative;">-->
              <!--&lt;!&ndash;<s-select v-model="listQuery.img_format" :noSearch="true">&ndash;&gt;-->
              <!--<input type="text" class="form-control"-->
              <!--@focus="treeShow = true"-->
              <!--v-model="type_name"-->
              <!--@blur="blur()">-->
              <!--<div-->
              <!--style="z-index: 100;position: absolute; top: 35px; left: 0; width: 100%; max-height: 300px; overflow-y: scroll;margin: 0 15px; background: #fff;">-->
              <!--<s-tree :data="tree"-->
              <!--v-show="treeShow"-->
              <!--v-model="treeView"-->
              <!--treeId="id"-->
              <!--title="type"-->
              <!--name="name"></s-tree>-->
              <!--</div>-->
              <!--</div>-->
              <!--</div>-->
              <!--</div>-->
              <div class="col-xs-12" style="margin-bottom: 20px">
                <div class="col-xs-12 col-sm-6 col-md-3 search">
                  <div class="form-group">
                    <label class="col-sm-4 control-label nowrap">Search:</label>
                    <div class="col-sm-8">
                      <input type="text" class="form-control"
                             v-model="listQuery.keyWord">
                    </div>
                  </div>
                </div>
                <a class="btn btn-success btn-flat" @click="searchImage({page: 1})">
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
                <div class="image_list_li"
                     @click="clickImg(img)"
                     v-if="index % 4 === 0"
                     v-for="(img, index) of imageList">
                  <img :src="baseUrl + (img.img_previwe || img.img_url)"
                       style="width: 100%;">
                  <span class="image_del" @click.stop="deleteImg(img.id)">Delete</span>
                </div>
              </div>
              <div class="col-xs-3">
                <div class="image_list_li"
                     @click="clickImg(img)"
                     v-if="index % 4 === 1"
                     v-for="(img, index) of imageList">
                  <img :src="baseUrl + (img.img_previwe || img.img_url)"
                       style="width: 100%;">
                  <span class="image_del" @click.stop="deleteImg(img.id)">Delete</span>
                </div>
              </div>
              <div class="col-xs-3">
                <div class="image_list_li"
                     @click="clickImg(img)"
                     v-if="index % 4 === 2"
                     v-for="(img, index) of imageList">
                  <img :src="baseUrl + (img.img_previwe || img.img_url)"
                       style="width: 100%;">
                  <span class="image_del" @click.stop="deleteImg(img.id)">Delete</span>
                </div>
              </div>
              <div class="col-xs-3">
                <div class="image_list_li"
                     @click="clickImg(img)"
                     v-if="index % 4 === 3"
                     v-for="(img, index) of imageList">
                  <img :src="baseUrl + (img.img_previwe || img.img_url)"
                       style="width: 100%;">
                  <span class="image_del" @click.stop="deleteImg(img.id)">Delete</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <a-window>
      <div v-if="nowPage === 'add'">
        <add @close="close()" @reload="searchImage()" :fileName="fileName" :tree="tree" :nowId="listQuery.category"
             :nowName="type_name"></add>
      </div>
    </a-window>
    <a-window>
      <div v-if="nowPage === 'info'">
        <info @close="close()" :image="chooseImg" @edit="edit()" :set="set"></info>
      </div>
    </a-window>
    <a-window>
      <div v-if="nowPage === 'edit'">
        <edit @close="close()" @reload="searchImage()" :fileName="fileName" :image="chooseImg" :tree="tree"
              :set="set"></edit>
      </div>
    </a-window>
  </div>
</template>
<script>
  import add from './imageAdd.vue'
  import info from './imageInfo.vue'
  import edit from './imageEdit.vue'
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
      this.fileName = ['Document', 'Images', 'Video'][this.$route.params.id]
//      this.searchImage()
      this.getType()
    },
    data () {
      return {
        baseUrl,
        imgType1: false,
        imgType2: false,
        img_format: '0',
        nowPage: 'list',
        treeAll: null,
        chooseImg: null,
        listQuery: {
          product: '0',
          material: '0',
          size: '0',
          img_type: '0',
          img_format: '0',
          category: '',
          listQuery: ''
        },
        set: {},
        tree: [],
        type_name: '',
        treeView: {},
        treeShow: false,
        imageList: [],
        productList: [],
        materialList: [],
        sizeList: [],
        fileName: ''
      }
    },
    methods: {
      blur () {
        setTimeout(() => {
          this.treeShow = false
        }, 100)
      },
      deleteImg (id) {
        messageBox.confirm('isDelete?').then(() => {
          getData(xhrUrls.DELETE_IMAGE_INFO, {
            id
          }).then(res => {
            if (res.data.code === 200) {
              messageBox.alert('Success')
              this.searchImage()
            } else {
              messageBox.alert('Failed')
            }
          }, res => {
            messageBox.alert('Network Failure')
          })
        }, () => {
        })
      },
      getType () {
        getData(xhrUrls.SEARCH_IMAGE_TYPE).then(res => {
          if (res.data.code === 200) {
            let map = {}
            let tree = []
            let data = res.data.data.lableDisc
            for (let key of data) {
              map[key.id] = key
              key.child = []
            }
            this.set = map
            for (let key of data) {
              if (key.parent_id === '-1') {
                tree.push(key)
              } else {
                map[key.parent_id].child.push(key)
              }
            }
            this.treeAll = tree
            this.tree = [tree[this.$route.params.id]]
          }
        }, res => {
          console.log(res)
        })
      },
      clickImg (img) {
        for (let product of this.productList) {
          if (img.product === product.id) {
            img.productStr = product.name
          }
        }
        this.chooseImg = img
        this.openWindow('info')
        console.log(img)
      },
      edit () {
        this.openWindow('edit')
      },
      initProduct () {
//        this.loading = true
//        Promise.all([getData(xhrUrls.SEARCH_PRODUCT_LIST, {
//          page: 0,
//          pageSize: 1000
//        }), getData(xhrUrls.SEARCH_MATERIAL_LIST, {
//          page: 0,
//          pageSize: 1000
//        }), getData(xhrUrls.SEARCH_SIZE_LIST, {
//          page: 0,
//          pageSize: 1000
//        })]).then(([product, material, size]) => {
//          this.productList = product.data.data.pageInfo.rows
//          this.materialList = material.data.data.pageInfo.rows
//          this.sizeList = size.data.data.pageInfo.rows
//          this.loading = false
//        })
      },
      close () {
        this.nowPage = 'list'
      },
      openWindow (key) {
        this.nowPage = key
      },
      searchImage ({ page = 1, count = 10000 } = {}) {
        let imgType
        if (this.imgType1 === this.imgType2) {
          imgType = ''
        } else {
          imgType = this.imgType1 ? 'Product Image' : 'Surroundings'
        }
        getData(xhrUrls.SEARCH_IMAGE_LIST, {
          ...this.listQuery,
          page: parseInt(page),
          pageSize: parseInt(count),
          product: this.listQuery.product.length === 1 ? '' : this.listQuery.product,
          material: this.listQuery.material.length === 1 ? '' : this.listQuery.material,
          size: this.listQuery.size.length === 1 ? '' : this.listQuery.size,
//          img_type: this.listQuery.img_type.length === 1 ? '' : this.listQuery.img_type,
          img_type: imgType,
          img_format: this.listQuery.img_format.length === 1 ? '' : this.listQuery.img_format
        }).then(res => {
          if (parseInt(page) === 1) {
            this.imageList = res.data.data.pageInfo.rows
          } else {
            this.imageList.push(...res.data.data.pageInfo.rows)
          }
          console.log(res)
        }, res => {
          console.log(res)
        })
      }
    },
    watch: {
      treeView (value) {
        console.log(value)
        this.listQuery.category = value.id
        this.type_name = value.name
        this.searchImage()
      },
      $route () {
        this.tree = [this.treeAll[this.$route.params.id]]
        this.imageList = []
        this.fileName = ['Document', 'Images', 'Video'][this.$route.params.id]
        this.close()
      }
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss">
  .image_list_li {
    border: 1px solid #ccc;
    padding: 10px;
    margin-bottom: 10px;
    cursor: pointer;
    position: relative;

  .image_del {
    display: none;
    background: rgba(0, 0, 0, 0.5);
    color: #fff;
    padding: 5px 10px;
    position: absolute;
    right: 2px;
    top: 2px;
  }

  }

  .image_list_li:hover .image_del {
    display: block;
  }
</style>
