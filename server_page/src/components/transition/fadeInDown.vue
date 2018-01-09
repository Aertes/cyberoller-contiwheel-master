<template>
  <div>
    <transition
      @enter="enter"
      @after-enter="afterEnter"
      @leave="leave"
      :css="false"
    >
      <slot></slot>
    </transition>
  </div>
</template>
<script>
  import velocity from 'velocity-animate'

  export default {
    methods: {
      enter (el, done) {
        let height = el.offsetHeight + 'px'
        el.style.height = 0 + 'px'
        velocity(el, {
          height: height
        }, {
          duration: 150,
          complete: done
        })
      },
      afterEnter (el) {
        el.style.height = 'auto'
      },
      leave (el, done) {
        velocity(el, {
          height: 0
        }, {
          duration: 150,
          complete: done
        })
      }
    }
  }
</script>
