<template lang="pug">
.default
  .header
    .brand Dk&Sakura
    .links
      router-link.mr-2(to="/home") Home
      router-link.mr-2(to="/about") About
      //- router-link.mr-2(to="/story") Story
      router-link(to="/roulette") Roulette
  #mainLayout(:class="{'cardMode': routeName === 'CardItems'}")
    div(v-text="routeName")
    slot
  footerComp
</template>

<script lang="ts" setup="props">
import { reactive, computed } from 'vue'
import { useRoute } from 'vue-router'
import footerComp from './footer.vue'
const themeColor = reactive({
  main: '#eee',
  sec: '#aaa'
})
const route = useRoute()
const routeName = computed(() => route.name)

console.log(route.name)
</script>
<style lang="sass">
.header
  @apply bg-blue-300 text-white py-1 px-2 flex justify-between
.default
  @apply flex flex-col h-screen
#mainLayout
  @apply max-w-xl flex-1 mx-auto w-full border
  &.cardMode
    max-width: 800px
</style>
