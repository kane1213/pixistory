<template lang="pug">
#item(ref="itemDom")
</template>
<script lang="ts">
import { computed, defineComponent, ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import * as PIXI from 'pixi.js'
import { TweenMax, TimelineMax, Linear, Strong } from 'gsap'
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
    const generateColors = (num: Number): number[] => new Array(num).fill(0).map(() => Math.floor(Math.random()*16777215))
    // const colors: string[] = ['#388659', '#52aa5e', '#52aa8a', '#3aaed8', '#2bd9fe', '#3edcfe', '#50dffe', '#60e2fe', '#6ee5fe', '#7be7fe']
    const colors: number[] = [0x388659, 0x52aa5e, 0x52aa8a, 0x3aaed8, 0x2bd9fe, 0x3edcfe, 0x50dffe, 0x60e2fe, 0x6ee5fe, 0x7be7fe]
    const itemContainer: PIXI.Container = new PIXI.Container()
    // PIXI.preserveDrawingBuffer:true

    if (Object.keys(route.params).length === 0) router.replace({ name: 'CardItems' })

    onMounted(() => {
      // const images = ['/recipe1/meats.png', '/recipe2/poteto1.png', '/recipe1/meats.png', '/recipe2/poteto1.png', '/recipe1/meats.png', '/recipe2/poteto1.png', '/recipe1/meats.png', '/recipe2/poteto1.png']
      
      const images = [`/cards/${route.params.title}.png`]
      const mayLayout: HTMLElement = document.getElementById('mainLayout')!
      const { clientWidth, clientHeight } = mayLayout
      const app = new PIXI.Application({
        width: clientWidth,
        height: clientWidth,
        transparent: true,
        preserveDrawingBuffer: true
      });
      
      app.stage.addChild(itemContainer)
      app.loader
        .add(images)
        .load((loader, resources) => {
          const _img: PIXI.Sprite = new PIXI.Sprite(PIXI.Texture.from(images[0]))
          const _graphics: PIXI.Graphics = new PIXI.Graphics()
          const _hexColor = route.params.color || '#FFFFFF'
          function HEXToVBColor(rrggbb: string) {
            rrggbb = rrggbb.replace('#', '')
            const bbggrr = rrggbb.substr(4, 2) + rrggbb.substr(2, 2) + rrggbb.substr(0, 2);
            return parseInt(bbggrr, 16);
          }

          _graphics.beginFill(HEXToVBColor(_hexColor))
          _graphics.drawRect(0, 0, 800, 800)
          _graphics.endFill()
          _graphics.x = -400
          _graphics.y = -400
          _img.anchor.x = .5
          _img.anchor.y = .5

          itemContainer.addChild(_graphics)
          itemContainer.addChild(_img)
          itemContainer.x = clientWidth * .5
          itemContainer.y = clientWidth * .5
          if (itemDom.value) {
            const element: HTMLDivElement = itemDom.value!
            element.appendChild(app.view)

            // setTimeout(() => {
            //   console.log(app.renderer.view.toDataURL('image/jpeg'))
            // }, 1000)
          }

          
        })
    })

    
    return { itemDom }
  }
})
</script>
