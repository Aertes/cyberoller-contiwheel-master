<template>
  <div>
    <div class="box box-default animated fadeInUp">
      <div class="box-body">
        <s-table v-model="tableInfo"
                 :data="listTable"
                 :title="tableTitle"
                 @action="subSearchUserList(arguments[0])"></s-table>
      </div>
    </div>
  </div>
</template>
<script>
  import getData from '../../vuex/api/indexApi'
  import xhrUrls from '../../vuex/api/xhrUrls'
  import dateFormat from 'dateformat'
  export default {
    created () {
      this.subSearchUserList()
    },
    data () {
      return {
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
            name: 'Content',
            key: 'message'
          },
          {
            name: 'Created Time',
            key: 'create_time',
            style: 'width: 200px;',
            filter (row) {
              return dateFormat(new Date().setTime(row.create_time), 'yyyy-mm-dd HH:MM:ss')
            }
          }
        ]
      }
    },
    methods: {
      subSearchUserList ({ page = this.tableInfo.page, count = this.tableInfo.rows } = {}) {
        this.listTable.loading = true
        getData(xhrUrls.SEARCH_MSG_INFO, {
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