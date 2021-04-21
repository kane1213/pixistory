<template lang="pug">
.home
  .item(v-for="item in items" :key="item.id" @click.stop="routerTo(item)")
    img(:src="item.img")
    .itemLabel {{ item.name }}
</template>



<script lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { defineComponent } from 'vue'
import recipes from '../Story/recipes'
interface Recipe {
  name: string
  compName: string
  id: number
  img: string
}
export default defineComponent({
  setup () {
    const items = recipes.map(item => ({
      id: item.id,
      name: item.name,
      img: item.images[0],
      compName: 'Story'
    }))


    const router = useRouter()
    function routerTo (item: Recipe): void {
      // router.push({ path: `/${item.path}/${item.id}` })
      router.push({ name: item.compName, params: { id: item.id } })
    }
    return { items, routerTo }
  }
})

</script>

<style scoped lang="sass">
  .home
    @apply p-3 mx-auto container grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-2
  .item
    @apply rounded-lg bg-gray-100 shadow-md
  .itemLabel
    @apply bg-gray-600 text-white rounded-b-lg text-center
</style>
