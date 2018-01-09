<template>
  <input ref="check"
         :type="type || 'radio'"
         class="flat-red"
         :name="name"
         :disabled="disabled">
</template>
<script>
  import '../../plugins/iCheck/icheck'
  import $ from '../../plugins/jQuery/jquery-2.2.3.min'

  export default {
    props: ['type', 'disabled', 'value', 'id', 'name', 'checked'],
    data () {
      return {
        input: null
      }
    },
    mounted () {
      this.input = $(this.$refs.check).iCheck({
        checkboxClass: 'icheckbox_flat-yellow',
        radioClass: 'iradio_flat-yellow'
      }).on('ifChecked', () => {
        this.$emit('input', true)
        this.$emit('change', true)
      }).on('ifUnchecked', () => {
        this.$emit('change', false)
        this.$emit('input', false)
      })
      this.value ? this.input.iCheck(this.value ? 'check' : 'uncheck') : this.input.iCheck(this.checked ? 'check' : 'uncheck')
    },
    watch: {
      value (newValue) {
        this.input.iCheck(newValue ? 'check' : 'uncheck')
      }
    }
  }
</script>
