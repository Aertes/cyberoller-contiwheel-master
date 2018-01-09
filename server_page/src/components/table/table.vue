<template>
  <div class="table-box box noneBox">
    <div class="overlay" v-if="data.loading">
      <i class="fa fa-refresh fa-spin"></i>
    </div>
    <div class="tabale-t-box">
      <div class="tabale-t-content" :style="{minWidth: tableValue.width}">
        <table class="table table-bordered table-striped">
          <thead>
          <tr>
            <th style="width: 38px;">
              <s-checkbox type="checkbox" v-model="checkAll"></s-checkbox>
            </th>
            <th v-for="t of title" :style="t.style">{{t.name}}</th>
          </tr>
          </thead>
          <tbody>
          <template v-if="data && data.data && data.data.rows">
            <tr v-for="(row, index) of data.data.rows">
              <td style="width: 38px;">
                <s-checkbox type="checkbox" v-model="check[index]"></s-checkbox>
              </td>
              <td v-for="t of title" :style="t.style">
                <template v-if="t.buttons">
                  <template v-for="b of t.buttons">
                    <a :class="b.buttonClass" @click="b.event(row)" style="cursor: pointer;">
                      <i :class="b.iconClass"></i>
                      {{b.filter ? b.filter(row) : b.name}}
                    </a>
                  </template>
                </template>
                <template v-else>
                  {{t.filter ? t.filter(row) : row[t.key]}}
                </template>
              </td>
            </tr>
          </template>
          </tbody>
        </table>
      </div>
    </div>
    <div class="row">
      <div class="col-sm-12 col-md-6">
        <ul class="pagination" style="margin: 0px 0 10px">
          <li class="paginate_button" v-if="tableValue.page > 2" @click="goPage(1)">
            <a href="javascript:;">
              <i class="fa fa-angle-double-left"></i>
            </a>
          </li>
          <li class="paginate_button" v-if="tableValue.page > 1" @click="goPage(tableValue.page - 1)">
            <a href="javascript:;">
              <i class="fa fa-angle-left"></i>
            </a>
          </li>
          <template v-for="index of pageLength">
            <li class="paginate_button" :class="{disabled: (pageFirst + index) == tableValue.page}"
                @click="goPage(pageFirst + index)">
              <a href="javascript:;">
                {{pageFirst + index}}
              </a>
            </li>
          </template>
          <li class="paginate_button" v-if="tableValue.page < allPage" @click="goPage(tableValue.page + 1)">
            <a href="javascript:;">
              <i class="fa fa-angle-right"></i>
            </a>
          </li>
          <li class="paginate_button" v-if="tableValue.page < allPage - 1" @click="goPage(allPage)">
            <a href="javascript:;">
              <i class="fa fa-angle-double-right"></i>
            </a>
          </li>
        </ul>
      </div>
      <div class="col-sm-12 col-md-6">
        <div class="dataTables_info pull-right">
          Total{{allPage}}Pages,
          Jump To
          <input type="text" class="form-control">
          Page, Rows of page:
          <div class="selectBox">
            <s-select v-model="tableValue.rows" :noSearch="true">
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </s-select>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  const initValue = (value) => {
    let tableValue = {
      page: 1,
      rows: 10,
      select: [],
      ...value
    }
    return tableValue
  }

  const initCheck = data => {
    if (!data || !data.rows) {
      return {}
    }
    let checkObj = {}
    data.rows.forEach((row, i) => {
      checkObj[i] = false
    })
    return checkObj
  }

  export default {
    props: ['value', 'data', 'title'],
    created () {
      this.tableValue = initValue(this.value)
      this.check = initCheck(this.data.data)
    },
    mounted () {
      this.$watch(function () {
        return this.tableValue.page + this.tableValue.rows
      }, function () {
        if (this.tableValue.page > this.allPage) {
          this.tableValue.page = 1
        }
        this.$emit('action', {
          page: this.tableValue.page,
          rows: this.tableValue.rows
        })
      })
    },
    data  () {
      return {
        check: {},
        tableValue: {
          rows: 10,
          page: 1,
          select: []
        },
        checkAll: false,
        changeByAll: true
      }
    },
    methods: {
      goPage (pNo) {
        this.tableValue.page = pNo
      }
    },
    computed: {
      allPage () {
        if (!this.data.data || !this.data.data.rows) {
          return 0
        }
        return Math.ceil(this.data.data.total / this.tableValue.rows)
      },
      pageFirst () {
        let last = this.allPage - this.tableValue.page - 2
        let firstPage = this.tableValue.page - 2
        if (last < 0) {
          firstPage += last
        }
        firstPage = firstPage < 1 ? 1 : firstPage
        return firstPage - 1
      },
      pageLength () {
        if (this.allPage > 5) {
          return 5
        }
        return this.allPage
      }
    },
    watch: {
      checkAll (value) {
        // 设置全选
        if (this.changeByAll) {
          for (let key of Object.keys(this.check)) {
            this.check[key] = value
          }
        } else {
          this.changeByAll = true
        }
      },
      data: {
        deep: true,
        handler (value) {
          this.check = initCheck(value.data)
        }
      },
      check: {
        deep: true,
        handler () {
          let reCheck = []
          for (let key of Object.keys(this.check)) {
            if (this.check[key]) {
              reCheck.push(this.data.data.rows[key])
            }
          }
          // 判断是不是需要全选
          if ((reCheck.length === Object.keys(this.check).length) !== this.checkAll) {
            this.changeByAll = false
            this.checkAll = reCheck.length === Object.keys(this.check).length
          }
          this.tableValue.select = reCheck
        }
      },
      tableValue: {
        deep: true,
        handler () {
          this.$emit('input', this.tableValue)
        }
      }
    }
  }
</script>
<style rel="stylesheet/scss" scoped>
  .tabale-t-box {
    width: 100%;
    overflow-x: auto;
    overflow-scrolling: touch;
  }

  .tabale-t-content {
    min-width: 800px;
  }

  table {
    overflow: hidden;
    table-layout: fixed;
  }

  tbody {
    max-height: 600px;
    overflow-x: auto;
  }

  th {
    font-weight: 600;
  }

  td, th {
    width: 100%;
    word-break: keep-all;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: center;
  }

  input {
    width: 50px;
    display: inline-block;
    padding: 5px;
  }

  .dataTables_info .selectBox {
    position: relative;
    top: -1px;
    width: 80px;
    padding: 5px;
    display: inline-block;
  }
</style>
