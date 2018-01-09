<template>
  <select ref="select" class="form-control" :style="style" :multiple="!!multiple">
    <slot></slot>
  </select>
</template>
<script>
  import $ from '../../plugins/jQuery/jquery-2.2.3.min'

  export default {
    props: ['value', 'style', 'multiple', 'title'],
    data () {
      return {
        select: null
      }
    },
    mounted () {
      this.select = $(this.$refs.select)
      this.select.val(this.value)
      this.select.select2({
        minimumResultsForSearch: Infinity,
        placeholder: this.title,
        width: '100%'
      }).on('select2:select', () => {
        this.$emit('input', this.select.val())
      }).on('select2:unselect', () => {
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