<template lang="pug">
.home
  .item(v-for="item in items" :key="item.text" @click.stop="routerTo(item.path)")
    img(:src="item.img")
    .itemLabel {{ item.text }}
</template>



<script lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { defineComponent } from 'vue'
export default defineComponent({
  setup () {
    const items = ref([
      { text: 'ローストビーフ', path: 'Story', img: '/recipe1/meats.png' },
      { text: 'ローストビーフ', path: 'Story', img: '/recipe1/meats.png' },
      { text: 'ローストビーフ', path: 'Story', img: '/recipe1/meats.png' },
      { text: 'ローストビーフ', path: 'Story', img: '/recipe1/meats.png' }
    ])
    const router = useRouter()
    function routerTo (name: string): void {
      router.push({ name })
    }
    return { items, routerTo }
  }
})

</script>

<style scoped lang="sass">
  .home
    @apply p-3 mx-auto container grid sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-2
  .item
    @apply rounded-lg bg-gray-100 shadow-md
  .itemLabel
    @apply bg-gray-600 text-white rounded-b-lg text-center
</style>
