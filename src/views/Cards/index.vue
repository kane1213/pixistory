<template>
  <div>
    <h1>Cards</h1>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import axios from 'axios'
export default defineComponent({
  setup () {
    axios.get('localhost:3000/card/items')
      .then(res => {
        console.log(res)
      })
      .catch(err => {
        console.log(err)
      })
    return {}
  }
})
</script>
