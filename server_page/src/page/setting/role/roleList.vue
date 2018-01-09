<template>
  <div>
    <div class="box box-default animated fadeInUp" v-if="nowPage === 'list'">
      <div class="box-body">
        <div class="form-horizontal row" @keyup.enter="subSearchRoleList({page: 1})">
          <div class="col-xs-12 col-sm-6 col-md-3 search">
            <div class="form-group">
              <label class="col-sm-4 control-label nowrap">Role Name:</label>
              <div class="col-sm-8">
                <input type="text" class="form-control" v-model="listTableQuery.name"/>
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
            <a class="btn btn-success btn-flat" @click="subSearchRoleList({page: 1})">
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
               @click="tableInfo.select.length === 1 && deleteRole()">
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
               @click="tableInfo.select.length === 1 && openWindow('role_user')">
              <i class="fa fa-user"></i>Allocate User
            </a>
            <a class="btn btn-default btn-flat"
               :disabled="tableInfo.select.length != 1"
               @click="tableInfo.select.length === 1 && openWindow('func')">
              <i class="fa fa-user"></i>Grant Permission
            </a>
          </div>
        </div>
        <s-table v-model="tableInfo"
                 :data="listTable"
                 :title="tableTitle"
                 @action="subSearchRoleList(arguments[0])"></s-table>
      </div>
    </div>
    <a-window>
      <div v-if="nowPage === 'info'">
        <info @close="close()" :role="tableInfo.select[0]"></info>
      </div>
    </a-window>
    <a-window>
      <div v-if="nowPage === 'add'">
        <add @close="close()" @reload="subSearchRoleList()"></add>
      </div>
    </a-window>
    <a-window>
      <div v-if="nowPage === 'edit'">
        <edit @close="close()" @reload="subSearchRoleList()" :role="tableInfo.select[0]"></edit>
      </div>
    </a-window>
    <a-window>
      <div v-if="nowPage === 'role_user'">
        <user @close="close()" @reload="subSearchRoleList()" :role="tableInfo.select[0]"></user>
      </div>
    </a-window>
    <a-window>
      <div v-if="nowPage === 'func'">
        <func @close="close()" @reload="subSearchRoleList()" :role="tableInfo.select[0]"></func>
      </div>
    </a-window>
  </div>
</template>
<script>
  import getData from '../../../vuex/api/indexApi'
  import xhrUrls from '../../../vuex/api/xhrUrls'
  import { roleStatus } from '../../../helper/Status'
  import dateFormat from 'dateformat'
  import roleInfo from './roleInfo.vue'
  import roleAdd from './roleAdd.vue'
  import roleEdit from './roleEdit.vue'
  import roleUser from './roleUser.vue'
  import roleFunction from './roleFunction.vue'
  import messageBox from '../../../components/msgbox'
  export default {
    components: {
      info: roleInfo,
      add: roleAdd,
      edit: roleEdit,
      user: roleUser,
      func: roleFunction
    },
    created () {
      this.subSearchRoleList()
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
            name: 'Role Name',
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
              return roleStatus[row.isAvailable]
            }
          }
        ],
        listTableQuery: {
          name: '',
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
      enable () {
        getData(xhrUrls.ENABLE_ROLE_INFO, {
          id: this.tableInfo.select[0].id
        }).then(res => {
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
      disable () {
        getData(xhrUrls.DISABLE_ROLE_INFO, {
          id: this.tableInfo.select[0].id
        }).then(res => {
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
      deleteRole () {
        getData(xhrUrls.DELETE_ROLE_INFO, {
          id: this.tableInfo.select[0].id
        }).then(res => {
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
      close () {
        this.nowPage = 'list'
      },
      openWindow (key) {
        this.nowPage = key
      },
      subSearchRoleList ({ page = this.tableInfo.page, count = this.tableInfo.rows } = {}) {
        this.listTable.loading = true
        getData(xhrUrls.SEARCH_ROLE_LIST, {
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