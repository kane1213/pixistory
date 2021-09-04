<template lang="pug">
div
  div.fields(:style="{ gridTemplateColumns: gridWidths }")
    div.th(v-for="th in heads" v-text="th.label" :key="th.key")
    template(v-for="(item, idx) in items")
      div.td(v-for="td in heads" :class="idx % 2 ? 'even': ''" :key="td.key + '_' + idx")
        slot(v-if="td.key === 'custom1'" name="custom1" :params="{ item }")
        font(v-else v-text="item[td.key]")
</template>

<script>
import { defineComponent, ref } from 'vue'
export default defineComponent({
  props: {
    heads: {
      type: Array,
      default: () => []
    },
    items: {
      type: Array,
      default: () => []
    }
  },
  setup (props) {
    const gridWidths = props.heads.reduce((acc, field) => acc.concat(field.width || '1fr') , []).join(' ')
    return { gridWidths }
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
