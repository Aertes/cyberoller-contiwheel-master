<template>
  <div class="box box-default">
    <div class="overlay" v-if="loading">
      <i class="fa fa-refresh fa-spin"></i>
    </div>
    <div class="box-header with-border">
      <h3 class="box-title">Upload Image</h3>
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
            <label class="col-sm-6 control-label">Image Type:</label>
            <div class="col-sm-6">
              <s-select :noSearch="true" v-model="form.img_type">
                <option value="Product Image">Product Image</option>
                <option value="Surroundings">Surroundings</option>
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
                <option value="0">选择产品</option>
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
            <label class="col-sm-6 control-label">Image:</label>
            <div class="col-sm-6">
              <img :src="form.img_url" style="width: 100%;">
            </div>
          </div>
        </div>
        <div class="col-xs-12 col-sm-4 col-md-6" style="padding: 1px;">
          <span
            style="display: inline-block; vertical-align: bottom; line-height: 30px; width: 100px; text-align: center; border: 1px #ccc dashed;position: relative; margin-left: 50px;">
            点击上传
            <input type="file"
                   style="position: absolute; top: 0; left: 0; width: 100%;height: 100%; opacity: 0;"
                   @change="addFile('img_url', arguments[0])">
          </span>
        </div>
      </div>
      <div class="form-horizontal row">
        <div class="col-xs-12 col-sm-8 col-md-6" style="min-width: 300px">
          <div class="form-group">
            <label class="col-sm-6 control-label">Preview Image:</label>
            <div class="col-sm-6">
              <img :src="form.img_previwe || form.img_url" style="width: 100%;">
            </div>
          </div>
        </div>
        <div class="col-xs-12 col-sm-4 col-md-6" style="padding: 1px;">
          <span
            style="display: block; line-height: 30px;vertical-align: bottom; width: 100px; text-align: center; border: 1px #ccc dashed;position: relative; margin-left: 50px;">
            点击上传
            <input type="file"
                   style="position: absolute; top: 0; left: 0; width: 100%;height: 100%; opacity: 0;"
                   @change="addFile('img_previwe', arguments[0])">
          </span>
        </div>
      </div>
      <div class="form-horizontal row">
        <div class="col-xs-12 col-sm-8 col-md-6" style="min-width: 300px">
          <div class="form-group">
            <label class="col-sm-6 control-label">Image Label:</label>
            <div class="col-sm-6">
              <input type="text" class="form-control" v-model="form.img_label"/>
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
                保存
              </span>
      </a>
      <a type="submit" class="btn btn-default btn-flat pull-right"
         @click="closeInfo()">
        <i class="fa fa-mail-reply"></i>
        返回</a>
    </div>
  </div>
</template>
<script>
  import getData from '../../../vuex/api/indexApi'
  import xhrUrls from '../../../vuex/api/xhrUrls'
  import { baseUrl } from '../../../config/config'
  export default {
    props: ['image'],
    mounted () {
      this.loading = true
      Promise.all([getData(xhrUrls.SEARCH_PRODUCT_LIST, {
        page: 0,
        pageSize: 1000
      })]).then(([product]) => {
        this.productList = product.data.data.pageInfo.rows
        this.form.id = this.image.id
        this.form.product = this.image.product
        this.form.img_url = this.image.img_url
        this.form.img_type = this.image.img_type
        this.form.img_previwe = this.image.img_previwe
        this.form.img_format = this.image.img_format
        this.form.img_label = this.image.img_label
        this.form.description = this.image.description
        this.loading = false
      })
    },
    methods: {
      uploadImg (file, fn) {
        let formData = new window.FormData()
        formData.append('imgFile', file, file.name)
        getData(xhrUrls.UPLOAD_IMG, formData).then(res => {
          if (res.data.code === 200) {
            console.log(res)
            fn & fn(res.data.data.url)
          } else {
            window.alert('err')
          }
        }, res => {
          console.log(res)
          window.alert('err')
        })
      },
      addFile (key, event) {
        this.uploadImg(event.target.files[0], (url) => {
          this.form[key] = baseUrl + url
        })
      },
      closeInfo () {
        this.$emit('close')
      },
      submit () {
        this.loading = true
        getData(xhrUrls.EDIT_IMAGE_INFO, {
          ...this.form
        }).then(res => {
          this.loading = false
          if (res.data.code === 200) {
            this.$emit('reload')
            window.alert('ok')
            this.closeInfo()
            console.log(res)
          } else {
            window.alert('err')
          }
        }, res => {
          console.log(res)
          window.alert('err')
        })
      }
    },
    computed: {},
    data () {
      return {
        productList: [],
        loading: false,
        rePassword: '',
        form: {
          id: '',
          product: '0',
          img_url: '',
          img_type: 'Product Image',
          img_previwe: '',
          img_format: '',
          img_label: '',
          description: ''
        }
      }
    }
  }
</script>