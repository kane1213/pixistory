<template lang="pug">
#story(ref="story")
img(src="@/assets/images/bunny.png" ref="bunny" style="display: none;")
</template>

<script lang="ts" setup="props">
import { ref, onMounted } from 'vue'
import * as PIXI from 'pixi.js'
const story = ref(null)
const bunny = ref(null)
const app = new PIXI.Application();
onMounted(() => {
  story.value.appendChild(app.view)
  app.loader.add('bunny', bunny.value.src).load((loader, resources) => {
    const bunny = new PIXI.Sprite(resources.bunny.texture)
    bunny.x = app.renderer.width / 2
    bunny.y = app.renderer.height / 2
    bunny.anchor.x = 0.5
    bunny.anchor.y = 0.5
    console.log(bunny)
    app.stage.addChild(bunny)
    app.ticker.add(() => {
      bunny.rotation += 0.01
    })
  })
})
</script>
