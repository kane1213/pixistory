<template lang="pug">
div.p-2
  select(v-model="typeValue" @change="fetchCards" class="w-full mb-2 py-2")
    option(v-for="(item, i) in typeOptions" :key="item" :value="item.value") {{item.label}}({{item.value}})
  button.bg-blue-500.text-white.p-2.mb-2(@click.stop="addEvent") ADD
  Fields(:heads="fields" :items="cardItems")
    template(v-slot:custom1="{ params }")
      button.bg-blue-200.rounded.px-2.py-05.mr-1(@click.stop="editItem(params.item)") EDIT
      button.bg-blue-200.rounded.px-2.py-05(@click.stop="removeItem(params.item)") REMOVE
  Paginator(:rows="per" :totalRecords="count" @page="changingPage")
</template>

<script lang="ts">
import { defineComponent, reactive, ref, toRefs, computed } from 'vue'
import { getCardList, removeCardById } from '../../service/api.js'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import Fields from '../../components/fields.vue';
interface PageObj {
  page: number, first: number, rows: number, pageCount: number
}

export default defineComponent({
  components: {
    Fields
  },
  setup () {
    const cards = reactive({ items: [], count: 0, page: 1, per: 12 })
    // const fields = ['id', 'title', 'chinese', 'type', 'edit']
    const cardItems = computed(() => cards.items.map(item => ({ ...item, typeName: `${typeObj.value[item.type]}(${item.type})` })))
    const fields = [
      { key: 'id', label: 'ID' },
      { key: 'title', label: '英文' },
      { key: 'chinese', label: '中文' },
      { key: 'typeName', label: '值' },
      { key: 'custom1', label: '編輯', width: 'auto' }
    ]
    const store = useStore()
    const typeValue = ref(0)
    const router = useRouter()
    const typeOptions = [{ label: '全部', text: 'ALL', value: 0 }].concat(store.state.options.type)
    const typeObj = computed(() => typeOptions.reduce((acc, cur) => ({ ...acc, [cur.value]: cur.label }), {}) )
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
      store.commit('setEditingItem', item)
      router.push({ name: 'EditCardItem' })
    }

    function removeItem (item: {id: number, title: string, chinese: string, type: number, image: string, color: string }) {
      removeCardById(item.id)
      setTimeout(fetchCards, 5000)
    }

    function addEvent () {
      router.push({ name: 'CardAdd' })
    }

    fetchCards()

    

    return { ...toRefs(cards), cardItems, fields, changingPage, editItem, removeItem, addEvent, typeValue, fetchCards, typeOptions }
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
