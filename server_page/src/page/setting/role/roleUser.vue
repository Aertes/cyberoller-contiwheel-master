<template>
  <div>
    <div class="box box-default">
      <div class="overlay" v-if="loading">
        <i class="fa fa-refresh fa-spin"></i>
      </div>
      <div class="box-header with-border">
        <h3 class="box-title">Allocate User</h3>
        <div class="box-tools pull-right">
          <a type="button" class="btn btn-box-tool"
             @click="closeInfo()">
            <i class="fa fa-times"></i>
          </a>
        </div>
      </div>
      <div class="box-body">
        <div class="nav-tabs-custom box noneBox">
          <ul class="nav nav-tabs">
            <li class="active"><a href="#role_add_user" @click="subSearchRoleList()" data-toggle="tab">Allocate User</a></li>
            <li><a href="#role_delete_user" @click="uroSubSearchUserList()" data-toggle="tab">Remove Allocation</a></li>
          </ul>
          <div class="tab-content">
            <div class="tab-pane active" id="role_add_user">
              <s-table v-model="tableInfo"
                       :data="listTable"
                       :title="tableTitle"
                       @action="subSearchRoleList(arguments[0])"></s-table>
              <a class="btn btn-info btn-flat"
                 :disabled="tableInfo.select.length < 1"
                 @click="tableInfo.select.length > 0 && addUser()">
                <i class="fa fa-edit"></i>Submit
              </a>
            </div>
            <div class="tab-pane" id="role_delete_user">
              <s-table v-model="uroTableInfo"
                       :data="uroListTable"
                       :title="tableTitle"
                       @action="uroSubSearchUserList(arguments[0])"></s-table>
              <a class="btn btn-info btn-flat"
                 :disabled="uroTableInfo.select.length < 1"
                 @click="uroTableInfo.select.length > 0 && deleteUser()">
                <i class="fa fa-edit"></i>Submit
              </a>
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
  </div>
</template>
<script>
  import getData from '../../../vuex/api/indexApi'
  import xhrUrls from '../../../vuex/api/xhrUrls'
  import { userStatus } from '../../../helper/Status'
  import dateFormat from 'dateformat'
  import messageBox from '../../../components/msgbox'
  export default {
    created () {
      this.subSearchRoleList()
    },
    props: ['role'],
    data () {
      return {
        loading: false,
        addRolesId: {},
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
        tableInfo: {
          page: 1,
          rows: 10,
          select: []
        },
        uroListTable: {
          loading: false,
          data: null
        },
        uroTableInfo: {
          page: 1,
          rows: 10,
          select: []
        }
      }
    },
    methods: {
      deleteUser () {
        let userIds = []
        for (let user of this.uroTableInfo.select) {
          userIds.push(user.id)
        }
        getData(xhrUrls.DELETE_ROLE_USER, {
          roleId: this.role.id,
          userIds: userIds.join(',')
        }).then(res => {
          this.loading = false
          console.log(res)
          if (res.data.code === 200) {
            messageBox.alert('Success')
            this.uroSubSearchUserList()
          } else {
            messageBox.alert('Failed')
          }
        }, res => {
          console.log(res)
          messageBox.alert('Network Failure')
        })
      },
      addUser () {
        let userIds = []
        for (let user of this.tableInfo.select) {
          userIds.push(user.id)
        }
        getData(xhrUrls.ADD_ROLE_USER, {
          roleId: this.role.id,
          userIds: userIds.join(',')
        }).then(res => {
          this.loading = false
          console.log(res)
          if (res.data.code === 200) {
            messageBox.alert('Success')
            this.subSearchRoleList()
          } else {
            messageBox.alert('Failed')
          }
        }, res => {
          console.log(res)
          messageBox.alert('Network Failure')
        })
      },
      closeInfo () {
        this.$emit('close')
      },
      subSearchRoleList ({ page = this.tableInfo.page, count = this.tableInfo.rows } = {}) {
        this.listTable.loading = true
        getData(xhrUrls.SEARCH_USER_LIST, {
          uroleId: this.role.id,
          page: parseInt(page),
          pageSize: parseInt(count)
        }).then(res => {
          this.listTable.loading = false
          this.listTable.data = res.data.data.pageInfo
        })
      },
      uroSubSearchUserList ({ page = this.uroTableInfo.page, count = this.uroTableInfo.rows } = {}) {
        this.uroListTable.loading = true
        getData(xhrUrls.SEARCH_USER_LIST, {
          roleId: this.role.id,
          page: parseInt(page),
          pageSize: parseInt(count)
        }).then(res => {
          this.uroListTable.loading = false
          this.uroListTable.data = res.data.data.pageInfo
        })
      }
    }
  }
</script>