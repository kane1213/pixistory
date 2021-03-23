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
  app.loader.add('bunny', '/src/assets/images/bunny.png').load((loader, resources) => {
    console.log({ loader });
    const _bunny = new PIXI.Sprite(resources.bunny.texture)
    _bunny.x = app.renderer.width / 2
    _bunny.y = app.renderer.height / 2
    _bunny.anchor.x = 0.5
    _bunny.anchor.y = 0.5
    app.stage.addChild(_bunny)
    app.ticker.add(() => {
      _bunny.rotation += 0.01
    })
  })
})
</script>
