<template>
  <div>
    <div class="box box-default animated fadeInUp" v-if="!isShow">
      <div class="box-body">
        <div>
          <a class="btn btn-default btn-flat"
             :disabled="tableInfo.select.length != 1 || tableInfo.select[0].status != 0 || tableInfo.select[0].type != 'review'"
             @click="tableInfo.select.length === 1 && tableInfo.select[0].status == 0 && tableInfo.select[0].type == 'review' && audit(true)">
            <i class="fa fa-check"></i>Audit through
          </a>
          <a class="btn btn-default btn-flat"
             :disabled="tableInfo.select.length != 1 || tableInfo.select[0].status != 0 || tableInfo.select[0].type != 'review'"
             @click="tableInfo.select.length === 1 && tableInfo.select[0].status == 0 && tableInfo.select[0].type == 'review' && open()">
            <i class="fa fa-remove"></i>Audit rejected
          </a>
        </div>
        <br>
        <s-table v-model="tableInfo"
                 :data="listTable"
                 :title="tableTitle"
                 @action="subSearchUserList(arguments[0])"></s-table>
      </div>
    </div>
    <a-window>
      <div class="box box-default animated fadeInUp" v-if="isShow">
        <div class="box-body">
          <div class="form-horizontal row">
            <div class="col-xs-12" style="min-width: 300px">
              <div class="form-group">
                <label class="col-sm-3 control-label">Audit Reason:</label>
                <div class="col-sm-6">
                  <textarea class="form-control" rows="10" v-model="content"></textarea>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="box-footer">
          <a type="submit" class="btn btn-info btn-flat"
             @click="audit(false)">
              <span>
                <i class="fa fa-save"></i>
                Save
              </span>
          </a>
          <a type="submit" class="btn btn-default btn-flat pull-right"
             @click="isShow = false, content = ''">
            <i class="fa fa-mail-reply"></i>
            Back</a>
        </div>
      </div>
    </a-window>
  </div>
</template>
<script>
  import getData from '../../vuex/api/indexApi'
  import xhrUrls from '../../vuex/api/xhrUrls'
  import dateFormat from 'dateformat'
  import messageBox from '../../components/msgbox'
  import { baseUrl } from '../../config/config'
  export default {
    created () {
      this.subSearchUserList()
    },
    data () {
      return {
        isShow: false,
        content: '',
        baseUrl,
        tableInfo: {
          page: 1,
          rows: 10,
          select: []
        },
        listTable: {
          loading: false,
          data: null
        },
        tableTitle: [
          {
            name: 'Product',
            key: 'productStr'
          },
          {
            name: 'Material',
            key: 'materialStr'
          },
          {
            name: 'Size',
            key: 'sizeStr'
          },
          {
            name: 'Created Time',
            key: 'create_time',
            style: 'width: 200px;',
            filter (row) {
              return dateFormat(new Date().setTime(row.create_time), 'yyyy-mm-dd HH:MM:ss')
            }
          },
          {
            name: 'status',
            filter (row) {
              return {
                '-1': 'Disagree',
                '0': 'Pending',
                '1': 'Approved'
              }[row.status]
            }
          },
          {
            name: 'Operation',
            buttons: [{
              name: 'Download',
              event (row) {
//                window.location.href = baseUrl + row.url
                window.open(baseUrl + '/product/information/download.json?fileName=' + row.url)
              },
              filter (row) {
                return row.type === 'review' ? 'Download' : (row.type === 'create' && row.status === 1) ? 'Download' : ''
              }
            }]
          }
        ]
      }
    },
    methods: {
      open () {
        this.isShow = true
      },
      subSearchUserList ({ page = this.tableInfo.page, count = this.tableInfo.rows } = {}) {
        this.listTable.loading = true
        getData(xhrUrls.SEARCH_WORK_INFO, {
          page: parseInt(page),
          pageSize: parseInt(count)
        }).then(res => {
          this.listTable.loading = false
          this.listTable.data = res.data.data.pageInfo
        })
      },
      audit (isOk) {
        let status = isOk ? 1 : -1
        getData(xhrUrls.AUDIT_WORK, {
          id: this.tableInfo.select[0].id,
          content: this.content,
          status
        }).then(res => {
          console.log(res)
          if (res.data.code === 200) {
            messageBox.alert('Success')
            this.subSearchUserList()
            this.isShow = false
          } else {
            messageBox.alert('Failed')
          }
        }, res => {
          console.log(res)
          messageBox.alert('Network Failure')
        })
      }
    }
  }
</script>
