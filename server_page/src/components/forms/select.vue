<template>
  <select ref="select" class="form-control" :style="style" :multiple="!!multiple" :disable="disable">
    <slot></slot>
  </select>
</template>
<script>
  import '../../plugins/select2/select2'
  import $ from '../../plugins/jQuery/jquery-2.2.3.min'

  export default {
    props: ['value', 'style', 'multiple', 'disable', 'noSearch'],
    data () {
      return {
        select: null,
        oldValue: ''
      }
    },
    updated () {
      if (!this.oldValue && !this.select.attr('multiple')) {
        let value = this.select.find('option:first-child').attr('value')
        this.oldValue = value
        this.$emit('input', value)
      }
      this.select.val(this.value)
      this.select.select2('destroy')
      let optionData = {
        width: '100%'
      }
      if (this.noSearch) {
        optionData.minimumResultsForSearch = Infinity
      }
      this.select.select2(optionData).on('select2:select', () => {
        this.$emit('input', this.select.val())
        this.oldValue = this.value
      }).on('select2:unselect', () => {
        this.oldValue = this.value
        this.$emit('input', this.select.val())
      })
    },
    mounted () {
      this.select = $(this.$refs.select)
      this.select.val(this.value)
      this.oldValue = this.value
      let optionData = {
        width: '100%'
      }
      if (this.noSearch) {
        optionData.minimumResultsForSearch = Infinity
      }
      this.select.select2(optionData).on('select2:select', () => {
        this.$emit('input', this.select.val())
        this.oldValue = this.value
      }).on('select2:unselect', () => {
        this.oldValue = this.value
        this.$emit('input', this.select.val())
      })
    },
    beforeDestroy () {
      this.select.select2('destroy')
    },
    watch: {
      value (value) {
        this.select.val(value).trigger('change.select2')
      }
    }

  }

</script>