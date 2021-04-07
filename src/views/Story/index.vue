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

const material: string[] = ['meats.png', 'ingredient1.png', 'ingredient2.png', ...new Array(6).fill(1).map((v, i) => `step${v + i}.png`)]
const imgs = material.map(str => `/src/assets/images/recipe1/${str}`)
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

      const _sprites: PIXI.Sprite[] = imgs.map((path):PIXI.Sprite => new PIXI.Sprite.from(path))
      const _meatText = new PIXI.Text('ローストビーフ',{fontSize: 32, fill : 0xff1010, align : 'center'})
      const { width: appWidth, height: appHeight } = app.renderer
      _sprites.forEach((sprite,idx) => {
        senceOne.addChild(sprite)
        if (idx > 0) {
          sprite.alpha = 0
          sprite.y = 0
        } else {
          sprite.y = appHeight * .5
        }
        if (sprite.width > appWidth) sprite.scale.x = sprite.scale.y = appWidth / sprite.width
        sprite.anchor.x = sprite.anchor.y = .5
        sprite.x = appWidth * .5
        
      })

      _meatText.x = app.renderer.width - 15
      _meatText.y = app.renderer.height * .5
      _meatText.alpha = 0
      _meatText.anchor.x = 1      
      senceOne.addChild(_meatText)
      // senceOne.addChild(_bunny)
      // app.ticker.add(() => {
      //   _bunny.rotation += 0.01
      // })
      let _delay = 0
      const stepDelay = 1 / ((_sprites.length - 1) * 2 + 1 )
      const allTimeLine = new TimelineMax({ paused: true })
      const timelines = new Array(2).fill('').map((v, i) => new TimelineMax({delay: (_delay++) * stepDelay}))

      // timelines[0].add(new TweenMax(_sprites[0], stepDelay, { alpha: 1, y: app.renderer.height * .5 }), 0)
      timelines[0].add(new TweenMax(_meatText, stepDelay, { alpha: 1, y: appHeight * .75 }), 0)
      timelines[1].add(new TweenMax([_sprites[0], _meatText], stepDelay, { alpha: 0, y: appHeight }), 0)
      _sprites.slice(1, _sprites.length).forEach((sprite,sidx) => {
        const _timeline1 = new TimelineMax({delay: (_delay++) * stepDelay})
        timelines.push(_timeline1)
        _timeline1.add(new TweenMax(sprite, stepDelay * .6, { y: appHeight * .5, alpha: 1 }), 0)

        if (sidx < _sprites.length - 2) {
          const _timeline2 = new TimelineMax({delay: (_delay++) * stepDelay})
          timelines.push(_timeline2)
          _timeline2.add(new TweenMax(sprite, stepDelay, { y: appHeight, alpha: 0 }), 0)
        }
      })

      timelines.forEach(_time => {
        allTimeLine.add(_time, 0)
      })
      
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
