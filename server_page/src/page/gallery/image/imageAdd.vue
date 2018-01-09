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
      <!--<div class="form-horizontal row">-->
      <!--<div class="col-xs-12" style="min-width: 300px">-->
      <!--<div class="form-group">-->
      <!--<label class="col-sm-6  col-sm-4 col-md-3 control-label">Image Type:</label>-->
      <!--<div class="col-sm-3">-->
      <!--<s-checkbox v-model="img_type_1" name="img_type"></s-checkbox>-->
      <!--Product Image-->
      <!--</div>-->
      <!--<div class="col-sm-3">-->
      <!--<s-checkbox v-model="img_type_2" name="img_type"></s-checkbox>-->
      <!--Surroundings-->
      <!--</div>-->
      <!--&lt;!&ndash;<div class="col-sm-6">&ndash;&gt;-->
      <!--&lt;!&ndash;<s-select :noSearch="true" v-model="form.img_type">&ndash;&gt;-->
      <!--&lt;!&ndash;<option value="Product Image">Product Image</option>&ndash;&gt;-->
      <!--&lt;!&ndash;<option value="Surroundings">Surroundings</option>&ndash;&gt;-->
      <!--&lt;!&ndash;</s-select>&ndash;&gt;-->
      <!--&lt;!&ndash;</div>&ndash;&gt;-->
      <!--</div>-->
      <!--</div>-->
      <!--</div>-->
      <div class="form-horizontal row">
        <div class="col-xs-12 col-sm-8 col-md-6" style="min-width: 300px">
          <div class="form-group">
            <label class="col-sm-6 control-label">Related Product:</label>
            <div class="col-sm-6">
              <s-select :noSearch="true" v-model="form.product">
                <option value="0">- Select Product -</option>
                <template v-for="pro of productList">
                  <option :value="pro.id">{{pro.name}}</option>
                </template>
              </s-select>
            </div>
          </div>
        </div>
        <div class="col-xs-12 col-sm-4 col-md-6">
          *Leave this empty for all products
        </div>
      </div>
      <div class="form-horizontal row">
        <div class="col-xs-12 col-sm-8 col-md-6" style="min-width: 300px">
          <div class="form-group">
            <label class="col-sm-6 control-label">Title:</label>
            <div class="col-sm-6" style="position: relative;">
              <input type="text" class="form-control"
                     v-model="form.title">
            </div>
          </div>
        </div>
      </div>
      <div class="form-horizontal row">
        <div class="col-xs-12 col-sm-8 col-md-6" style="min-width: 300px">
          <div class="form-group">
            <label class="col-sm-6 control-label">Category:</label>
            <div class="col-sm-6" style="position: relative;">
              <input type="text" class="form-control"
                     @focus="treeShow = true"
                     v-model="type_name"
                     @click.stop="clickTree('treeShow')"
                     @blur="blur('treeShow')">
              <div
                @click.stop
                style="z-index: 100;position: absolute; top: 35px; left: 0; width: 100%; max-height: 300px; overflow-y: scroll;margin: 0 15px; background: #fff;">
                <s-tree :data="tree"
                        v-show="treeShow"
                        v-model="treeView"
                        treeId="id"
                        title="type"
                        name="name"></s-tree>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="form-horizontal row">
        <div class="col-xs-12 col-sm-8 col-md-6" style="min-width: 300px">
          <div class="form-group">
            <label class="col-sm-6 control-label">{{fileName}}:</label>
            <div class="col-sm-6">
              <div class="progress sm" v-if="img_url_loading && !form.img_url">
                <div class="progress-bar progress-bar-yellow" :style="{ width: img_url_loading + '%' }"></div>
              </div>
              <img :src="baseUrl + form.img_url" v-if="form.img_url" alt="" style="width: 100%;">
            </div>
          </div>
        </div>
        <div class="col-xs-12 col-sm-4 col-md-6" style="padding: 1px;">
          <span
            style="display: inline-block; vertical-align: bottom; line-height: 30px; width: 100px; text-align: center; border: 1px #ccc dashed;position: relative; margin-left: 50px;">
            Upload
            <input type="file"
                   style="position: absolute; top: 0; left: 0; width: 100%;height: 100%; opacity: 0;"
                   @change="addFile('img_url', arguments[0], 'img_url_loading')">
          </span>
        </div>
      </div>
      <div class="form-horizontal row">
        <div class="col-xs-12 col-sm-8 col-md-6" style="min-width: 300px">
          <div class="form-group">
            <label class="col-sm-6 control-label">Preview Image:</label>
            <div class="col-sm-6">
              <div class="progress sm" v-if="img_previwe_loading && !form.img_previwe">
                <div class="progress-bar progress-bar-yellow" :style="{ width: img_previwe_loading + '%' }"></div>
              </div>
              <img :src="baseUrl + form.img_previwe" v-if="form.img_previwe" alt=""
                   style="width: 100%;">
            </div>
          </div>
        </div>
        <div class="col-xs-12 col-sm-4 col-md-6" style="padding: 1px;">
          <span
            style="display: block; line-height: 30px;vertical-align: bottom; width: 100px; text-align: center; border: 1px #ccc dashed;position: relative; margin-left: 50px;">
            Upload
            <input type="file"
                   style="position: absolute; top: 0; left: 0; width: 100%;height: 100%; opacity: 0;"
                   @change="addFile('img_previwe', arguments[0], 'img_previwe_loading')">
          </span>
        </div>
      </div>
      <div class="form-horizontal row">
        <div class="col-xs-12" style="min-width: 300px">
          <div class="form-group">
            <label class="col-sm-6 col-sm-4 col-md-3 control-label">Label:</label>
            <div class="col-sm-6 col-sm-2" style="position: relative;">
              <input type="text" class="form-control"
                     @focus="treeShow1 = true"
                     v-model="img_label_name1"
                     @click.stop="clickTree('treeShow1')"
                     @blur="blur('treeShow1')">
              <div
                @click.stop
                style="z-index: 100;position: absolute; top: 35px; left: 0; width: 150%; max-height: 300px; overflow-y: scroll;margin: 0 15px; background: #fff;">
                <s-tree :data="tree"
                        v-show="treeShow1"
                        v-model="treeView1"
                        treeId="id"
                        title="type"
                        name="name"></s-tree>
              </div>
            </div>
            <div class="col-sm-6 col-sm-2" style="position: relative;">
              <input type="text" class="form-control"
                     @focus="treeShow2 = true"
                     v-model="img_label_name2"
                     @click.stop="clickTree('treeShow2')"
                     @blur="blur('treeShow2')">
              <div
                @click.stop
                style="z-index: 100;position: absolute; top: 35px; left: 0; width: 150%; max-height: 300px; overflow-y: scroll;margin: 0 15px; background: #fff;">
                <s-tree :data="tree"
                        v-show="treeShow2"
                        v-model="treeView2"
                        treeId="id"
                        title="type"
                        name="name"></s-tree>
              </div>
            </div>
            <div class="col-sm-6 col-sm-2" style="position: relative;">
              <input type="text" class="form-control"
                     @focus="treeShow3 = true"
                     v-model="img_label_name3"
                     @click.stop="clickTree('treeShow3')"
                     @blur="blur('treeShow3')">
              <div
                @click.stop
                style="z-index: 100;position: absolute; top: 35px; left: 0; width: 150%; max-height: 300px; overflow-y: scroll;margin: 0 15px; background: #fff;">
                <s-tree :data="tree"
                        v-show="treeShow3"
                        v-model="treeView3"
                        treeId="id"
                        title="type"
                        name="name"></s-tree>
              </div>
            </div>
            <!--<div class="col-sm-6 col-sm-2">-->
            <!--<input type="text" class="form-control" v-model="img_label1"/>-->
            <!--</div>-->
            <!--<div class="col-sm-6 col-sm-2">-->
            <!--<input type="text" class="form-control" v-model="img_label2"/>-->
            <!--</div>-->
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
  import $ from '../../../plugins/jQuery/jquery-2.2.3.min'
  import { baseUrl } from '../../../config/config'

  export default {
    props: ['tree', 'nowId', 'nowName', 'fileName'],
    created () {
      $(document).click(() => {
        this.treeShow = false
        this.treeShow1 = false
        this.treeShow2 = false
        this.treeShow3 = false
      })
      this.loading = true
      this.form.category = this.nowId
      this.type_name = this.nowName
      Promise.all([getData(xhrUrls.SEARCH_PRODUCT_LIST, {
        page: 0,
        pageSize: 1000
      })]).then(([product]) => {
        this.productList = product.data.data.pageInfo.rows
        this.loading = false
      })
    },
    methods: {
      blur (key) {
//        setTimeout(() => {
//          this[key] = false
//        }, 150)
      },
      clickTree (key) {
        this.treeShow = false
        this.treeShow1 = false
        this.treeShow2 = false
        this.treeShow3 = false
        this[key] = true
      },
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
            fn & fn(res.data.data)
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
        this.uploadImg(event.target.files[0], (data) => {
          if (key === 'img_url') {
            this.form[key] = data.url
            this.pre_url = data.pre_url || data.url
            this.form.img_previwe = data.pre_url || data.url
            this.form.img_length = data.img_length
          } else {
            this.form[key] = data.url
          }
        }, loadingKey)
      },
      closeInfo () {
        this.$emit('close')
      },
      submit () {
        this.loading = true
        getData(xhrUrls.ADD_IMAGE_INFO, {
          ...this.form,
          img_type: this.img_type_1 ? 'Product Image' : 'Surroundings',
          img_label: this.form.img_label + ' ' + this.img_label1 + ' ' + this.img_label2
        }).then(res => {
          this.loading = false
          if (res.data.code === 200) {
            messageBox.alert('Success').then(() => {
//              this.$emit('reload')
              this.closeInfo()
            })
            console.log(res)
          } else {
            messageBox.alert('Failed')
          }
        }, res => {
          console.log(res)
          messageBox.alert('Network Failure')
        })
      }
    },
    data () {
      return {
        baseUrl,
        img_url_loading: 0,
        img_previwe_loading: 0,
        type_name: '',
        treeView: {},
        treeView1: {},
        treeView2: {},
        treeView3: {},
        treeShow: false,
        treeShow1: false,
        treeShow2: false,
        treeShow3: false,
        img_label_name1: '',
        img_label_name3: '',
        img_label_name2: '',
        img_type_1: true,
        img_type_2: false,
        img_label1: '',
        img_label2: '',
        productList: [],
        loading: false,
        rePassword: '',
        form: {
          product: '0',
          img_url: '',
          img_length: '',
          img_type: 'Product Image',
          img_previwe: '',
          img_format: '',
          img_label: '',
          description: '',
          category: '',
          title: ''
        }
      }
    },
    watch: {
      treeView (value) {
        console.log(value)
        if (!value.child.length) {
          this.form.category = value.id
          this.type_name = value.name
        }
      },
      treeView1 (value) {
        if (!value.child.length) {
          this.form.img_label = value.id
          this.img_label_name1 = value.name
        }
      },
      treeView2 (value) {
        if (!value.child.length) {
          this.img_label1 = value.id
          this.img_label_name2 = value.name
        }
      },
      treeView3 (value) {
        if (!value.child.length) {
          this.img_label2 = value.id
          this.img_label_name3 = value.name
        }
      }
    }
  }
</script>
