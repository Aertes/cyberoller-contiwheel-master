<template>
  <div style="position: relative;width: 100%;">
    <div>
      <transition
        name="custom-classes-transition"
        enter-active-class="animated fadeInUp"
        leave-active-class="animated fadeOutNow"
      >
        <slot></slot>
      </transition>
    </div>
  </div>
</template>
<style>
  .fadeOutNow{
    display: none;
  }
</style>
