<template lang="pug">
#story(ref="story")
img(src="@/assets/images/bunny.png" ref="bunny" style="display: none;")
</template>

<script lang="ts" setup="props">
import { ref, onMounted } from 'vue'
import * as PIXI from 'pixi.js'
import PhyTouch from 'phy-touch'

import { TweenMax, TimelineMax } from 'gsap'

const story = ref(null)
const bunny = ref(null)
var phytouch = null
const app = new PIXI.Application();
onMounted(() => {
  story.value.appendChild(app.view)
  app.loader.add('bunny', '/src/assets/images/bunny.png').load((loader, resources) => {
    const _bunny = new PIXI.Sprite(resources.bunny.texture)
    _bunny.x = 200 // app.renderer.width / 2
    _bunny.y = app.renderer.height / 2
    _bunny.anchor.x = 0.5
    _bunny.anchor.y = 0.5
    _bunny.alpha = 0
    app.stage.addChild(_bunny)
    app.ticker.add(() => {
      _bunny.rotation += 0.01
    })

    const allTimeLine = new TimelineMax({ paused: true })
    const timelineOne = new TimelineMax({ delay: 0.0 })
    const tweenMaxOne = new TweenMax(_bunny, 0.5, { alpha: 1 })
    timelineOne.add(tweenMaxOne, 0)
    allTimeLine.add(timelineOne, 0)

    const max = 2000
    phytouch = new PhyTouch({
      touch: '#story',
      vertical: true,
      target: { y: 0 },
      property: 'y',
      min: 0,
      max,
      sensitivity: 1,
      factor: 1,
      moveFactor: 1,
      step: 45,
      bindSelf: false,
      maxSpeed: 2,
      value: 0,
      change (value: number) {
        // console.log(value)
        allTimeLine.seek(value / max)
      }
    })

  })

  

  

})
</script>
