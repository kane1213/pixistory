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
    // const items = ref([])
    const items = computed(() => store.state.options.type.map(type => ({ title: type.text, chinese: type.label, type: type.value })))
    const gridWidths = fields.reduce((acc, field) => acc.concat(field.width || '1fr') , []).join(' ')
    const store = useStore()

    // async function fetchCategoryOptions () {
    //   const { data } = await getCategories()

    //   store.commit('setTypeOptions', data.items)
    //   items.value = data.items

    // }

    function itemClickEvent (item = {}) {
      store.commit('setEditingItem', item)
      router.push({ name: 'CategoryItem' })
    }

    if (store.state.options.type.length === 0) {
      store.dispatch('actSetTypeOptions')
    }
    // fetchCategoryOptions()


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
