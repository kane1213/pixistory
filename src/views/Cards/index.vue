<template lang="pug">
div.p-2
  //- div.card-item(v-for="item in items" :key="item&&item.id ? item.id:''")
  //-   template(v-for="field in fields")
  //-     div.item(v-if="field === 'edit'" :key="item.id + '' + field")
  //-       button.bg-purple-800.text-white.rounded.px-1(@click.stop="editItem(item)") edit
  //-     div.item( v-else="" v-text="item[field]" :key="item.id + '' + field")
  //- pagination(:count="count" :page="page" :per="per" @changePage="changingPage")
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue'
import { getCardList } from '../../service/api.js'
import { useRouter } from 'vue-router'
import pagination from '@/components/pagination.vue'
export default defineComponent({
  components: {
    pagination
  },
  setup () {
    const cards = reactive({ items: [], count: 0, page: 1, per: 12 })
    const fields = ['id', 'title', 'chinese', 'type', 'edit']
    const router = useRouter()
    function fetchCards () {
      getCardList(cards.page, cards.per)
        .then((res:any) => {
          cards.items = res.data.items
          cards.count = res.data.count
        })
        .catch(err => {
          console.log(err)
        })
    }

    function changingPage (page: number) {
      cards.page = page
      fetchCards()
    }

    function editItem (item: {id: number, title: string, chinese: string, type: number, image: string, color: string }) {
      const { id, title, color } = item
      router.push({ name: 'CardItem', params: { id, title, color, cards: JSON.stringify(cards.items), pagination: JSON.stringify({ page: cards.page, per: cards.per }) }})
    }

    fetchCards()

    return { ...toRefs(cards), fields, changingPage, editItem }
  }
})
</script>

<style lang="sass" scoped>
.card-item
  grid-template-columns: 40px 1fr 1fr 40px 60px
  @apply grid border-l border-b
  &:nth-child(1)
    @apply border-t
  .item
    @apply p-1 text-center border-r

</style>
