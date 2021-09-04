<template lang="pug">
button.bg-blue-800.text-white.p-2(@click.stop="itemClickEvent") 新增
Fields(:heads="fields" :items="items")
  template(v-slot:custom1="{ params }")
    button.bg-blue-200.rounded.px-2.py-05(@click.stop="itemClickEvent(params.item)") EDIT
</template>

<script>
import { defineComponent, ref, computed, reactive, onMounted } from 'vue'
import { getCategories } from '../../service/api.js';
import { useRouter } from 'vue-router';
import Fields from '../../components/fields.vue';
import { useStore } from 'vuex'
export default defineComponent({
  components: { Fields },
  setup () {
    const fields = [
      { key: 'chinese', label: '中文' },
      { key: 'title', label: '英文' },
      { key: 'type', label: '值' },
      { key: 'custom1', label: '編輯', width: 'auto' }
    ]
    const router = useRouter()
    const items = ref([])
    const gridWidths = fields.reduce((acc, field) => acc.concat(field.width || '1fr') , []).join(' ')
    const store = useStore()

    async function fetchCategoryOptions () {
      const { data } = await getCategories()
      items.value = data.items
      // items.value = [
      //   { text: 'Animals', label: '動物', value: 1 },
      //   { text: 'Foods', label: '食物', value: 2 },
      //   { text: 'Environment', label: '環境', value: 3 }
      // ]
    }

    function itemClickEvent (item = {}) {
      store.commit('setEditingItem', item)
      router.push({ name: 'CategoryItem' })
    }

    fetchCategoryOptions()


    return { items, fields, gridWidths, itemClickEvent }
  }
})
</script>

<style lang="sass" scoped>
$borderColor: #eee
.fields
  @apply grid
  border-top: 1px solid $borderColor
  border-left: 1px solid $borderColor
  .th
    @apply text-center p-2 bg-black text-white
    border-right: 1px solid $borderColor
    border-bottom: 1px solid $borderColor
  .td
    @apply text-center p-2 bg-gray-50
    border-right: 1px solid $borderColor
    border-bottom: 1px solid $borderColor
    &.even
      @apply bg-gray-100
</style>
