<template>
  <div>
    <div class="item line">
      <span>
        line
      </span>
      <span>
        line
      </span>
    </div>
    <template>
      <s-tree :data=""></s-tree>
    </template>
  </div>
</template>
<script>
  export default {
    props: ['data']
  }
</script>