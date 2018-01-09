<template>
  <div class="box box-default">
    <div class="box-header with-border">
      <h3 class="box-title">AD Detail</h3>
      <div class="box-tools pull-right">
        <a type="button" class="btn btn-box-tool"
           @click="closeInfo()">
          <i class="fa fa-times"></i>
        </a>
      </div>
    </div>
    <div class="box-body">
      <div class="row">
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
              <label class="col-sm-6 control-label">Related Material:</label>
              <div class="col-sm-6">
                <label class="control-label">{{image.materialStr}}</label>
              </div>
            </div>
          </div>
        </div>
        <div class="form-horizontal row">
          <div class="col-xs-12 col-sm-8 col-md-6" style="min-width: 300px">
            <div class="form-group">
              <label class="col-sm-6 control-label">Related Size:</label>
              <div class="col-sm-6">
                <label class="control-label">{{image.sizeStr}}</label>
              </div>
            </div>
          </div>
        </div>
        <div class="form-horizontal row">
          <div class="col-xs-12 col-sm-8 col-md-6" style="min-width: 300px">
            <div class="form-group">
              <label class="col-sm-6 control-label">file:</label>
              <div class="col-sm-6" style="    margin-top: 7px;">
                <a :href="baseUrl + image.ad_file" target="_blank"> Click to download</a>
              </div>
            </div>
          </div>
        </div>
        <div class="form-horizontal row">
          <div class="col-xs-12 col-sm-8 col-md-6" style="min-width: 300px">
            <div class="form-group">
              <label class="col-sm-6 control-label">Preview Image:</label>
              <div class="col-sm-6">
                <img :src="baseUrl + image.ad_previwe" style="width: 100%;">
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
              <label class="col-sm-6 control-label">ad_format:</label>
              <div class="col-sm-6">
                <label class="control-label">{{image.ad_format}}</label>
              </div>
            </div>
          </div>
        </div>
        <div class="form-horizontal row">
          <div class="col-xs-12 col-sm-8 col-md-6" style="min-width: 300px">
            <div class="form-group">
              <label class="col-sm-6 control-label">dpi:</label>
              <div class="col-sm-6">
                <label class="control-label">{{image.dpi}}</label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="box-footer">
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
    props: ['image'],
    data () {
      return {
        baseUrl
      }
    },
    methods: {
      closeInfo () {
        this.$emit('close')
      },
      edit () {
        this.$emit('edit')
      }
    }
  }
</script>