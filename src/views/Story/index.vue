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
const imgs = ['/src/assets/images/recipe.jpg', '/src/assets/images/bunny.png', ...new Array(38).fill('').map((v,i)=>`/src/assets/images/circles/c${i+1}.png`)]
var phytouch = null
const { clientWidth, clientHeight } = document.getElementById('mainLayout')
const app = new PIXI.Application({
  width: clientWidth,
  height: clientHeight,
  transparent: true
});

onMounted(() => {
  // app.renderer.resize(clientWidth, clientHeight)
  // app.renderer.autoResize = true
  


  const senceOne = new PIXI.Container()
  app.stage.addChild(senceOne)

  // app.loader.onProgress
  //   .add((event)=>{
  //     console.log(event.progress)
  //   })
  const max = 2000
  app.loader
    .add(imgs)
    .load((loader, resources) => {
      console.log({loader, resources})

      const _bunny = new PIXI.Sprite.from(imgs[1])  //
      _bunny.x = 0 // app.renderer.width / 2
      _bunny.y = app.renderer.height / 2
      _bunny.anchor.x = 0.5
      _bunny.anchor.y = 0.5
      _bunny.alpha = 0
      senceOne.addChild(_bunny)
      app.ticker.add(() => {
        _bunny.rotation += 0.01
      })

      const allTimeLine = new TimelineMax({ paused: true })
      const timelineOne = new TimelineMax({ delay: 0.0 })
      const timelineTwo = new TimelineMax({ delay: 0.2 })
      const circleSpr = new PIXI.Sprite.from('/src/assets/images/circles/c1.png')
      circleSpr.position.set(clientWidth * .5, clientHeight * .5)
      circleSpr.anchor.x = circleSpr.anchor.y = 0.5
      circleSpr.alpha = 0
      senceOne.addChild(circleSpr)
      timelineOne.add(new TweenMax(_bunny, 0.3, { alpha: 1, x: app.renderer.width * .5 }), 0)
      timelineTwo.add(new TweenMax(circleSpr, 0.1, { alpha: 1 }), 0)
      allTimeLine.add(timelineOne, 0)
      allTimeLine.add(timelineTwo, 0)
      
      
      phytouch = new PhyTouch({
        touch: '#story',
        reverse: true,
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
          allTimeLine.seek(value / max)
          circleAni(value)
        }
      })

      function circleAni (value: number) {
        if (value / max > 0.3) {
          const imgIdx = Math.floor((value / max - .3) / .3 * 38)
          if (imgIdx < 38 && imgIdx >= 0) {
            circleSpr.texture = new PIXI.Texture.from(`/src/assets/images/circles/c${imgIdx + 1}.png`)
          }
          
        }
      }

    })

    

  


  story.value.appendChild(app.view)
  
  
  
  // app.loader.add('bunny', '/src/assets/images/bunny.png').load((loader, resources) => {
  //   const _bunny = new PIXI.Sprite(resources.bunny.texture)
  //   _bunny.x = 0 // app.renderer.width / 2
  //   _bunny.y = app.renderer.height / 2
  //   _bunny.anchor.x = 0.5
  //   _bunny.anchor.y = 0.5
  //   _bunny.alpha = 0
  //   app.stage.addChild(_bunny)
  //   app.ticker.add(() => {
  //     _bunny.rotation += 0.01
  //   })

  
  //   const timelineTwo = new TimelineMax({ delay: 0.2 })
  //   // const tweenMaxOne = new TweenMax(_bunny, 0.5, { alpha: 1, x: 200 })
  //   // const tweenMaxTwo = new TweenMax(_bunny, 0.5, { x: 200 })
    
  
  //   app.stage.addChild(circleSpr)
  //   timelineOne.add(new TweenMax(_bunny, 0.5, { alpha: 1, x: app.renderer.width * .5 }), 0)
  //   timelineTwo.add(new TweenMax(circleSpr, 0.5, { alpha: 1 }), 0)
  //   // timelineOne.add(tweenMaxTwo, 0)
  //   allTimeLine.add(timelineOne, 0)
  //   allTimeLine.add(timelineTwo, 1)
    
    const graphics = new PIXI.Graphics()
    
  //   // const circlesSpr = new Array(38).fill('').map((v,i) => new PIXI.Texture(
  //   //   new PIXI.Texture.from(`/src/assets/images/circles/c${i+1}.png`),
  //   //   new PIXI.Rectangle(0, 0, 800, 800)
  //   // ))
  //   // const animateSpr = new PIXI.AnimatedSprite(circlesSpr);
  //   //  animateSpr.position.set((clientWidth - 800) * .5, (clientHeight - 800) * .5)
  //   //  animateSpr.animationSpeed = 0.1
  //   //  animateSpr.play()
  //   //  app.stage.addChild(animateSpr)

})
</script>

<style scoped lang="sass">
#story
  background: transparent url('/src/assets/images/bgrounds/page_bg.jpg') repeat left top
</style>
