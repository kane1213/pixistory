<template lang="pug">
#roulette(ref="rouletteDom")
</template>
<script lang="ts">
import { computed, defineComponent, ref, reactive, onMounted } from 'vue'
import * as PIXI from 'pixi.js'
import { TweenMax, TimelineMax, Linear, Strong } from 'gsap'
interface RoulettePrize {
  label: string,
  occupy: number,
  accum: number
}
export default defineComponent({
  setup () {
    const rouletteDom = ref()
    const generateColors = (num: Number): number[] => new Array(num).fill(0).map(() => Math.floor(Math.random()*16777215))
    const rouletteSecs: RoulettePrize[] = [
      { label: 'prizeOne', occupy: 4, accum: 0 },
      { label: 'prizeTwo', occupy: 1, accum: 0 },
      { label: 'prizeThree', occupy: 1, accum: 0 },
      { label: 'prizeFour', occupy: 2, accum: 0 },
      { label: 'prizeFive', occupy: 3, accum: 0 },
      { label: 'prizeSix', occupy: 2, accum: 0 },
      { label: 'prizeSeven', occupy: 1, accum: 0 },
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
      // const startAngle = arcAngle * 1
      const outsideRadius = 90 // clientWidth * .5
      const insideRadius = 10
      const position = 0
      const colors = generateColors(num)
      let accumNum = 0
      let accumAngle = 0
      rouletteSecs.forEach((sec, idx) => {
        // if (idx > 1) return
        const _container: PIXI.Container = new PIXI.Container()
        const _graphics: PIXI.Graphics = new PIXI.Graphics()
        const _text: PIXI.Text = new PIXI.Text(`${idx + 1}`)

        const _previewOccupy =  idx > 0  ? rouletteSecs[idx - 1].occupy : 0
        accumNum += _previewOccupy

        sec.accum = accumNum
        _graphics.beginFill(colors[idx])
        const selfAngle = (arcAngle * sec.occupy / 2) 
        const base = Math.PI / 180 * 90
        _graphics.arc(position, position, outsideRadius, -selfAngle - base, selfAngle - base, false)
        _graphics.arc(position, position, insideRadius, selfAngle - base, -selfAngle - base, true)
        _graphics.endFill()
        _text.anchor.x = _text.anchor.y = .5
        _text.y = -120
        _container.addChild(_graphics)
        _container.addChild(_text)
        const _defaultAngle = idx > 0 ? rouletteSecs[0].occupy * .5 : 0
        _container.rotation = Math.PI / 180 * (360 / num * (idx > 0 ? _defaultAngle + sec.occupy * .5 : 0))
        roulette.addChild(_container)
      })

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
          // const prizeSec: RoulettePrize = rouletteSecs[Math.floor(Math.random() * rouletteSecs.length)]
          // roulette.rotation = roulette.rotation % 360
          const _children = allTimeLine.getChildren()
          _children.forEach(child => {
            allTimeLine.remove(child)
          })

          allTimeLine.clear()
          const prize: number = Math.floor(Math.random() * rouletteSecs.length)
          const { occupy, accum } = rouletteSecs[prize]
          const half = 360 / num * occupy * (Math.random() * .95)
          const accums = 360 / num * accum

          const lottery = new TweenMax(roulette, 1, { rotation: Math.PI / 180 * (360 * 3 -90 - half - accums ), ease: Linear.easeIn })
          allTimeLine.add(lottery)
          roulette.rotation = 0
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
