<template lang="pug">
#roulette(ref="rouletteDom")
</template>
<script lang="ts">
import { computed, defineComponent, ref, reactive, onMounted } from 'vue'
import * as PIXI from 'pixi.js'
import { TweenMax, TimelineMax, Linear, Strong } from 'gsap'
interface RoulettePrize {
  label: string,
  occupy: number
}
export default defineComponent({
  setup () {
    const rouletteDom = ref()
    const generateColors = (num: Number): number[] => new Array(num).fill(0).map(() => Math.floor(Math.random()*16777215))
    const rouletteSecs: RoulettePrize[] = [
      { label: 'prizeOne', occupy: 1 },
      { label: 'prizeTwo', occupy: 4 },
      { label: 'prizeThree', occupy: 1 },
      { label: 'prizeFour', occupy: 2 },
    ]
    onMounted(() => {
      // const containers: PIXI.Container[] = []
      const mayLayout: HTMLElement = document.getElementById('mainLayout')!
      const { clientWidth, clientHeight } = mayLayout
      const app = new PIXI.Application({
        width: clientWidth,
        height: clientHeight,
        transparent: true
      });
      const roulette: PIXI.Container = new PIXI.Container()
      app.stage.addChild(roulette)
      const num = rouletteSecs.reduce((acc, sec):number => acc + sec.occupy ,0)
      
      const arcAngle = Math.PI / (num / 2)
      const startAngle = arcAngle * 1
      const outsideRadius = 30 // clientWidth * .5
      const insideRadius = 2
      const position = 0
      const colors = generateColors(num)

      rouletteSecs.forEach((sec, idx) => {
        const _container: PIXI.Container = new PIXI.Container()
        const _graphics: PIXI.Graphics = new PIXI.Graphics()
        const _previous: number = idx > 0
          ? rouletteSecs[idx - 1].occupy
          : 0
        _graphics.beginFill(colors[idx])
        _graphics.arc(position, position, outsideRadius, 0, arcAngle * sec.occupy, false)
        _graphics.arc(position, position, insideRadius, arcAngle * sec.occupy, 0, true)
        _graphics.endFill()
        _container.addChild(_graphics)
        _container.rotation = Math.PI / 180 * (360 / num * sec.occupy)
        roulette.addChild(_container)
      })

      // for (let i = 0; i < num; i++) {
      //   const _container = new PIXI.Container()
      //   // containers.push(_container)
      //   const _graphics = new PIXI.Graphics();
      //   // let angle = startAngle + i * arcAngle
      //   let angle = Math.PI / 180 * (-90 - (360 / num / 2))
      //   _graphics.beginFill(colors[i])
      //   _graphics.arc(position, position, outsideRadius, angle, angle + arcAngle, false)
      //   _graphics.arc(position, position, insideRadius, angle + arcAngle, angle, true)
      //   _graphics.endFill()
      //   _container.addChild(_graphics)
      //   _container.rotation = Math.PI / 180 * (360 / num * i)
        
      //   roulette.addChild(_container)
      // }
      
      roulette.x = clientWidth * .5
      roulette.y = clientHeight * .5
      if (rouletteDom.value) {
        const element: HTMLDivElement = rouletteDom.value!
        element.appendChild(app.view)
      }

      // const loop = new TweenMax(senceOne, 5, { rotation: arcAngle * (num), ease: Linear.easeNone })

      // const lottery = new TweenMax(senceOne, 5, { rotation: Math.PI / 180 * 360, ease: Linear.easeIn })

       const allTimeLine = new TimelineMax()  // { repeat: -1 }
      // allTimeLine.add(loop)
      // allTimeLine.add(lottery)
      // allTimeLine.play(1)

      roulette.interactive = roulette.buttonMode = true
      roulette.addListener('click', function () {
        if (!allTimeLine.isActive()) {
          // allTimeLine.pause()
          // allTimeLine.remove(loop)
          // allTimeLine._repeat = 0
          // allTimeLine.resume()
          allTimeLine.add(new TweenMax(roulette, 5, { rotation: Math.PI / 180 * 360, ease: Linear.easeIn }))
          allTimeLine.play()
        } else {
          
        }
      })

    })

    return { rouletteDom }
  }
})
</script>

<style>

</style>
