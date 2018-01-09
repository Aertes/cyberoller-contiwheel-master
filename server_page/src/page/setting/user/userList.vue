<template>
  <div>
    <div class="box box-default animated fadeInUp" v-if="nowPage === 'list'">
      <div class="box-body">
        <div class="form-horizontal row" @keyup.enter="subSearchUserList({page: 1})">
          <div class="col-xs-12 col-sm-6 col-md-3 search">
            <div class="form-group">
              <label class="col-sm-4 control-label nowrap">User Name:</label>
              <div class="col-sm-8">
                <input type="text" class="form-control" v-model="listTableQuery.name"/>
              </div>
            </div>
          </div>
          <div class="col-xs-12 col-sm-6 col-md-3 search">
            <div class="form-group">
              <label class="col-sm-4 control-label nowrap">Phone Number:</label>
              <div class="col-sm-8">
                <input type="text" class="form-control" v-model="listTableQuery.phone"/>
              </div>
            </div>
          </div>
          <div class="col-xs-12 col-sm-6 col-md-3 search">
            <div class="form-group">
              <label class="col-sm-4 control-label nowrap">isAvailable:</label>
              <div class="col-sm-8">
                <s-select v-model="listTableQuery.isAvailable" :noSearch="true">
                  <option value="2">All</option>
                  <option value="1">Available</option>
                  <option value="0">Disabled</option>
                </s-select>
              </div>
            </div>
          </div>
          <div class="col-xs-12" style="margin-bottom: 20px">
            <a class="btn btn-success btn-flat" @click="subSearchUserList({page: 1})">
              <i class="fa fa-search"></i>
              Search
            </a>
          </div>
          <div class="col-xs-12" style="margin-bottom: 20px">
            <a class="btn btn-default btn-flat"
               :disabled="tableInfo.select.length != 1"
               @click="tableInfo.select.length === 1 && openWindow('info')">
              <i class="fa fa-search"></i>Detail
            </a>
            <a class="btn btn-default btn-flat" @click="openWindow('add')">
              <i class="fa fa-plus"></i>Add
            </a>
            <a class="btn btn-default btn-flat"
               :disabled="tableInfo.select.length != 1"
               @click="tableInfo.select.length === 1 && openWindow('edit')">
              <i class="fa fa-edit"></i>Edit
            </a>
            <a class="btn btn-default btn-flat"
               :disabled="tableInfo.select.length != 1"
               @click="tableInfo.select.length === 1 && deleteUser()">
              <i class="fa fa-remove"></i>Delete
            </a>
            <a class="btn btn-default btn-flat"
               :disabled="tableInfo.select.length != 1 || tableInfo.select[0].isAvailable != 0"
               @click="tableInfo.select.length === 1 && tableInfo.select[0].isAvailable == 0 && enable()">
              <i class="fa fa-unlock"></i>Enable
            </a>
            <a class="btn btn-default btn-flat"
               :disabled="tableInfo.select.length != 1 || tableInfo.select[0].isAvailable != 1"
               @click="tableInfo.select.length === 1 && tableInfo.select[0].isAvailable == 1 && disable()">
              <i class="fa fa-lock"></i>Disable
            </a>
            <a class="btn btn-default btn-flat"
               :disabled="tableInfo.select.length != 1"
               @click="tableInfo.select.length === 1 && openWindow('password')">
              <i class="fa fa-refresh"></i>Reset Password
            </a>
          </div>
        </div>
        <s-table v-model="tableInfo"
                 :data="listTable"
                 :title="tableTitle"
                 @action="subSearchUserList(arguments[0])"></s-table>
      </div>
    </div>
    <a-window>
      <div v-if="nowPage === 'info'">
        <info @close="close()" :user="tableInfo.select[0]"></info>
      </div>
    </a-window>
    <a-window>
      <div v-if="nowPage === 'add'">
        <add @close="close()" @reload="subSearchUserList()"></add>
      </div>
    </a-window>
    <a-window>
      <div v-if="nowPage === 'edit'">
        <edit @close="close()" @reload="subSearchUserList()" :user="tableInfo.select[0]"></edit>
      </div>
    </a-window>
    <a-window>
      <div v-if="nowPage === 'password'">
        <password @close="close()" @reload="subSearchUserList()" :user="tableInfo.select[0]"></password>
      </div>
    </a-window>
  </div>
</template>
<script>
  import getData from '../../../vuex/api/indexApi'
  import xhrUrls from '../../../vuex/api/xhrUrls'
  import { userStatus } from '../../../helper/Status'
  import dateFormat from 'dateformat'
  import userInfo from './userInfo.vue'
  import userAdd from './userAdd.vue'
  import userEdit from './userEdit.vue'
  import userPassword from './userEditPassword.vue'
  import messageBox from '../../../components/msgbox'
  export default {
    components: {
      info: userInfo,
      add: userAdd,
      edit: userEdit,
      password: userPassword
    },
    created () {
      this.subSearchUserList()
    },
    data () {
      return {
        nowPage: 'list',
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
          name: '',
          phone: '',
          isAvailable: ''
        },
        tableInfo: {
          page: 1,
          rows: 10,
          select: []
        }
      }
    },
    methods: {
      resetPassword () {
        getData(xhrUrls.RESET_USER_PASSWORD, {
          id: this.tableInfo.select[0].id
        }).then(res => {
          console.log(res)
          if (res.data.code === 200) {
            messageBox.alert('Success')
            this.subSearchUserList()
          } else {
            messageBox.alert('Failed')
          }
        }, res => {
          console.log(res)
          messageBox.alert('Network Failure')
        })
      },
      enable () {
        getData(xhrUrls.ENABLE_USER_INFO, {
          id: this.tableInfo.select[0].id
        }).then(res => {
          console.log(res)
          if (res.data.code === 200) {
            messageBox.alert('Success')
            this.subSearchUserList()
          } else {
            messageBox.alert('Failed')
          }
        }, res => {
          console.log(res)
          messageBox.alert('Network Failure')
        })
      },
      disable () {
        getData(xhrUrls.DISABLE_USER_INFO, {
          id: this.tableInfo.select[0].id
        }).then(res => {
          console.log(res)
          if (res.data.code === 200) {
            messageBox.alert('Success')
            this.subSearchUserList()
          } else {
            messageBox.alert('Failed')
          }
        }, res => {
          console.log(res)
          messageBox.alert('Network Failure')
        })
      },
      deleteUser () {
        getData(xhrUrls.DELETE_USER_INFO, {
          id: this.tableInfo.select[0].id
        }).then(res => {
          console.log(res)
          if (res.data.code === 200) {
            messageBox.alert('Success')
            this.subSearchUserList()
          } else {
            messageBox.alert('Failed')
          }
        }, () => {
          messageBox.alert('Network Failure')
        })
      },
      close () {
        this.nowPage = 'list'
      },
      openWindow (key) {
        this.nowPage = key
      },
      subSearchUserList ({ page = this.tableInfo.page, count = this.tableInfo.rows } = {}) {
        this.listTable.loading = true
        getData(xhrUrls.SEARCH_USER_LIST, {
          ...this.listTableQuery,
          isAvailable: parseInt(this.listTableQuery.isAvailable) === 2 ? '' : this.listTableQuery.isAvailable,
          page: parseInt(page),
          pageSize: parseInt(count)
        }).then(res => {
          this.listTable.loading = false
          this.listTable.data = res.data.data.pageInfo
        })
      }
    }
  }
</script>
