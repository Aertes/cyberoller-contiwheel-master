<template>
  <div class="box box-default">
    <div class="overlay" v-if="loading">
      <i class="fa fa-refresh fa-spin"></i>
      <div class="progress sm" v-if="fileLoading && fileLoading != 100">
        <div class="progress-bar progress-bar-yellow" :style="{ width: fileLoading + '%' }"></div>
      </div>
    </div>
    <div class="box-header with-border">
      <h3 class="box-title">Upload Layout</h3>
      <div class="box-tools pull-right">
        <a type="button" class="btn btn-box-tool"
           @click="closeInfo()">
          <i class="fa fa-times"></i>
        </a>
      </div>
    </div>
    <div class="box-body">
      <div class="form-horizontal row">
        <div class="col-xs-12 col-sm-8 col-md-6" style="min-width: 300px">
          <div class="form-group">
            <label class="col-sm-6 control-label">Menu:</label>
            <div class="col-sm-6">
              <s-select :noSearch="true" v-model="form.menu">
                <option value="71c1532212f211e790656c92bf3149c7">Promotion</option>
                <option value="d6a394fe12f211e790656c92bf3149c7">Retail/POSM</option>
              </s-select>
            </div>
          </div>
        </div>
      </div>
      <div class="form-horizontal row">
        <div class="col-xs-12 col-sm-8 col-md-6" style="min-width: 300px">
          <div class="form-group">
            <label class="col-sm-6 control-label">Product:</label>
            <div class="col-sm-6">
              <s-select :noSearch="true" v-model="form.product">
                <template v-for="pro of productList">
                  <option :value="pro.id">{{pro.name}}</option>
                </template>
              </s-select>
            </div>
          </div>
        </div>
      </div>
      <div class="form-horizontal row">
        <div class="col-xs-12 col-sm-8 col-md-6" style="min-width: 300px">
          <div class="form-group">
            <label class="col-sm-6 control-label">Material</label>
            <div class="col-sm-6">
              <s-select :noSearch="true" v-model="form.material">
                <template v-for="mat of materialList">
                  <option :value="mat.id" v-if="form.menu == mat.p_id">{{mat.name}}</option>
                </template>
              </s-select>
            </div>
          </div>
        </div>
      </div>
      <div class="form-horizontal row">
        <div class="col-xs-12 col-sm-8 col-md-6" style="min-width: 300px">
          <div class="form-group">
            <label class="col-sm-6 control-label">Size</label>
            <div class="col-sm-6">
              <s-select :noSearch="true" v-model="form.size">
                <template v-for="size of sizeList">
                  <option :value="size.id" v-if="form.material == size.p_id">{{size.name}}</option>
                </template>
              </s-select>
            </div>
          </div>
        </div>
      </div>
      <div class="form-horizontal row">
        <div class="col-xs-12 col-sm-8 col-md-6" style="min-width: 300px">
          <div class="form-group">
            <label class="col-sm-6 control-label">File:</label>
            <div class="col-sm-6">
             <span
               style="display: inline-block; vertical-align: bottom; line-height: 30px; width: 100px; text-align: center; border: 1px #ccc dashed;position: relative;">
            Upload
            <input type="file"
                   style="position: absolute; top: 0; left: 0; width: 100%;height: 100%; opacity: 0;"
                   @change="addFile('ad_file', arguments[0])">
          </span>
            </div>
          </div>
        </div>
      </div>

      <div class="row" v-if="inJson">
        <div class="col-xs-4" style="overflow: hidden;">
          <div style="text-align: center;">
            <i class="fa fa-eye" style="font-size: 20px; color: rgb(255, 161, 63); cursor: pointer;"
               @click="isShowBg = false" v-if="isShowBg"></i>
            <i class="fa fa-eye" style="font-size: 20px; color: #ccc; cursor: pointer;" v-if="!isShowBg"
               @click="isShowBg = true"></i>
          </div>
          <create width="200" :data="inJson.anchorList" :bg="isShowBg ? layout_url : ''"></create>
        </div>
        <div class="col-xs-8">
          <div class="row">
            <div class="col-xs-3" style="line-height: 34px;margin: 5px 0;">
              Adaptable?
            </div>
            <div class="col-xs-3" style="line-height: 34px;margin: 5px 0;">
              Block Name
            </div>
            <div class="col-xs-3" style="line-height: 34px;margin: 5px 0;">
              Area Type
            </div>
          </div>
          <template v-for="page of inJson.anchorList">
            <template v-for="key of page.rectangle">
              <div class="row" :style="{background: key.isHover ? '#ddd' : ''}">
                <div class="col-xs-3" style="line-height: 34px;margin: 5px 0;">
                  <s-checkbox type="checkbox" v-model="key.isCheck" @change="resetKey()"></s-checkbox>
                </div>
                <div class="col-xs-3" style="line-height: 34px;margin: 5px 0;">
                  <input :ref="key.links_self" type="text" class="form-control" readonly v-model="key.name">
                </div>
                <div class="col-xs-3" style="line-height: 34px;margin: 5px 0;">
                  Visual Area
                </div>
                <div class="col-xs-3" style="line-height: 34px;margin: 5px 0; position: relative;" v-if="key.isCheck">
                  <a type="submit" class="btn btn-info btn-flat"
                     @click="addImage(key)">
                    Add Image
                  </a>
                  <input type="file"
                         style="position: absolute; top: 0; left: 0; width: 100%;height: 100%; opacity: 0;"
                         @change="addFileImg(key.img_url, arguments[0])">
                </div>
              </div>
              <div style="max-height: 100px; overflow-y: auto; overflow-x: hidden;" v-if="key.isCheck">
                <div class="row">
                  <div class="col-xs-3 layout_img" style="position: relative;">
                    <div v-if="index % 4 == 0" v-for="(img, index) of key.img_url">
                      <img :src="baseUrl + img" style="width: 100%">
                      <i class="fa fa-close" @click="deleteImg(index, key.img_url)"></i>
                    </div>
                  </div>
                  <div class="col-xs-3 layout_img" style="position: relative;">
                    <div v-if="index % 4 == 1" v-for="(img, index) of key.img_url">
                      <img :src="baseUrl + img" style="width: 100%">
                      <i class="fa fa-close" @click="deleteImg(index, key.img_url)"></i>
                    </div>
                  </div>
                  <div class="col-xs-3 layout_img" style="position: relative;">
                    <div v-if="index % 4 == 2" v-for="(img, index) of key.img_url">
                      <img :src="baseUrl + img" style="width: 100%">
                      <i class="fa fa-close" @click="deleteImg(index, key.img_url)"></i>
                    </div>
                  </div>
                  <div class="col-xs-3 layout_img" style="position: relative;">
                    <div v-if="index % 4 == 3" v-for="(img, index) of key.img_url">
                      <img :src="baseUrl + img" style="width: 100%">
                      <i class="fa fa-close" @click="deleteImg(index, key.img_url)"></i>
                    </div>
                  </div>
                </div>
              </div>
            </template>
            <template v-for="key of page.textFrame">
              <div class="row" :style="{background: key.isHover ? '#ddd' : ''}">
                <div class="col-xs-3" style="line-height: 34px;margin: 5px 0;">
                  <s-checkbox type="checkbox" v-model="key.isCheck" @change="resetKey()"></s-checkbox>
                </div>
                <div class="col-xs-3" style="line-height: 34px;margin: 5px 0;">
                  <input :ref="key.links_self" type="text" class="form-control" readonly v-model="key.name">
                </div>
                <div class="col-xs-3" style="line-height: 34px;margin: 5px 0;">
                  Text Area
                </div>
              </div>
            </template>
          </template>
        </div>
      </div>
    </div>
    <div class="box-footer">
      <a type="submit" class="btn btn-info btn-flat"
         @click="submit()">
              <span>
                <i class="fa fa-save"></i>
                Save
              </span>
      </a>
      <a type="submit" class="btn btn-default btn-flat pull-right"
         @click="close()">
        <i class="fa fa-mail-reply"></i>
        Back</a>
    </div>
  </div>
</template>
<script>
  import getData from '../../vuex/api/indexApi'
  import xhrUrls from '../../vuex/api/xhrUrls'
  import messageBox from '../../components/msgbox'
  import Abc from '../../helper/Abc'
  import create from './create.vue'
  import { baseUrl } from '../../config/config'
  export default {
    components: { create },
    created () {
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
    methods: {
      deleteImg (index, list) {
        list.splice(index, 1)
      },
      resetKey () {
        setTimeout(() => {
          if (!this.inJson) {
            return
          }
          let abc = new Abc()
          for (let page of this.inJson.anchorList) {
            for (let key of Object.keys(page.rectangle)) {
              let one = page.rectangle[key]
              one.name = ''
              if (one.isCheck) {
                one.name = abc.getA()
              }
            }
            for (let key of Object.keys(page.textFrame)) {
              let one = page.textFrame[key]
              one.name = ''
              if (one.isCheck) {
                one.name = abc.getA()
              }
            }
          }
        }, 50)
      },
      close () {
        this.$emit('close')
      },
      uploadIndd (file, fn) {
        this.loading = true
        let formData = new window.FormData()
        formData.append('file', file, file.name)
        getData(xhrUrls.UPLOAD_LAYOUT, formData, {
          progress: event => {
            this.fileLoading = event.loaded / event.total * 100
          }
        }).then(res => {
//        this.$http.get('/static/file.json').then(res => {
          if (res.data.code === 200) {
            this.layout_url = res.data.data.jpgUrl
            fn & fn(res.data.data)
          } else {
            messageBox.alert('Failed')
          }
          this.loading = false
        }, res => {
          console.log(res)
          messageBox.alert('Network Failure')
          this.loading = false
        })
      },
      uploadImg (file, fn) {
        this.fileLoading = 0
        this.loading = true
        let formData = new window.FormData()
        formData.append('imgFile', file, file.name)
        getData(xhrUrls.UPLOAD_IMG, formData, {
          progress: event => {
            this.fileLoading = event.loaded / event.total * 100
          }
        }).then(res => {
          if (res.data.code === 200) {
            console.log(res)
            fn & fn(res.data.data.url)
          } else {
            messageBox.alert('Failed')
          }
          this.loading = false
        }, res => {
          console.log(res)
          messageBox.alert('Network Failure')
          this.loading = false
        })
      },
      addFileImg (list, event) {
        this.uploadImg(event.target.files[0], (url) => {
          list.push(url)
        })
      },
      addFile (key, event) {
        this.uploadIndd(event.target.files[0], data => {
          let inJson = data
          for (let page of inJson.anchorList) {
            for (let key of Object.keys(page.rectangle)) {
              page.rectangle[key].isCheck = false
              page.rectangle[key].name = ''
              page.rectangle[key].img_url = []
              page.rectangle[key].isHover = false
              page.rectangle[key].click = key => {
                this.$refs[key][0].focus()
              }
            }
            for (let key of Object.keys(page.textFrame)) {
              page.textFrame[key].isCheck = false
              page.textFrame[key].name = ''
              page.textFrame[key].isHover = false
              page.textFrame[key].click = key => {
                this.$refs[key][0].focus()
              }
            }
          }
          this.inJson = inJson
        })
      },
      closeInfo () {
        this.$emit('close')
      },
      submit () {
        this.loading = true
        let defineAreas = []
        for (let page of this.inJson.anchorList) {
          for (let key of Object.keys(page.rectangle)) {
            let obj = {
              block_name: page.rectangle[key].name,
              self: key,
              adaptable: page.rectangle[key].isCheck ? 1 : 0,
              links_self: page.rectangle[key].links_self,
              img_url: page.rectangle[key].img_url,
              area_type: 'Visual Area',
              itemTransform: page.rectangle[key].imageItemTransform
            }
            defineAreas.push(obj)
          }
          for (let key of Object.keys(page.textFrame)) {
            let obj = {
              block_name: page.textFrame[key].name,
              self: key,
              adaptable: page.textFrame[key].isCheck ? 1 : 0,
              links_self: page.textFrame[key].links_self,
              area_type: 'Text Area',
              text_count: page.textFrame[key].text_count,
              font_size: page.textFrame[key].font_size
            }
            defineAreas.push(obj)
          }
        }
        let query = {
          ...this.form,
          id: this.inJson.id,
          defineAreas: JSON.stringify(defineAreas)
        }
        console.log(query)
        getData(xhrUrls.ADD_LAYOUT_INFO, query).then(res => {
          this.$emit('reload')
          this.loading = true
          this.close()
          console.log(res)
        })
      }
    },
    computed: {},
    data () {
      return {
        baseUrl,
        fileLoading: 0,
        isShowBg: false,
        layout_url: '',
        productList: [],
        materialList: [],
        sizeList: [],
        inJson: null,
        loading: false,
        checkShow: false,
        form: {
          product: '',
          material: '',
          size: '',
          menu: ''
        }
      }
    }
  }
</script>