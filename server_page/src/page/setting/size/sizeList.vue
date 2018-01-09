<template>
  <div>
    <div class="box box-default animated fadeInUp" v-if="nowPage === 'list'">
      <div class="box-body">
        <div class="form-horizontal row" @keyup.enter="subSearchList({page: 1})">
          <div class="col-xs-12 col-sm-6 col-md-3 search">
            <div class="form-group">
              <label class="col-sm-4 control-label nowrap">Size Name:</label>
              <div class="col-sm-8">
                <input type="text" class="form-control" v-model="listTableQuery.name"/>
              </div>
            </div>
          </div>
          <div class="col-xs-12" style="margin-bottom: 20px">
            <a class="btn btn-success btn-flat" @click="subSearchList({page: 1})">
              <i class="fa fa-search"></i>
              Search
            </a>
          </div>
          <div class="col-xs-12" style="margin-bottom: 20px">
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
               @click="tableInfo.select.length === 1 && deleteInfo()">
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
          </div>
        </div>
        <s-table v-model="tableInfo"
                 :data="listTable"
                 :title="tableTitle"
                 @action="subSearchList(arguments[0])"></s-table>
      </div>
    </div>
    <a-window>
      <div v-if="nowPage === 'add'">
        <add @close="close()" @reload="subSearchList()"></add>
      </div>
    </a-window>
    <a-window>
      <div v-if="nowPage === 'edit'">
        <edit @close="close()" @reload="subSearchList()" :size="tableInfo.select[0]"></edit>
      </div>
    </a-window>
  </div>
</template>
<script>
  import getData from '../../../vuex/api/indexApi'
  import xhrUrls from '../../../vuex/api/xhrUrls'
  import dateFormat from 'dateformat'
  import add from './sizeAdd.vue'
  import edit from './sizeEdit.vue'
  import { userStatus } from '../../../helper/Status'
  import messageBox from '../../../components/msgbox'

  export default {
    components: {
      add,
      edit
    },
    created () {
      this.subSearchList()
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
            name: 'Size Name',
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
          name: ''
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
        getData(xhrUrls.ENABLE_SIZE_INFO, {
          id: this.tableInfo.select[0].id
        }).then(res => {
          console.log(res)
          if (res.data.code === 200) {
            messageBox.alert('Success')
            this.subSearchList()
          } else {
            messageBox.alert('Failed')
          }
        }, res => {
          messageBox.alert('Network Failure')
        })
      },
      disable () {
        getData(xhrUrls.DISABLE_SIZE_INFO, {
          id: this.tableInfo.select[0].id
        }).then(res => {
          console.log(res)
          if (res.data.code === 200) {
            messageBox.alert('Success')
            this.subSearchList()
          } else {
            messageBox.alert('Failed')
          }
        }, res => {
          messageBox.alert('Network Failure')
        })
      },
      deleteInfo () {
        getData(xhrUrls.DELETE_SIZE_INFO, {
          id: this.tableInfo.select[0].id
        }).then(res => {
          console.log(res)
          if (res.data.code === 200) {
            messageBox.alert('Success')
            this.subSearchList()
          } else {
            messageBox.alert('Failed')
          }
        }, res => {
          messageBox.alert('Network Failure')
        })
      },
      close () {
        this.nowPage = 'list'
      },
      openWindow (key) {
        this.nowPage = key
      },
      subSearchList ({ page = this.tableInfo.page, count = this.tableInfo.rows } = {}) {
        this.listTable.loading = true
        getData(xhrUrls.SEARCH_SIZE_LIST, {
          ...this.listTableQuery,
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
