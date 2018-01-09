<template>
  <div class="box box-default">
    <div class="overlay" v-if="loading">
      <i class="fa fa-refresh fa-spin"></i>
    </div>
    <div class="box-header with-border">
      <h3 class="box-title">Upload Ads</h3>
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
            <label class="col-sm-6 control-label">AD Format:</label>
            <div class="col-sm-6">
              <s-select :noSearch="true" v-model="form.ad_format">
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
      </div>
      <div class="form-horizontal row">
        <div class="col-xs-12 col-sm-8 col-md-6" style="min-width: 300px">
          <div class="form-group">
            <label class="col-sm-6 control-label">Related Product:</label>
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
            <label class="col-sm-6 control-label"></label>
            <div class="col-sm-6">
              <s-select :noSearch="true" v-model="form.material">
                <template v-for="mat of materialList">
                  <option :value="mat.id">{{mat.name}}</option>
                </template>
              </s-select>
            </div>
          </div>
        </div>
      </div>
      <div class="form-horizontal row">
        <div class="col-xs-12 col-sm-8 col-md-6" style="min-width: 300px">
          <div class="form-group">
            <label class="col-sm-6 control-label"></label>
            <div class="col-sm-6">
              <s-select :noSearch="true" v-model="form.size">
                <template v-for="size of sizeList">
                  <option :value="size.id">{{size.name}}</option>
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
              <div class="progress sm" v-if="img_url_loading && !form.ad_file">
                <div class="progress-bar progress-bar-yellow" :style="{ width: img_url_loading + '%' }"></div>
              </div>
              {{form.ad_file ? '上传成功' : ''}}
            </div>
          </div>
        </div>
        <div class="col-xs-12 col-sm-4 col-md-6" style="padding: 1px;">
          <span
            style="display: inline-block; vertical-align: bottom; line-height: 30px; width: 100px; text-align: center; border: 1px #ccc dashed;position: relative; margin-left: 50px;">
            Upload
            <input type="file"
                   style="position: absolute; top: 0; left: 0; width: 100%;height: 100%; opacity: 0;"
                   @change="addFile('ad_file', arguments[0], 'img_url_loading')">
          </span>
        </div>
      </div>
      <div class="form-horizontal row">
        <div class="col-xs-12 col-sm-8 col-md-6" style="min-width: 300px">
          <div class="form-group">
            <label class="col-sm-6 control-label">Preview Image:</label>
            <div class="col-sm-6">
              <div class="progress sm" v-if="img_previwe_loading && !form.ad_previwe">
                <div class="progress-bar progress-bar-yellow" :style="{ width: img_previwe_loading + '%' }"></div>
              </div>
              <img :src="baseUrl + form.ad_previwe" v-if="form.ad_previwe" style="width: 100%;">
            </div>
          </div>
        </div>
        <div class="col-xs-12 col-sm-4 col-md-6" style="padding: 1px;">
          <span
            style="display: block; line-height: 30px;vertical-align: bottom; width: 100px; text-align: center; border: 1px #ccc dashed;position: relative; margin-left: 50px;">
            Upload
            <input type="file"
                   style="position: absolute; top: 0; left: 0; width: 100%;height: 100%; opacity: 0;"
                   @change="addFile('ad_previwe', arguments[0], 'img_previwe_loading')">
          </span>
        </div>
      </div>
      <div class="form-horizontal row">
        <div class="col-xs-12 col-sm-8 col-md-6" style="min-width: 300px">
          <div class="form-group">
            <label class="col-sm-6 control-label">Dpi:</label>
            <div class="col-sm-6">
              <input type="text" class="form-control" v-model="form.dpi"/>
            </div>
          </div>
        </div>
      </div>
      <div class="form-horizontal row">
        <div class="col-xs-12" style="min-width: 300px">
          <div class="form-group">
            <label class="col-sm-6 col-sm-4 col-md-3 control-label">Ads Label:</label>
            <div class="col-sm-6 col-sm-2">
              <input type="text" class="form-control" v-model="form.ad_lable"/>
            </div>
            <div class="col-sm-6 col-sm-2">
              <input type="text" class="form-control" v-model="ad_label1"/>
            </div>
            <div class="col-sm-6 col-sm-2">
              <input type="text" class="form-control" v-model="ad_label2"/>
            </div>
          </div>
        </div>
      </div>
      <div class="form-horizontal row">
        <div class="col-xs-12" style="min-width: 300px">
          <div class="form-group">
            <label class="col-sm-6 col-sm-4 col-md-3 control-label">Description:</label>
            <div class="col-sm-6">
              <textarea class="form-control" v-model="form.description"></textarea>
            </div>
          </div>
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
         @click="closeInfo()">
        <i class="fa fa-mail-reply"></i>
        Back</a>
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
      uploadImg (file, fn, key) {
        this[key] = 0
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
        this.form[key] = ''
        this.uploadImg(event.target.files[0], (url) => {
          this.form[key] = url
        }, loadingKey)
      },
      closeInfo () {
        this.$emit('close')
      },
      submit () {
        this.loading = true
        getData(xhrUrls.ADD_ADS_INFO, {
          ...this.form,
          ad_label: this.form.ad_label + ' ' + this.ad_label1 + ' ' + this.ad_label2
        }).then(res => {
          this.loading = false
          if (res.data.code === 200) {
            messageBox.alert('Success').then(() => {
              this.$emit('reload')
              this.closeInfo()
            })
          } else {
            messageBox.alert('Failed')
          }
        }, res => {
          console.log(res)
          messageBox.alert('Network Failure')
        })
      }
    },
    computed: {},
    data () {
      return {
        baseUrl,
        img_url_loading: 0,
        img_previwe_loading: 0,
        productList: [],
        materialList: [],
        ad_label1: '',
        ad_label2: '',
        sizeList: [],
        loading: false,
        rePassword: '',
        form: {
          product: '',
          material: '',
          size: '',
          ad_file: '',
          ad_previwe: '',
          ad_format: '',
          dpi: '',
          ad_label: '',
          description: ''
        }
      }
    }
  }
</script>