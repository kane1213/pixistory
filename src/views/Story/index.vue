<template lang="pug">
#story(ref="story")
img(src="@/assets/images/bunny.png" ref="bunny" style="display: none;")
</template>

<script lang="ts" setup="props">
import { ref, onMounted } from 'vue'
import * as PIXI from 'pixi.js'
import PhyTouch from 'phy-touch'

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
    app.stage.addChild(_bunny)
    app.ticker.add(() => {
      _bunny.rotation += 0.01
    })
  })

  phytouch = new PhyTouch({
    touch: '#story',
    vertical: true,
    target: { y: 0 },
    property: 'y',
    min: 0,
    max: 2000,
    sensitivity: 1,
    factor: 1,
    moveFactor: 1,
    step: 45,
    bindSelf: false,
    maxSpeed: 2,
    value: 0,
    change (value) {
      console.log(value)
    }
  })


})
</script>
