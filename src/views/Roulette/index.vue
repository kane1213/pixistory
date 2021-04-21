<template lang="pug">
#roulette(ref="roulette")
div HERE
</template>
<script lang="ts">
import { computed, defineComponent, ref, reactive, onMounted } from 'vue'
import * as PIXI from 'pixi.js'

export default defineComponent({
  setup () {
    const roulette = ref()

    onMounted(() => {

      const mayLayout: HTMLElement = document.getElementById('mainLayout')!
      const { clientWidth, clientHeight } = mayLayout
      const app = new PIXI.Application({
        width: clientWidth,
        height: clientHeight,
        transparent: true
      });
      const senceOne = new PIXI.Container()
      app.stage.addChild(senceOne)
      
      const colors = [
        0xff0000, 0x00FF00, 0x0000FF, 0x555555, 0x666666, 0x777777, 0x888888, 0x999999
      ]

      const graphics = new PIXI.Graphics();
      // graphics.beginFill(0xDE3249);
      // graphics.drawRect(0, 0, 100, 100);
      // graphics.endFill();
      const num = 4

      const arcAngle = Math.PI / (num / 2)
      const startAngle = arcAngle * 1
      const outsideRadius = 100
      const insideRadius = 0
      const position = 0
      for (let i = 0; i < num; i++) {
        let angle = startAngle + i * arcAngle
        graphics.beginFill(colors[i])

        // arc 1
        // graphics.moveTo(position + outsideRadius * Math.cos(angle), position + outsideRadius * Math.sin(angle));
        graphics.arc(position, position, outsideRadius, angle, angle + arcAngle, false)
        graphics.arc(position, position, insideRadius, angle + arcAngle, angle, true)
        graphics.endFill()
      }





      senceOne.addChild(graphics)
      // senceOne.pivot.x = senceOne.width * .5
      // senceOne.pivot.y = senceOne.height * .5
      // senceOne.x = clientWidth * .5
      // senceOne.y = clientHeight * .5
      senceOne.x = 100
      senceOne.y = 100

      if (roulette.value) {
        const element: HTMLDivElement = roulette.value!
        element.appendChild(app.view)
      }
    })

    return { roulette }
  }
})
</script>

<style>

</style>
