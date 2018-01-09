<template>
  <div class="box box-default">
    <div class="box-header with-border">
      <h3 class="box-title">Role Detail</h3>
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
              <label class="col-sm-6 control-label">Role Name:</label>
              <div class="col-sm-6">
                <label class="control-label">{{role.name}}</label>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="form-horizontal row">
          <div class="col-xs-12 col-sm-8 col-md-6" style="min-width: 300px">
            <div class="form-group">
              <label class="col-sm-6 control-label">Created Time:</label>
              <div class="col-sm-6">
                <label class="control-label">{{role.create_time | timestamp('yyyy-mm-dd HH:MM:ss')}}</label>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="box box-default">
        <div class="box-header with-border">
          <h5 class="box-title" style="font-size: 13px">Role Users:</h5>
        </div>
        <div class="box-body">
          <s-table v-model="tableInfo"
                   :data="listTable"
                   :title="tableTitle"
                   @action="subSearchRoleList(arguments[0])"></s-table>
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
  import getData from '../../../vuex/api/indexApi'
  import xhrUrls from '../../../vuex/api/xhrUrls'
  import { userStatus } from '../../../helper/Status'
  import dateFormat from 'dateformat'

  export default {
    created () {
      this.listTableQuery.roleId = this.role.id
      this.subSearchRoleList()
    },
    props: ['role'],
    methods: {
      closeInfo () {
        this.$emit('close')
      },
      subSearchRoleList ({ page = this.tableInfo.page, count = this.tableInfo.rows } = {}) {
        this.listTable.loading = true
        getData(xhrUrls.SEARCH_USER_LIST, {
          ...this.listTableQuery,
          page: parseInt(page),
          pageSize: parseInt(count)
        }).then(res => {
          this.listTable.loading = false
          this.listTable.data = res.data.data.pageInfo
        })
      }
    },
    data () {
      return {
        listTable: {
          loading: false,
          data: null
        },
        tableTitle: [
          {
            name: 'Account ID',
            key: 'account_id',
            style: 'width: 120px;'
          },
          {
            name: 'Phone',
            key: 'phone'
          },
          {
            name: 'User Name',
            key: 'name'
          },
          {
            name: 'Created Time',
            key: 'create_time',
            filter (row) {
              return dateFormat(new Date().setTime(row.create_time), 'yyyy-mm-dd HH:MM:ss')
            }
          },
          {
            name: 'Status',
            key: 'isAvailable',
            filter (row) {
              return userStatus[row.isAvailable]
            }
          }
        ],
        listTableQuery: {
          roleId: ''
        },
        tableInfo: {
          page: 1,
          rows: 10,
          select: []
        }
      }
    }
  }
</script>