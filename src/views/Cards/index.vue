<template lang="pug">
div.p-2
  button.bg-blue-500.text-white.p-2.mb-2(@click.stop="addEvent") ADD
  div.card-item(v-for="item in items" :key="item.id")
    template(v-for="field in fields")
      div.item(v-if="field === 'edit'" :key="item.id + '' + field")
        button.bg-purple-800.text-white.rounded.px-1(@click.stop="editItem(item)") edit
      div.item( v-else="" v-text="item[field]" :key="item.id + '' + field")
  pagination(:count="count" :page="page" :per="per" @changePage="changingPage")
  //- div {{ page }} - {{ per }} - {{ count }}
  //- Pagination(:records="count" :v-model="page" :per-page="per" @paginate="changingPage")
  //- <pagination v-model="page" :records="500" :per-page="25" @paginate="myCallback"/>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue'
import { getCardList } from '@/service/api.js'
import { useRouter } from 'vue-router'
// import Pagination from 'v-pagination-3'
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
        .then(res => {
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

    function addEvent () {
      router.push({ name: 'CardAdd' })
    }

    fetchCards()

    return { ...toRefs(cards), fields, changingPage, editItem, addEvent }
  }
})
</script>

<style lang="sass" scoped>
.card-item
  grid-template-columns: 40px 1fr 1fr 40px 60px
  @apply grid border-l border-b border-t
  &:nth-child(1)
    @apply border-t
  .item
    @apply p-1 text-center border-r

</style>
