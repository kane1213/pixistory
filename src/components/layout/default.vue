<template lang="pug">
.default
  .header.bg-gray-900.text-white.py-1.px-2.flex.justify-between
    .brand BRAND
    .links
      router-link.mr-2(to="/home") Home
      router-link(to="/about") About
  .flex-1
    slot
  footerComp
</template>

<script lang="ts" setup="props">
import { reactive } from 'vue'
import footerComp from './footer.vue'
const themeColor = reactive({
  main: '#eee',
  sec: '#aaa'
})
</script>
<style lang="sass">
.default
  @apply flex flex-col h-screen
</style>
