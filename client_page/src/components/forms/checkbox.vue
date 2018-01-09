<template>
  <input ref="check"

         :type="type || 'radio'"
         class="flat-red"
         :disabled="disabled">
</template>
<script>
  import $ from '../../plugins/jQuery/jquery-2.2.3.min'

  export default {
    props: ['type', 'disabled', 'value', 'id'],
    data () {
      return {
        input: null
      }
    },
    mounted () {
      this.input = $(this.$refs.check).iCheck({
        checkboxClass: 'icheckbox_flat-green',
        radioClass: 'iradio_flat-green'
      }).on('ifChecked', () => {
        this.$emit('input', true)
      }).on('ifUnchecked', () => {
        this.$emit('input', false)
      })
      this.input.iCheck(this.value ? 'check' : 'uncheck')
    },
    watch: {
      value (newValue) {
        this.input.iCheck(newValue ? 'check' : 'uncheck')
      }
    }
  }
</script>
