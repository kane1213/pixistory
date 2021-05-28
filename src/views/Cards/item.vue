<template lang="pug">
#item(ref="itemDom")
div.flex.items-center
  div.upload-image.mr-2(@click.stop="uploadImageEvent") UPLOAD
  div
    input(type="color" v-model="color")
    button.bg-blue-800.rounded.text-white.px-2(@click.stop="changeColor") CHANGE COLOR
</template>
<script lang="ts">
import { defineComponent, ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import * as PIXI from 'pixi.js'
import { updateItemImageColorById } from '@/service/api.js' // updateItemImageById, updateItemColorById
interface RoulettePrize {
  label: string,
  occupy: number,
  accum: number
}
export default defineComponent({
  setup () {
    const route = useRoute()
    const router = useRouter()
    const itemDom = ref()
    const color = ref(route.params.color)
    const generateColors = (num: Number): number[] => new Array(num).fill(0).map(() => Math.floor(Math.random()*16777215))
    const itemContainer: PIXI.Container = new PIXI.Container()
    const canvasSize = reactive({ width: 0, height: 0 })
    const images = [`/cards/${route.params.title}.png`]


    if (Object.keys(route.params).length === 0) router.replace({ name: 'CardItems' })
    let app
    onMounted(() => {
      // const images = ['/recipe1/meats.png', '/recipe2/poteto1.png', '/recipe1/meats.png', '/recipe2/poteto1.png', '/recipe1/meats.png', '/recipe2/poteto1.png', '/recipe1/meats.png', '/recipe2/poteto1.png']
      
      
      const mainLayout: HTMLElement = document.getElementById('mainLayout')!
      // const { clientWidth, clientHeight } = mayLayout
      canvasSize.width = mainLayout.clientWidth
      canvasSize.height = mainLayout.clientHeight
      app = new PIXI.Application({
        width: canvasSize.width,
        height: canvasSize.width,
        transparent: true,
        preserveDrawingBuffer: true
      });
      
      app.stage.addChild(itemContainer)
      app.loader
        .add(images)
        .load((loader, resources) => {
          renderCanvas()
        })
    })

    function renderCanvas () {
      const _img: PIXI.Sprite = new PIXI.Sprite(PIXI.Texture.from(images[0]))
      const _graphics: PIXI.Graphics = new PIXI.Graphics()
      function HEXToVBColor(rrggbb: string) {
        rrggbb = rrggbb.replace('#', '')
        // const bbggrr = rrggbb.substr(4, 2) + rrggbb.substr(2, 2) + rrggbb.substr(0, 2);
        return parseInt(rrggbb.replace('#', ''), 16);
      }

      _graphics.beginFill(HEXToVBColor(color.value || '#FFFFFF'))
      _graphics.drawRect(0, 0, 800, 800)
      _graphics.endFill()
      _graphics.x = -400
      _graphics.y = -400
      
      _img.anchor.x = .5
      _img.anchor.y = .5

      itemContainer.addChild(_graphics)
      itemContainer.addChild(_img)
      itemContainer.x = canvasSize.width * .5
      itemContainer.y = canvasSize.width * .5
      if (itemDom.value) {
        const element: HTMLDivElement = itemDom.value!
        element.appendChild(app.view)

        // setTimeout(() => {
        //   console.log(app.renderer.view.toDataURL('image/jpeg'))
        // }, 1000)
      }
    }

    function uploadImageEvent () {
      updateItemImageColorById(route.params.id, color.value, app.renderer.view.toDataURL('image/jpeg', 0.78))
        .then(res => {
          console.log(res)
        })
        .catch(err => {
          console.log(err)
        })
    }

    function changeColor () {
      // updateItemColorById(route.params.id, color.value)
      //   .then(res => {
      //     console.log(res)
      //   })
      //   .catch(err => {
      //     console.log(err)
      //   })
      renderCanvas()
    }
    
    return { itemDom, uploadImageEvent, color, changeColor }
  }
})
</script>


<style lang="sass" scoped>
.upload-image
  width: 100px
  @apply rounded bg-blue-800 my-3 ml-3 cursor-pointer text-white text-center
</style>

