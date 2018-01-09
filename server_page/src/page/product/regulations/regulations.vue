<template>
  <div>
    <div class="box box-default">
      <div class="overlay" v-if="loading">
        <i class="fa fa-refresh fa-spin"></i>
      </div>
      <div class="box-body">
        <div class="form-horizontal row">
          <div class="col-xs-12 col-sm-8 col-md-4" style="min-width: 300px">
            <div class="form-group">
              <label class="control-label pull-left" style="margin-left: 30px;">Select Menu:</label>
              <div class="col-sm-6">
                <s-select :noSearch="true" v-model="menuId">
                  <option value="0">- Select Menu -</option>
                  <option value="71c1532212f211e790656c92bf3149c7">Promotion</option>
                  <option value="d6a394fe12f211e790656c92bf3149c7">Retail/POSM</option>
                </s-select>
              </div>
              <!--<label class="control-label pull-left" style="margin-left: 30px;">Select Product:</label>-->
              <!--<div class="col-sm-6">-->
              <!--<s-select :noSearch="true" v-model="productId">-->
              <!--<option value="0">- Select Product -</option>-->
              <!--<template v-for="pro of productList">-->
              <!--<option :value="pro.id">{{pro.name}}</option>-->
              <!--</template>-->
              <!--</s-select>-->
              <!--</div>-->
            </div>
          </div>
          <div class="col-xs-12 col-sm-8 col-md-4" style="min-width: 300px">
            <div class="form-group">
              <label class="control-label pull-left" style="margin-left: 30px;">Select Product:</label>
              <div class="col-sm-6">
                <s-select :noSearch="true" v-model="productId">
                  <option value="0">- Select Product -</option>
                  <template v-for="pro of productList">
                    <option :value="pro.id">{{pro.name}}</option>
                  </template>
                </s-select>
              </div>
            </div>
          </div>
          <div class="col-xs-12 col-sm-8 col-md-4" style="min-width: 300px">
            <div class="form-group">
              <label class="control-label pull-left" style="margin-left: 30px;">Select Material:</label>
              <div class="col-sm-6">
                <s-select :noSearch="true" v-model="materialId">
                  <option value="0">- Select Material -</option>
                  <template v-for="mat of materialList">
                    <option :value="mat.id" v-if="menuId == mat.p_id">{{mat.name}}</option>
                  </template>
                </s-select>
              </div>
            </div>
          </div>
          <div class="col-xs-12 col-sm-8 col-md-4" style="min-width: 300px">
            <div class="form-group">
              <label class="control-label pull-left" style="margin-left: 30px;">Select Size:</label>
              <div class="col-sm-6">
                <s-select :noSearch="true" v-model="sizeId">
                  <option value="0">- Select Size -</option>
                  <template v-for="size of sizeList">
                    <option :value="size.id" v-if="materialId == size.p_id">{{size.name}}</option>
                  </template>
                </s-select>
              </div>
            </div>
          </div>
        </div>
        <div v-if="treeData">
          <div class="row">
            <div class="col-xs-4">
              <div class="form-group">
                <label>Overall</label>
                <div class="progress sm" v-if="overall_loading && !treeData.overall">
                  <div class="progress-bar progress-bar-yellow" :style="{ width: overall_loading + '%' }"></div>
                </div>
                <img v-if="treeData.overall" style="width: 100%;" :src="baseUrl + treeData.overall"/>
                <br>
                <div type="submit" class="btn btn-info btn-flat">
                  <span style="position: relative;">
                    Upload Picture
                    <input type="file"
                           style="position: absolute; top: 0; left: 0; width: 100%;height: 100%; opacity: 0;"
                           @change="addFile('overall', arguments[0], 'overall_loading')">
                  </span>
                </div>
              </div>
            </div>
            <div class="col-xs-6">
              <div class="form-group">
                <label>Frame Size</label>
                <input type="text" class="form-control" v-model="treeData.frame">
              </div>
              <div class="form-group">
                <label>Quality Seal Size</label>
                <input type="text" class="form-control" v-model="treeData.quality">
              </div>
              <div class="form-group">
                <label>Log without tagline including protection area</label>
                <input type="text" class="form-control" v-model="treeData.log">
              </div>
              <div class="form-group">
                <label>Logo with tagline including protection area</label>
                <input type="text" class="form-control" v-model="treeData.logo">
              </div>
              <div class="form-group">
                <label>X-value</label>
                <input type="text" class="form-control" v-model="treeData.xValue">
              </div>
            </div>
          </div>
          <div class="row" style="margin-top: 20px;">
            <div class="col-xs-4">
              <div class="form-group">
                <label>Layout Principle</label>
                <div class="progress sm" v-if="layout_loading && !treeData.layout">
                  <div class="progress-bar progress-bar-yellow" :style="{ width: layout_loading + '%' }"></div>
                </div>
                <img v-if="treeData.layout" style="width: 100%;" :src="baseUrl + treeData.layout"/>
                <br>
                <div type="submit" class="btn btn-info btn-flat">
                  <span style="position: relative;">
                    Upload Picture
                    <input type="file"
                           style="position: absolute; top: 0; left: 0; width: 100%;height: 100%; opacity: 0;"
                           @change="addFile('layout', arguments[0], 'layout_loading')">
                  </span>
                </div>
              </div>
            </div>
            <div class="col-xs-6">
              <div class="form-group">
                <label>Visual Area</label>
                <textarea class="form-control" v-model="treeData.visual" style="height: 10rem;"></textarea>
              </div>
              <div class="form-group">
                <label>Communication Area</label>
                <textarea class="form-control" v-model="treeData.communication" style="height: 10rem;"></textarea>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-xs-8">
              <div class="form-group">
                <label>Tips</label>
                <textarea class="form-control" v-model="treeData.tips"></textarea>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="box-footer" v-if="productId != 0 && materialId != 0 && sizeId != 0">
        <a type="submit" class="btn btn-info btn-flat"
           @click="save()">
              <span>
                <i class="fa fa-save"></i>
                Save
              </span>
        </a>
      </div>
    </div>
  </div>
</template>
<script>
  import getData from '../../../vuex/api/indexApi'
  import xhrUrls from '../../../vuex/api/xhrUrls'
  import messageBox from '../../../components/msgbox'
  import { baseUrl } from '../../../config/config'
  export default {
    created () {
      this.initProduct()
    },
    methods: {
      uploadImg (file, fn, key) {
        let formData = new window.FormData()
        formData.append('imgFile', file, file.name)
        getData(xhrUrls.UPLOAD_IMG, formData, {
          progress: event => {
            console.log(event.loaded / event.total)
            this[key] = event.loaded / event.total * 100
          }
        }).then(res => {
          if (res.data.code === 200) {
            console.log(res)
            fn & fn(res.data.data.url)
          } else {
            messageBox.alert('Failed')
          }
        }, res => {
          console.log(res)
          messageBox.alert('Network Failure')
        })
      },
      addFile (key, event, loadingKey) {
        this.treeData[key] = ''
        this.uploadImg(event.target.files[0], (url) => {
          this.treeData[key] = url
        }, loadingKey)
      },
      save () {
        let xhr = this.isNewContent ? xhrUrls.ADD_REGULATIONS_INFO : xhrUrls.EDIT_REGULATIONS_INFO
        getData(xhr, {
          product: this.productId,
          material: this.materialId,
          size: this.sizeId,
          menu: this.menuId,
          content: JSON.stringify(this.treeData),
          id: this.editId
        }).then(res => {
          this.loading = false
          if (res.data.code === 200) {
            messageBox.alert('Success')
            console.log(res)
            if (this.isNewContent) {
              this.getInfo()
            }
          } else {
            messageBox.alert('Failed')
          }
        }, res => {
          console.log(res)
          messageBox.alert('Network Failure')
        })
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
      getInfo () {
        if (this.productId !== '0' && this.materialId !== '0' && this.sizeId !== '0') {
          this.loading = true
          getData(xhrUrls.SEARCH_REGULATIONS_INFO, {
            product: this.productId,
            material: this.materialId,
            menu: this.menuId,
            p_size: this.sizeId
          }).then(res => {
            this.loading = false
            if (res.data.data.productRegulations) {
              this.isNewContent = false
              this.editId = res.data.data.productRegulations.id
              this.treeData = JSON.parse(res.data.data.productRegulations.content)
            } else {
              this.editId = ''
              this.isNewContent = true
              this.treeData = {
                frame: '',
                quality: '',
                log: '',
                logo: '',
                xValue: '',
                visual: '',
                communication: '',
                tips: '',
                layout: '',
                overall: ''
              }
            }
          }, res => {
            this.loading = false
            console.log(res)
          })
        }
      }
    },
    watch: {
      menuId () {
        this.materialId = '0'
        this.treeData = null
      },
      materialId () {
        this.sizeId = '0'
        this.treeData = null
      },
      sizeId (value) {
        this.treeData = null
        if (value !== '0') {
          this.getInfo()
        }
      },
      productId (value) {
        this.treeData = null
        if (value !== '0' && this.sizeId !== '0') {
          this.getInfo()
        }
      }
    },
    data () {
      return {
        baseUrl,
        layout_loading: 0,
        overall_loading: 0,
        loading: true,
        isNewContent: false,
        editId: '',
        menuId: '0',
        productId: '0',
        materialId: '0',
        sizeId: '0',
        materialList: [],
        sizeList: [],
        productList: [],
        treeData: null
      }
    }
  }
</script>
<style>

  .product_btn > span {
    height: 40px;
    line-height: 40px;
    padding: 5px 20px;
    border: 2px dashed #ccc;
    cursor: pointer;
    margin-right: 20px;
  }

  .product_btn > span:hover {
    border: 2px solid #ccc;
  }

  .imageList img, .imageList span {
    display: block;
    width: 100px;
    float: left;
    margin-right: 20px;
  }

  .imageList span {
    border: 2px dashed #ccc;
  }
</style>