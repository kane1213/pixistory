<template lang="pug">
#item(ref="itemDom")
div.flex.items-center
  div.upload-image.mr-2(@click.stop="uploadImageEvent") UPLOAD
  div
    input(type="color" v-model="color" @change="renderCanvas")
</template>
<script lang="ts">
import { defineComponent, ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import * as PIXI from 'pixi.js'
import { updateItemImageColorById } from '@/service/api.js' // updateItemImageById, updateItemColorById
interface RoulettePrize {
  label: string,
  occupy: number,
  accum: number
}
export default defineComponent({
  setup () {
    const route = useRoute()
    const router = useRouter()
    const itemDom = ref()
    const currentSize = ref(600)
    const wheelTimeStamp = ref(0)
    const color = ref(route.params.color)
    const generateColors = (num: Number): number[] => new Array(num).fill(0).map(() => Math.floor(Math.random()*16777215))
    const itemContainer: PIXI.Container = new PIXI.Container()
    const canvasSize = reactive({ width: 0, height: 0 })
    const directions = reactive({x: .5, y: .5 })
    const images = [`/cards/${route.params.title}.png`, '/cards/mountains.jpg']
    const selectedTarget = ref()
    const startPostion = reactive({ x: 0, y: 0, imgx: 0, imgy: 0})

    if (Object.keys(route.params).length === 0) router.replace({ name: 'CardItems' })
    let app
    onMounted(() => {
      const mainLayout: HTMLElement = document.getElementById('mainLayout')!
      // const { clientWidth, clientHeight } = mayLayout
      canvasSize.width = mainLayout.clientWidth
      canvasSize.height = mainLayout.clientHeight
      app = new PIXI.Application({
        width: canvasSize.width,
        height: canvasSize.width,
        transparent: true,
        preserveDrawingBuffer: true
      });
      
      app.stage.addChild(itemContainer)
      app.loader
        .add(images)
        .load((loader, resources) => {
          renderCanvas()
        })
    })

    

    function renderCanvas () {
      const _img: PIXI.Sprite = new PIXI.Sprite(PIXI.Texture.from(images[0]))
      const _view: PIXI.Sprite = new PIXI.Sprite(PIXI.Texture.from(images[1]))
      const _background: PIXI.Graphics = new PIXI.Graphics()
      const _circle: PIXI.Graphics = new PIXI.Graphics()
      const _scale:number = currentSize.value / _img.width
      function HEXToVBColor(rrggbb: string) {
        rrggbb = rrggbb.replace('#', '')
        // const bbggrr = rrggbb.substr(4, 2) + rrggbb.substr(2, 2) + rrggbb.substr(0, 2);
        return parseInt(rrggbb.replace('#', ''), 16);
      }

      _circle.beginFill(HEXToVBColor('#FF0000'))
      _circle.drawCircle(0, 0, 260)
      _circle.endFill()


      _background.beginFill(HEXToVBColor(color.value || '#FFFFFF'))
      _background.drawRect(0, 0, 800, 800)
      _background.endFill()
      // _background.alpha = .25
      _background.x = -400
      _background.y = -400

      _view.anchor.x = .5
      _view.anchor.y = .5
      _view.alpha = .5
      _view.mask = _circle
      
      // _img.anchor.x = directions.x
      // _img.anchor.y = directions.y
      _img.scale.x = _scale
      _img.scale.y = _scale
      _img.anchor.set(.5)

      _img.interactive = true;
      _img.buttonMode = true;

      _img.anchor.set(0.5);
      selectedTarget.value = _img

      // Setup events for mouse + touch using the pointer events
      

      // _img.aaaaaaaaaaa('')


      itemContainer.addChild(_background)
      itemContainer.addChild(_view)
      itemContainer.addChild(_circle)
      itemContainer.addChild(_img)
      itemContainer.x = canvasSize.width * .5
      itemContainer.y = canvasSize.width * .5
      if (itemDom.value) {
        const element: HTMLDivElement = itemDom.value!
        const wheelUnitSize = 50
        element.appendChild(app.view)
        itemDom.value.addEventListener('mousedown', onDragStart)
        itemDom.value.addEventListener('mouseup', onDragEnd)
        itemDom.value.addEventListener('mouseupoutside', onDragEnd)
        itemDom.value.addEventListener('wheel', event => {
          if (event.timeStamp - wheelTimeStamp.value < 100 || (event.deltaY < 0 && currentSize.value <= 0) || (event.deltaY >= 0 && currentSize.value >= 800)) return
          wheelTimeStamp.value = event.timeStamp
          currentSize.value += ((event.deltaY > 0 ? 1 : -1) * wheelUnitSize)
          console.log(currentSize.value)
          renderCanvas()
        })
        // console.log('----test----')
        // console.log(itemDom.value)
        // itemDom.value.onscroll = function(e){
        //   console.log(e)
        // };
      }
    }

    


    function onDragStart(e) {
      selectedTarget.value.alpha = 0.5;
      // Start listening to dragging on the stage

      
      startPostion.x = e.clientX
      startPostion.y = e.clientY
      startPostion.imgx = selectedTarget.value.x
      startPostion.imgy = selectedTarget.value.y
      itemDom.value.addEventListener('mousemove', onDragMove);
    }

    // Restore the dragTarget bunny's alpha & deregister listener when the bunny is
    // released.
    function onDragEnd() {
        // Restore the original bunny alpha.
        selectedTarget.value.alpha = 1;

        // Stop listening to dragging on the stage
        itemDom.value.removeEventListener('mousemove', onDragMove);
    }

    // Copy the position of the cursor into the dragTarget's position.
    function onDragMove(e) {
        // Don't use e.target because the pointer might move out of the bunny if
        // the user drags fast, which would make e.target become the stage.
        // console.log(selectedTarget.value.parent)
        const relativeX = startPostion.x - e.clientX
        const relativeY = startPostion.y - e.clientY
        selectedTarget.value.x = startPostion.imgx - relativeX
        selectedTarget.value.y = startPostion.imgy - relativeY
        // selectedTarget.value.parent.toLocal(e.global, null, selectedTarget.value.position);
    }



    function uploadImageEvent () {
      updateItemImageColorById(route.params.id, color.value, app.renderer.view.toDataURL('image/jpeg', 0.78))
        .selectedTarget(res => {
          console.log(res)
        })
        .catch(err => {
          console.log(err)
        })
    }

    return { itemDom, uploadImageEvent, color, currentSize, renderCanvas }
  }
})
</script>


<style lang="sass" scoped>
.upload-image
  width: 100px
  @apply rounded bg-blue-800 my-3 ml-3 cursor-pointer text-white text-center
.btn
  @apply px-2 mx-1 rounded
</style>

