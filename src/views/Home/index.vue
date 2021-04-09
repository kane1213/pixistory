<template lang="pug">
.p-3
  .item(v-for="item in items" :key="item.text" @click.stop="routerTo(item.path)")
    img(src="/public/recipe1/meats.png")
    .itemLabel {{ item.text }}
</template>



<script lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { defineComponent } from 'vue'
export default defineComponent({
  setup () {
    const items = ref([{ text: 'ローストビーフ', path: 'Story' }])
    const router = useRouter()
    function routerTo (name: string): void {
      router.push({ name })
    }
    return { items, routerTo }
  }

  // import ajax from "/src/utils/ajax";
  // ajax({url: "/product/items ",method: "get"})
  //   .then((res)=>{
  //     console.log(res)
  //   })
})

</script>

<style scoped lang="sass">
  .item
    @apply rounded-lg bg-gray-100 shadow-md
  .itemLabel
    @apply bg-gray-600 text-white rounded-b-lg text-center
</style>
