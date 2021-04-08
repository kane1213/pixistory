<template lang="pug">
h1 HOME PAGE
div {{ counter }}
button.bg-black.text-white.px-2.rounded-lg(@click.stop="addCount") ADD COUNTER
</template>



<script lang="ts">
import { ref } from 'vue'
import { defineComponent } from 'vue'
export default defineComponent({
  setup () {
    const counter = ref(0)
    function addCount () {
      counter.value += 1
    }
    return { counter, addCount }
  }

  // import ajax from "/src/utils/ajax";
  // ajax({url: "/product/items ",method: "get"})
  //   .then((res)=>{
  //     console.log(res)
  //   })
})

</script>
