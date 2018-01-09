<template>
  <div class="box box-default">
    <div class="box-header with-border">
      <h3 class="box-title">User Detail</h3>
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
              <label class="col-sm-6 control-label">Account ID:</label>
              <div class="col-sm-6">
                <label class="control-label">{{user.account_id}}</label>
              </div>
            </div>
          </div>
        </div>
        <div class="form-horizontal row">
          <div class="col-xs-12 col-sm-8 col-md-6" style="min-width: 300px">
            <div class="form-group">
              <label class="col-sm-6 control-label">User Name:</label>
              <div class="col-sm-6">
                <label class="control-label">{{user.name}}</label>
              </div>
            </div>
          </div>
        </div>
        <div class="form-horizontal row">
          <div class="col-xs-12 col-sm-8 col-md-6" style="min-width: 300px">
            <div class="form-group">
              <label class="col-sm-6 control-label">Phone:</label>
              <div class="col-sm-6">
                <label class="control-label">{{user.phone}}</label>
              </div>
            </div>
          </div>
        </div>
        <div class="form-horizontal row">
          <div class="col-xs-12 col-sm-8 col-md-6" style="min-width: 300px">
            <div class="form-group">
              <label class="col-sm-6 control-label">Created Time:</label>
              <div class="col-sm-6">
                <label class="control-label">{{user.create_time | timestamp('yyyy-mm-dd HH:MM:ss')}}</label>
              </div>
            </div>
          </div>
        </div>
        <div class="form-horizontal row">
          <div class="col-xs-12 col-sm-8 col-md-6" style="min-width: 300px">
            <div class="form-group">
              <label class="col-sm-6 control-label">Status:</label>
              <div class="col-sm-6">
                <label class="control-label">{{userStatus[user.isAvailable]}}</label>
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
  import { userStatus } from '../../../helper/Status'
  export default {
    props: ['user'],
    data () {
      return {
        userStatus
      }
    },
    methods: {
      closeInfo () {
        this.$emit('close')
      }
    }
  }
</script>