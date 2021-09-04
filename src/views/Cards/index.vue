<template lang="pug">
div.p-2
  select(v-model="typeValue" @change="fetchCards" class="w-full mb-2 py-2")
    option(v-for="(item, i) in typeList" :key="item" :value="i") {{item}}
  button.bg-blue-500.text-white.p-2.mb-2(@click.stop="addEvent") ADD
  div.card-item(v-for="item in items" :key="item['id']")
    template(v-for="field in fields")
      div.item(v-if="field === 'edit'" :key="item['id'] + '' + field")
        button.bg-purple-800.text-white.rounded.px-1(@click.stop="editItem(item)") edit
      div.item( v-else="" v-text="item[field]" :key="item['id'] + '_' + field")
  Paginator(:rows="per" :totalRecords="count" @page="changingPage")
</template>

<script lang="ts">
import { defineComponent, reactive, ref, toRefs } from 'vue'
import { getCardList } from '../../service/api.js'
import { useRouter } from 'vue-router'

interface PageObj {
  page: number, first: number, rows: number, pageCount: number
}

export default defineComponent({
  // components: {
  //   pagination
  // },
  setup () {
    const cards = reactive({ items: [], count: 0, page: 1, per: 12 })
    const fields = ['id', 'title', 'chinese', 'type', 'edit']
    const typeList = ['ALL', 'ANIMAL', 'FOOD', 'ENVIRONMENT']
    const typeValue = ref(0)
    const router = useRouter()
    function fetchCards () {
      getCardList(cards.page, cards.per, typeValue.value > 0 ? `&type=${typeValue.value}` : '')
        .then((res: any) => {
          cards.items = res.data.items
          cards.count = res.data.count
        })
        .catch(err => {
          console.log(err)
        })
    }

    function changingPage (item: PageObj) {
      cards.page = item.page + 1
      // cards.page = page
      fetchCards()
    }

    function editItem (item: {id: number, title: string, chinese: string, type: number, image: string, color: string }) {
      const { id, title, color, image } = item
      router.push({ name: 'CardItem', params: { id, title, color, image, cards: JSON.stringify(cards.items), pagination: JSON.stringify({ page: cards.page, per: cards.per }) }})
    }

    function addEvent () {
      router.push({ name: 'CardAdd' })
    }

    fetchCards()

    return { ...toRefs(cards), fields, changingPage, editItem, addEvent, typeList, typeValue, fetchCards }
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
