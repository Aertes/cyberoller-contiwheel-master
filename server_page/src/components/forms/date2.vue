<template>
  <div>
    <input type="text" class="form-control pull-right" ref="datepicker" readonly>
  </div>
</template>
<script>
  import $ from '../../plugins/jQuery/jquery-2.2.3.min'
  import dateFormat from 'dateformat'
  import { toDate } from '../../helper/Date'
  import '../../plugins/daterangepicker/daterangepicker'
  export default {
    props: ['value', 'format'],
    mounted: function () {
      let options = {
        locale: {
          format: this.format
        }
      }
      if (this.value) {
        if (this.value.startDate) {
          options.startDate = this.value.startDate
        }
        if (this.value.endDate) {
          options.endDate = this.value.endDate
        }
      }
      $(this.$refs.datepicker).daterangepicker(options, (start, end) => {
        let endDate = toDate(dateFormat(new Date(end), 'yyyymmdd') + '235959')
        this.$emit('input', {
          startDate: this.format ? dateFormat(new Date(start), this.format) : new Date(start),
          endDate: this.format ? dateFormat(new Date(endDate), this.format) : new Date(endDate)
        })
      })
    }
  }
</script>