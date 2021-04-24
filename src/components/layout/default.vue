<template lang="pug">
.default
  .header
    .brand Dk&Sakura
    .links
      router-link.mr-2(to="/home") Home
      router-link.mr-2(to="/about") About
      router-link.mr-2(to="/story") Story
      router-link(to="/roulette") Roulette
  #mainLayout
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
.header
  @apply bg-blue-300 text-white py-1 px-2 flex justify-between
.default
  @apply flex flex-col h-screen
#mainLayout
  @apply max-w-xl flex-1 mx-auto w-full border
</style>
