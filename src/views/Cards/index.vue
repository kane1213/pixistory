<template>
  <div>
    <h1>Cards</h1>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { getCardList } from '@/service/api.js'
export default defineComponent({
  setup () {
    console.log(getCardList)
    getCardList('localhost:3000/card/items')
      .then(res => {
        console.log(res)
      })
      .catch(err => {
        console.log(err)
      })
    // console.log(getCardList)
    return {}
  }
})
</script>
