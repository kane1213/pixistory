<template lang="pug">
div.input-fields(v-for="ipField in inputFields" :key="ipField.key")
  div.flex
    div.w-20 {{ ipField.label }}
    input(v-if="['title', 'chinese', 'type', 'id'].includes(ipField.key)" type="text" :disabled="ipField.disabled" v-model="item[ipField.key]")
    template(v-else-if="ipField.key==='image'")
      input(v-if="!item[ipField.key]" type="file" @change="inputToBase64Event")
      img(v-else :src="item[ipField.key]")
</template>

<script>
import { defineComponent, ref } from 'vue' // , reactive, onMounted
import { useStore } from 'vuex'
export default defineComponent({
  setup () {
    const inputFields = [
      { key: 'id', label: 'ID', disabled: true },
      { key: 'title', label: '英文名', disabled: false },
      { key: 'chinese', label: '中文名', disabled: false },
      { key: 'type', label: 'TYPE', disabled: false },
      { key: 'image', label: 'IMAGE', type: 'file', disabled: false },
    ]
    const item = ref({})
    const store = useStore()
    if (store.state.editingItem !== null) {
      Object.entries(store.state.editingItem).forEach(([key, value]) => {
        item.value[key] = value
      })
    }

    function toBase64 (file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
      })
    }

    async function inputToBase64Event (input) {
      const _img = new Image
      const canvas = document.createElement('canvas')
      _img.src = await toBase64(input.target.files[0])

      // var ctx = canvas.getContext('2d')
      // ctx.drawImage(_img, 0, 0)
      _img.onload = () => {

        const _max = 800
        let { width, height } = _img

        if (width > height) {
          if (width > _max) {
            height *= _max / width
            width = _max
          }
        } else {
          if (height > _max) {
            width *= _max / height
            height = _max
          }
        }

        canvas.width = width
        canvas.height = height

        var ctx = canvas.getContext('2d')
        ctx.drawImage(_img, 0, 0, width, height)
        item.value.image = canvas.toDataURL()

      }
      



      // async function Main() {
      //   const file = document.querySelector('#myfile').files[0];
      //   console.log(await toBase64(file));
      // }

      // Main();



    }
    return { inputFields, inputToBase64Event, item }
  }
})
</script>

<style lang="sass" scoped>
.input-fields
  @apply pt-1 px-1
  > div
    > input[type=text]
      @apply w-full border
</style>
