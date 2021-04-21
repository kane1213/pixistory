<template lang="pug">
#roulette(ref="roulette")
</template>
<script lang="ts">
import { computed, defineComponent, ref, reactive, onMounted } from 'vue'
import * as PIXI from 'pixi.js'
import { TweenMax, TimelineMax } from 'gsap'

export default defineComponent({
  setup () {
    const roulette = ref()
    const generateColors = (num: Number): number[] => new Array(num).fill(0).map(() => Math.floor(Math.random()*16777215))

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
      const num = 8
      
      const graphics = new PIXI.Graphics();
      const arcAngle = Math.PI / (num / 2)
      const startAngle = arcAngle * 1
      const outsideRadius = clientWidth * .5
      const insideRadius = 50
      const position = 0
      const colors = generateColors(num)
      for (let i = 0; i < num; i++) {
        let angle = startAngle + i * arcAngle
        graphics.beginFill(colors[i])
        graphics.arc(position, position, outsideRadius, angle, angle + arcAngle, false)
        graphics.arc(position, position, insideRadius, angle + arcAngle, angle, true)
        graphics.endFill()
      }
      senceOne.addChild(graphics)
      senceOne.x = clientWidth * .5
      senceOne.y = clientHeight * .5
      if (roulette.value) {
        const element: HTMLDivElement = roulette.value!
        element.appendChild(app.view)
      }

      const loop = new TweenMax(senceOne, 1000, { rotation: 3600 })
      const allTimeLine = new TimelineMax({ paused: true })
      allTimeLine.add(loop)
      setTimeout(() => {
        // allTimeLine.seek(100)
        allTimeLine.play()

      }, 1000)
    })

    return { roulette }
  }
})
</script>

<style>

</style>
