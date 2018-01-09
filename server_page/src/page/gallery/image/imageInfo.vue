<template>
  <div class="box box-default">
    <div class="box-header with-border">
      <h3 class="box-title">Image Detail</h3>
      <div class="box-tools pull-right">
        <a type="button" class="btn btn-box-tool"
           @click="closeInfo()">
          <i class="fa fa-times"></i>
        </a>
      </div>
    </div>
    <div class="box-body">
      <div class="row">
        <!--<div class="form-horizontal row">-->
        <!--<div class="col-xs-12 col-sm-8 col-md-6" style="min-width: 300px">-->
        <!--<div class="form-group">-->
        <!--<label class="col-sm-6 control-label">Image Type:</label>-->
        <!--<div class="col-sm-6">-->
        <!--<label class="control-label">{{image.img_type}}</label>-->
        <!--</div>-->
        <!--</div>-->
        <!--</div>-->
        <!--</div>-->
        <div class="form-horizontal row">
          <div class="col-xs-12 col-sm-8 col-md-6" style="min-width: 300px">
            <div class="form-group">
              <label class="col-sm-6 control-label">Image Title:</label>
              <div class="col-sm-6">
                <label class="control-label">{{image.title}}</label>
              </div>
            </div>
          </div>
        </div>
        <div class="form-horizontal row">
          <div class="col-xs-12 col-sm-8 col-md-6" style="min-width: 300px">
            <div class="form-group">
              <label class="col-sm-6 control-label">Related Product:</label>
              <div class="col-sm-6">
                <label class="control-label">{{image.productStr}}</label>
              </div>
            </div>
          </div>
        </div>
        <div class="form-horizontal row">
          <div class="col-xs-12 col-sm-8 col-md-6" style="min-width: 300px">
            <div class="form-group">
              <label class="col-sm-6 control-label">Image:</label>
              <div class="col-sm-6" style="    margin-top: 7px;">
                <a href="javascript:;" @click="downLoad(image.img_url)"> Click to download</a>
              </div>
            </div>
          </div>
        </div>
        <div class="form-horizontal row">
          <div class="col-xs-12 col-sm-8 col-md-6" style="min-width: 300px">
            <div class="form-group">
              <label class="col-sm-6 control-label">Preview Image:</label>
              <div class="col-sm-6">
                <img :src="baseUrl + (image.img_previwe || image.img_url)" style="width: 100%;">
              </div>
            </div>
          </div>
        </div>
        <div class="form-horizontal row">
          <div class="col-xs-12 col-sm-8 col-md-6" style="min-width: 300px">
            <div class="form-group">
              <label class="col-sm-6 control-label">Create Time:</label>
              <div class="col-sm-6">
                <label class="control-label">{{image.create_time | timestamp('yyyy-mm-dd HH:MM:ss')}}</label>
              </div>
            </div>
          </div>
        </div>
        <div class="form-horizontal row">
          <div class="col-xs-12 col-sm-8 col-md-6" style="min-width: 300px">
            <div class="form-group">
              <label class="col-sm-6 control-label">Image Label:</label>
              <div class="col-sm-6">
                <!--<label class="control-label">{{image.img_label}}</label>-->
                <label class="control-label">{{l1 + ' - ' + l2 + ' - ' + l3}}</label>
              </div>
            </div>
          </div>
        </div>
        <div class="form-horizontal row">
          <div class="col-xs-12 col-sm-8 col-md-6" style="min-width: 300px">
            <div class="form-group">
              <label class="col-sm-6 control-label">Description:</label>
              <div class="col-sm-6">
                <label class="control-label">{{image.description}}</label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="box-footer">
      <a type="submit" class="btn btn-info btn-flat"
         @click="edit()">
              <span>
                <i class="fa fa-save"></i>
                Edit
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
  import { baseUrl } from '../../../config/config'
  export default {
    props: ['image', 'set'],
    data () {
      return {
        baseUrl,
        l1: '',
        l2: '',
        l3: ''
      }
    },
    created () {
      this.l1 = this.set[this.image.img_label.split(' ')[0]].name
      this.l2 = this.set[this.image.img_label.split(' ')[1]].name
      this.l3 = this.set[this.image.img_label.split(' ')[2]].name
    },
    methods: {
      closeInfo () {
        this.$emit('close')
      },
      edit () {
        this.$emit('edit')
      },
      downLoad (src) {
        window.open(baseUrl + '/product/information/download.json?fileName=' + src)
        return false
      }
    }
  }
</script>