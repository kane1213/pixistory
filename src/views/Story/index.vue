<template lang="pug">
#story(ref="story")
.loading(v-if="loading.show") {{ loading.percentage }}
</template>


<script lang="ts">
import { computed, defineComponent, ref, reactive, onMounted } from 'vue'
import * as PIXI from 'pixi.js'
import PhyTouch from 'phy-touch'
import { TweenMax, TimelineMax } from 'gsap'
import { useRoute } from 'vue-router'
import recipes from './recipes'

export interface RecipeData {
  id: number
  name: string
  images: string[]
}


export default defineComponent({
  setup () {
    const loading = reactive({
      show: true,
      num: 0,
      percentage: computed(() => `${Math.floor(loading.num)}%`)
    })
    const route = useRoute()
    const story = ref()
    var phytouch = null
    const recipeList: RecipeData[] = recipes
    const recipeId: number = !route.params || !route.params.id
      ? 1
      : Array.isArray(route.params.id)
        ? parseInt(route.params.id.join(''))
        : parseInt(route.params.id)
    const recipe:RecipeData = recipes.find(item => item.id === recipeId) || { id: 1, name: 'none', images: [] }
    onMounted(() => {
      const mayLayout = document.getElementById('mainLayout')!
      const { clientWidth, clientHeight } = mayLayout
      const app = new PIXI.Application({
        width: clientWidth,
        height: clientHeight,
        transparent: true
      });
      const senceOne = new PIXI.Container()
      const senceContainers: PIXI.Container[] = []
      app.stage.addChild(senceOne)
      app.loader.onProgress
        .add((event)=>{
          loading.num = event.progress
        })
      const max = (recipe.images.length - 6) * 500
      app.loader
        .add(recipe.images)
        .load((loader, resources) => {
          loading.show = false
          const _sprites: PIXI.Sprite[] = recipe.images.map((path:any):PIXI.Sprite => PIXI.Sprite.from(path))
          const _meatText = new PIXI.Text(recipe.name,{fontSize: 32, fill : 0xff1010, align : 'center'})
          const { width: appWidth, height: appHeight } = app.renderer
          _sprites.forEach((sprite,idx) => {

            let lastContainer: PIXI.Container
            if (idx < 3) {
              senceOne.addChild(sprite)
            } else {
              if (idx % 2 === 1) { 
                senceContainers.push(new PIXI.Container())
                app.stage.addChild(senceContainers.slice(-1)[0])
              }
              lastContainer = senceContainers.slice(-1)[0]
              lastContainer.addChild(sprite)
            }
            if (idx > 0 && idx < 3) {
              sprite.alpha = 0
              sprite.y = appHeight
              sprite.x = appWidth * .5
              sprite.anchor.x = sprite.anchor.y = .5
            } else if (idx > 3) {
              if (lastContainer!) {
                sprite.y = idx % 2 === 0
                  ? _sprites[idx - 1].height
                  : 0

                if (idx % 2 === 0) {
                  sprite.alpha = 0
                }

                if (idx % 2 === 0) {
                  lastContainer.y = appHeight + lastContainer.height * .85
                  lastContainer.x = appWidth * .5
                  lastContainer.pivot.x = lastContainer.width * .5
                  lastContainer.pivot.y = lastContainer.height *.5
                  sprite.y = _sprites[idx - 1].height * 2
                } else {
                  // sprite.anchor.x = .5
                }

              }
            } else if (idx === 0) {
              sprite.y = appHeight * .5
              sprite.x = appWidth * .5
              sprite.anchor.x = sprite.anchor.y = .5
            }
            if (sprite.width > appWidth) sprite.scale.x = sprite.scale.y = appWidth / sprite.width
            
            
          })

          _meatText.x = app.renderer.width - 15
          _meatText.y = app.renderer.height * .5
          _meatText.alpha = 0
          _meatText.anchor.x = 1
          senceOne.addChild(_meatText)
          
          let _delay = 0
          const stepDelay = 1 / ((_sprites.length - 1) * 2 + 1 )
          const allTimeLine = new TimelineMax({ paused: true })
          const timelines = new Array(2).fill('').map((v, i) => new TimelineMax({delay: (_delay++) * stepDelay}))

          // timelines[0].add(new TweenMax(_sprites[0], stepDelay, { alpha: 1, y: app.renderer.height * .5 }), 0)
          timelines[0].add(new TweenMax(_meatText, stepDelay * .5, { alpha: 1, y: (appHeight + _sprites[0].height) * .5 }), 0)
          timelines[1].add(new TweenMax([_sprites[0], _meatText], stepDelay, { alpha: 0, y: appHeight }), 0)
          
          
          senceContainers.forEach((container, cidx) => {
            const _timeline1 = new TimelineMax({delay: (_delay++) * stepDelay})
            timelines.push(_timeline1)
            _timeline1.add(new TweenMax(container, stepDelay * .6, { y: appHeight * .5 }), 0)

            const _timelineSpr = new TimelineMax({delay: (_delay++) * stepDelay})
            timelines.push(_timelineSpr)
            _timelineSpr.add(new TweenMax(container.children[1], stepDelay * .6, { alpha: 1, y: container.children[0]['height'] }), 0)

            if (cidx < senceContainers.length - 1) {
              const _timeline2 = new TimelineMax({delay: (_delay++) * stepDelay})
              timelines.push(_timeline2)
              _timeline2.add(new TweenMax(container, stepDelay, { y: 0, alpha: 0 }), 0)
            }

            
          })
          
          
          
          // _sprites.slice(1, _sprites.length).forEach((sprite,sidx) => {
          //   const _timeline1 = new TimelineMax({delay: (_delay++) * stepDelay})
          //   timelines.push(_timeline1)
          //   _timeline1.add(new TweenMax(sprite, stepDelay * .6, { y: appHeight * .5, alpha: 1 }), 0)

          //   if (sidx < _sprites.length - 2) {
          //     const _timeline2 = new TimelineMax({delay: (_delay++) * stepDelay})
          //     timelines.push(_timeline2)
          //     _timeline2.add(new TweenMax(sprite, stepDelay, { y: 0, alpha: 0 }), 0)
          //   }
          // })

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

          //       function circleAni (value: number) {
          //         if (value / max > 0.3) {
          //           const imgIdx = Math.floor((value / max - .3) / .3 * 38)
          //           if (imgIdx < 38 && imgIdx >= 0) {
          //             circleSpr.texture = new PIXI.Texture.from(`/src/assets/images/circles/c${imgIdx + 1}.png`)
          //           }
          //         }
          //       }
          //     })
          if (story.value) {
            const element: HTMLDivElement = story.value!
            element.appendChild(app.view)
          }
          
        })
    
    })
    // return { story }
    return { story, loading }
  }
})
</script>

<style scoped lang="sass">
#story
  background: transparent url('/src/assets/images/bgrounds/page_bg.jpg') repeat left top
.loading
  @apply fixed rounded-lg text-black py-2 px-4
  left: 50%
  top: 50%
  background-color: rgba(255, 255, 255, .85)
  transform: translate(-50%, -50%)
</style>
