<template>
  <div class="works" style="padding: 20px; padding-left: 100px;">
    <div class="title line">
      My Works
    </div>
    <s-table v-model="tableInfo"
             :data="listTable"
             :title="tableTitle"
             @action="subSearchUserList(arguments[0])"></s-table>
  </div>
</template>
<script>
  import xhrUrls from '../config/xhrUrls'
  import getData from '../config/indexApi'
  import dateFormat from 'dateformat'
  import { baseUrl } from '../config/config'
  export default {
    props: ['queryCount'],
    created () {
      this.subSearchUserList()
      getData(xhrUrls.CLEAR_MESSAGE_COUNT)
      this.queryCount()
    },
    data () {
      return {
        tableInfo: {
          page: 1,
          rows: 15,
          select: []
        },
        listTable: {
          loading: false,
          data: null
        },
        tableTitle: [
          {
            name: 'Product',
            key: 'productStr',
            style: 'text-align: left;'
          },
          {
            name: 'Material',
            key: 'materialStr',
            style: 'text-align: left;'
          },
          {
            name: 'Size',
            key: 'sizeStr',
            style: 'text-align: left;'
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
                window.location.href = baseUrl + row.url
              },
              filter (row) {
                return row.type === 'review' ? 'Download' : (row.type === 'create' && row.status === 1) ? 'Download' : ''
              },
              tip (row) {
                return (row.type === 'create' && (row.status === 2)) ? '' : row.sh_content
              }
            }, {
              name: 'Edit',
              event: (row) => {
                window.edit = row
                this.$router.push({
                  path: '/main/app'
                })
              },
              filter (row) {
                return (row.type === 'create' && (row.status === 2 || row.status === -1)) ? 'Edit' : ''
              }
            }]
          }
        ]
      }
    },
    methods: {
      subSearchUserList ({ page = this.tableInfo.page, count = this.tableInfo.rows } = {}) {
        this.listTable.loading = true
        getData(xhrUrls.SEARCH_WORK_INFO, {
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
<style lang="scss" type="text/scss">
  .works {
    color: #ffa340;

    .line {
      border-bottom: 1px solid #fff;
    }

    thead {
      border-bottom: 1px solid #fff;
      color: #ffa340;
    }

    .title {
      padding: 10px 0;
      font-size: 26px;
      font-weight: 900;
    }

  }
</style>
