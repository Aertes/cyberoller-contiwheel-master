<template>
  <div>
    <input type="text" class="form-control" ref="datepicker" readonly>
  </div>
</template>
<script>
  import $ from '../../plugins/jQuery/jquery-2.2.3.min'
  import dateFormat from 'dateformat'
  import '../../plugins/datepicker/bootstrap-datepicker'
  export default {
    props: ['value', 'format'],
    mounted: function () {
      let value
      if (this.value) {
        value = typeof this.value === 'object' ? dateFormat(this.value, this.format) : this.value
      }
      $(this.$refs.datepicker).val(value).datepicker({
        autoclose: true,
        format: this.format
      }).on('changeDate', e => {
        if (e.date) {
          this.model = dateFormat(e.date, this.format)
          this.$emit('input', dateFormat(e.date, this.format))
        } else {
          this.$emit('input', '')
        }
      }).on('clearDate', () => {
        this.$emit('input', '')
      })
    },
    beforeDestroy () {
      $(this.$refs.datepicker).datepicker('destroy')
    }
  }
</script>
