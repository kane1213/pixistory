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

const material: string[] = ['meats.png', 'ingredient1.jpg', 'ingredient2.jpg']

const imgs = [ ...material.map(str => `/src/assets/images/recipe1/${str}`), ...new Array(38).fill('').map((v,i)=>`/src/assets/images/circles/c${i+1}.png`)]
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
      const _meats = new PIXI.Sprite.from(imgs[0])
      const _meatText = new PIXI.Text('ローストビーフ',{fontSize: 32, fill : 0xff1010, align : 'center'})
      const _ingre1 = new PIXI.Sprite.from(imgs[1])
      const _ingre2 = new PIXI.Sprite.from(imgs[2])


      const _scaleRate = app.renderer.width / _meats.width
      _meats.x = app.renderer.width * .5
      _meats.y = 0
      _meats.anchor.x = .5
      _meats.anchor.y = .5
      _meats.alpha = 0
      _meats.scale.x = _meats.scale.y = _scaleRate
      

      _meatText.x = app.renderer.width - 15
      _meatText.y = app.renderer.height * .5
      _meatText.alpha = 0
      _meatText.anchor.x = 1

      const _scaleRate1 = app.renderer.width / _ingre1.width
      const _scaleRate2 = app.renderer.width / _ingre2.width

      _ingre1.x = _ingre2.x = app.renderer.width * .5
      _ingre1.y = _ingre2.y = app.renderer.height * .5
      _ingre1.anchor.x = _ingre1.anchor.y = _ingre2.anchor.x = _ingre2.anchor.y = .5
      _ingre1.alpha = _ingre2.alpha = 0

      _ingre1.scale.x = _ingre1.scale.y = _scaleRate1
      _ingre2.scale.x = _ingre2.scale.y = _scaleRate2

      

      senceOne.addChild(_meats)
      senceOne.addChild(_meatText)
      senceOne.addChild(_ingre1)
      senceOne.addChild(_ingre2)
      // const _bunny = new PIXI.Sprite.from(imgs[1])  //
      // _bunny.x = 0 // app.renderer.width / 2
      // _bunny.y = app.renderer.height / 2
      // _bunny.anchor.x = 0.5
      // _bunny.anchor.y = 0.5
      // _bunny.alpha = 0
      // senceOne.addChild(_bunny)
      // app.ticker.add(() => {
      //   _bunny.rotation += 0.01
      // })

      const allTimeLine = new TimelineMax({ paused: true })
      const timeline1 = new TimelineMax({ delay: 0.0 })
      const timeline2 = new TimelineMax({ delay: .1 })
      const timeline3 = new TimelineMax({ delay: .2 })
      const timeline4 = new TimelineMax({ delay: .3 })
      const timeline5 = new TimelineMax({ delay: .4 })
      const timeline6 = new TimelineMax({ delay: .5 })
      const timeline7 = new TimelineMax({ delay: .6 })
     
      timeline1.add(new TweenMax(_meats, 0.05, { alpha: 1, y: app.renderer.height * .5 }), 0)
      timeline2.add(new TweenMax(_meatText, 0.05, { alpha: 1, y: app.renderer.height * .75 }), 0)
      timeline3.add(new TweenMax([_meats, _meatText], 0.1, { alpha: 0 }), 0)
      timeline4.add(new TweenMax(_ingre1, 0.05, { alpha: 1 }), 0)
      timeline5.add(new TweenMax(_ingre1, 0.05, { y: 0, alpha: 0 }), 0)
      timeline6.add(new TweenMax(_ingre2, 0.05, { alpha: 1 }), 0)
      timeline7.add(new TweenMax(_ingre2, 0.05, { y: 0, alpha: 0 }), 0)

      allTimeLine.add(timeline1, 0)
      allTimeLine.add(timeline2, 0)
      allTimeLine.add(timeline3, 0)
      allTimeLine.add(timeline4, 0)
      allTimeLine.add(timeline5, 0)
      allTimeLine.add(timeline6, 0)
      allTimeLine.add(timeline7, 0)
      
      
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
