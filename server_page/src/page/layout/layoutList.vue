<template>
  <div>
    <div class="box box-default animated fadeInUp" v-if="nowPage === 'list'">
      <div class="box-body">
        <div class="form-horizontal row" @keyup.enter="searchLayout({page: 1})">
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
          <div class="col-xs-12" style="margin-bottom: 20px">
            <a class="btn btn-success btn-flat" @click="searchLayout({page: 1})">
              <i class="fa fa-search"></i>
              Search
            </a>
            <a class="btn btn-default btn-flat" @click="chooseAdd()">
              <!--openWindow('add')-->
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
                 @click="go(layout.id)"
                 v-for="(layout, index) of layoutList">
              <create :data="JSON.parse(layout.html_path)" :bg="layout.view_png"></create>
              <!--<span class="ad_del" @click.stop="deleteAd(ad.id)">Delete</span>-->
            </div>
          </div>
          <div class="col-xs-3">
            <div class="ad_list_li"
                 v-if="index % 4 === 1"
                 @click="go(layout.id)"
                 v-for="(layout, index) of layoutList">
              <create :data="JSON.parse(layout.html_path)" :bg="layout.view_png"></create>
              <!--<span class="ad_del" @click.stop="deleteAd(ad.id)">Delete</span>-->
            </div>
          </div>
          <div class="col-xs-3">
            <div class="ad_list_li"
                 v-if="index % 4 === 2"
                 @click="go(layout.id)"
                 v-for="(layout, index) of layoutList">
              <create :data="JSON.parse(layout.html_path)" :bg="layout.view_png"></create>
              <!--<span class="ad_del" @click.stop="deleteAd(ad.id)">Delete</span>-->
            </div>
          </div>
          <div class="col-xs-3">
            <div class="ad_list_li"
                 v-if="index % 4 === 3"
                 @click="go(layout.id)"
                 v-for="(layout, index) of layoutList">
              <create :data="JSON.parse(layout.html_path)" :bg="layout.view_png"></create>
              <!--<span class="ad_del" @click.stop="deleteAd(ad.id)">Delete</span>-->
            </div>
          </div>
        </div>
      </div>
    </div>
    <a-window>
      <div v-if="nowPage === 'detail'">
        <detail :productList="productList" :materialList="materialList" :sizeList="sizeList"
                @close="close()" @edit="edit()" :id="chooseId"></detail>
      </div>
    </a-window>
    <a-window>
      <div v-if="nowPage === 'add'">
        <add @close="close()" @reload="searchLayout()"></add>
      </div>
    </a-window>
    <a-window>
      <div v-if="nowPage === 'edit'">
        <edit @close="close()" :id="chooseId" @reload="searchLayout()"></edit>
      </div>
    </a-window>
  </div>
</template>
<script>
  import create from './create.vue'
  import add from './addLayout.vue'
  import edit from './editLayout.vue'
  import getData from '../../vuex/api/indexApi'
  import xhrUrls from '../../vuex/api/xhrUrls'
  import detail from './detail.vue'
  //  import messageBox from '../../components/msgbox'

  export default {
    components: { create, detail, add, edit },
    created () {
      this.initProduct()
      this.searchLayout()
    },
    data () {
      return {
        nowPage: 'list',
        chooseImg: null,
        chooseId: '',
        listQuery: {
          product: '0',
          material: '0',
          size: '0',
          menu: '0'
        },
        layoutList: [],
        productList: [],
        materialList: [],
        sizeList: []
      }
    },
    methods: {
      go (id) {
        this.chooseId = id
        this.nowPage = 'detail'
      },
      close () {
        this.nowPage = 'list'
      },
      edit () {
        this.nowPage = 'edit'
      },
      chooseAdd () {
        this.nowPage = 'add'
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
      searchLayout ({ page = 1, count = 1000 } = {}) {
        getData(xhrUrls.SEARCH_LAYOUT_LIST, {
          ...this.listQuery,
          page: parseInt(page),
          pageSize: parseInt(count),
          product: this.listQuery.product.length === 1 ? '' : this.listQuery.product,
          material: this.listQuery.material.length === 1 ? '' : this.listQuery.material,
          menu: this.listQuery.menu.length === 1 ? '' : this.listQuery.menu,
          l_size: this.listQuery.size.length === 1 ? '' : this.listQuery.size
        }).then(res => {
          if (res.data.code === 200) {
            this.layoutList = res.data.data.pageInfo.rows
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