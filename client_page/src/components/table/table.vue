<template>
  <div class="table-box noneBox tableView" style="color: #fff">
    <div class="tabale-t-box">
      <div class="tabale-t-content" :style="{minWidth: tableValue.width}" style="min-height: 400px;">
        <table class="table table-bordered table-striped">
          <thead>
          <tr>
            <!--<th style="width: 38px;">-->
            <!--<s-checkbox type="checkbox" v-model="checkAll"></s-checkbox>-->
            <!--</th>-->
            <th v-for="t of title" :style="t.style">{{t.name}}</th>
          </tr>
          </thead>
          <tbody>
          <template v-if="data && data.data && data.data.rows">
            <tr v-for="(row, index) of data.data.rows">
              <!--<td style="width: 38px;">-->
              <!--<s-checkbox type="checkbox" v-model="check[index]"></s-checkbox>-->
              <!--</td>-->
              <td v-for="t of title" :style="[t.style, {overflow : t.buttons ? 'inherit' : 'none'}]"
                  style="position: relative" class="td_btn">
                <template v-if="t.buttons">
                  <template v-for="b of t.buttons">
                    <a :class="b.buttonClass" @click="b.event(row)" style="cursor: pointer;">
                      <i :class="b.iconClass"></i>
                      {{b.filter ? b.filter(row) : b.name}}
                    </a>
                    <div style="position: absolute;display:none;" class="tip" v-if="b.tip && b.tip(row)">
                      {{b.tip(row)}}
                    </div>
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
          <!--Total {{allPage}} Pages,-->
          <!--Jump To-->
          <!--<input type="text" class="form-control" style="background: #ffa340; border: none;height: 21px">-->
          <!--Page, -->
          Rows of page:
          <div class="selectBox">
            <s-select v-model="tableValue.rows" :noSearch="true" style="height: 21px">
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
<style>
  .table-box .select2-container--default .select2-selection--single, .select2-selection .select2-selection--single {
    height: 21px;
  }

  .table-box .select2-container--default .select2-selection--single .select2-selection__arrow {
    height: 18px;
  }

  .table-box .select2-container--default .select2-selection--single .select2-selection__rendered {
    line-height: 21px;
  }
</style>
<style rel="stylesheet/scss" type="text/scss" lang="scss">
  .tableView {

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

    .pagination > li > a {
      border: none;
      color: #000;
      background: #ffa340;
      height: 21px;
      line-height: 21px;
      padding: 2px 12px;
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

    .table-striped > tbody > tr:nth-of-type(odd) {
      background: none !important;
    }

    .table-bordered, .table-bordered > thead > tr > th, .table-bordered > tbody > tr > th, .table-bordered > tfoot > tr > th, .table-bordered > thead > tr > td, .table-bordered > tbody > tr > td, .table-bordered > tfoot > tr > td {
      border: none !important;
    }

    .td_btn {
      cursor: pointer;
    }
    .td_btn:hover .tip {
      position: absolute;
      top: 40px;
      right: 0;
      background: #fff;
      width: 400px;
      color: #333;
      text-align: left;
      padding: 10px;
      z-index: 100;
      display: block !important;
    }

  }
</style>
