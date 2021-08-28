<template lang="pug">
div.pagination
  div.inner
    div.left(v-text="'<'" @click.stop="arrowEvent(-1)")
    div(v-for="p in pages" v-text="p" :key="p" :class="{ 'bg-purple-500 text-white': page === p }" @click.stop="pageEvent(p)")
    div.right(v-text="'>'" @click.stop="arrowEvent(1)")
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
export default defineComponent({
  props: {
    count: { 
      type: Number,
      default: 0
    },
    page: {
      type: Number,
      default: 1
    },
    per: {
      type: Number,
      default: 10
    }
  },
  // emits: ['changingPage'],
  setup (props, context) {
    const pages = computed(() => { 
      const pageNumber = props.count > 0 ? Math.ceil(props.count / props.per) : 0
      if (pageNumber === 0) return 
      const middle = props.page === 1
        ? 2
        : props.page === pageNumber
          ? props.page - 1
          : props.page
      return [middle - 1, middle, middle + 1]
    })

    function pageEvent (page: number) {
      context.emit('changePage', page)
    }

    function arrowEvent (deti: number) {
      const newPage = props.page + deti
      if (pages.value) {
        if (newPage === 0 || newPage > pages.value.slice(-1)[0]) return
        context.emit('changePage', newPage)
      }
    }

    return { pages, pageEvent, arrowEvent }
  }
})
</script>

<style lang="sass" scoped>
.pagination
  @apply flex justify-center
  .inner
    @apply flex mt-2 mx-auto
    > div
      @apply px-2 border cursor-pointer

</style>
