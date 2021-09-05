<template lang="pug">
layout
  router-view.flex-1
</template>

<script lang="ts" setup="props">
import { reactive, computed, ref } from 'vue'
import { useStore } from 'vuex'
import layout from '@/components/layout/default.vue'
// import { detectIsMobile } from '@/service/detectMobile.js'
const themeColor = reactive({
  main: '#eee',
  sec: '#aaa'
})

const store = useStore()
const timeout = ref(0)
// window.addEventListener('resize', () => {
//   if (!timeout.value) {
//     timeout.value = setTimeout(() => {
//       store.dispatch('actSetDeviceMode', detectIsMobile())
//       timeout.value = 0
//     }, 100)
//   }
// })
if (store.state.options.type.length === 0) {
  store.dispatch('actSetTypeOptions')
}


</script>
<style lang="sass">
@import '@/scss/main.scss'
.main-color
  background-color: v-bind('themeColor.main')
.sec-color
  background-color: v-bind('themeColor.sec')
.thir-colore
  background-color: #00ff00

</style>
