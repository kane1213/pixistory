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
const app = new PIXI.Application({ transparent: true});

onMounted(() => {

  story.value.appendChild(app.view)
  // app.renderer.autoResize = true;
  const { clientWidth, clientHeight } = document.getElementById('mainLayout')
  app.renderer.resize(clientWidth, clientHeight)
  app.loader.add('bunny', '/src/assets/images/bunny.png').load((loader, resources) => {
    const _bunny = new PIXI.Sprite(resources.bunny.texture)
    _bunny.x = 0 // app.renderer.width / 2
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
    const timelineTwo = new TimelineMax({ delay: 0.0 })
    // const tweenMaxOne = new TweenMax(_bunny, 0.5, { alpha: 1, x: 200 })
    // const tweenMaxTwo = new TweenMax(_bunny, 0.5, { x: 200 })
    
    const circleSpr = new PIXI.Sprite.from('/src/assets/images/circles/c1.png')
    circleSpr.position.set(clientWidth * .5, clientHeight * .5)
    circleSpr.anchor.x = circleSpr.anchor.y = 0.5
    circleSpr.alpha = 0
    app.stage.addChild(circleSpr)

    timelineOne.add(new TweenMax(_bunny, 0.2, { alpha: 1, x: app.renderer.width * .5 }), 0)
    timelineTwo.add(new TweenMax(circleSpr, 0.2, { alpha: 1 }), 0)
    // timelineOne.add(tweenMaxTwo, 0)
    allTimeLine.add(timelineOne, 0)
    allTimeLine.add(timelineTwo, 0)
    
    const graphics = new PIXI.Graphics()
    
    // const circlesSpr = new Array(38).fill('').map((v,i) => new PIXI.Texture(
    //   new PIXI.Texture.from(`/src/assets/images/circles/c${i+1}.png`),
    //   new PIXI.Rectangle(0, 0, 800, 800)
    // ))
    // const animateSpr = new PIXI.AnimatedSprite(circlesSpr);
    //  animateSpr.position.set((clientWidth - 800) * .5, (clientHeight - 800) * .5)
    //  animateSpr.animationSpeed = 0.1
    //  animateSpr.play()
    //  app.stage.addChild(animateSpr)

    app.stage.addChild(graphics)




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
        imgSchene(value)
        whiteCircle(value)
        allTimeLine.seek(value / max)
      }
    })

    function imgSchene (value) {
      if (value / max < 0.2) return;
      const imgIdx = Math.floor(((value / max - .2) / .3 * 38));
      if (imgIdx >= 38) return
      circleSpr.texture = new PIXI.Texture.from(`/src/assets/images/circles/c${imgIdx}.png`)
    }

    function whiteCircle (value) {
      graphics.clear()
      if (value / max < 0.5) return;
      const radius = (value / max - .5) / .3 * 800
      if (radius > 800) return
      
      graphics.beginFill(0xFFFFFF)
      graphics.drawCircle(clientWidth * .5, clientHeight * .5, radius)
      graphics.endFill()
    }
  })

  

  

})
</script>
