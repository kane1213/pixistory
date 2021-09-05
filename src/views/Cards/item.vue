<template lang="pug">
div.text-3xl.p-2.bg-black.text-white(v-text="cardTitle")
#item(ref="itemDom")
div.flex.items-center
  div.upload-image.mr-2(@click.stop="uploadImageEvent") UPLOAD
  div
    input(type="color" v-model="color" @change="renderCanvas")
  button.btn.ml-auto(@click.stop="btnEvent('previous')") 上一筆
  button.btn.mx-2(@click.stop="btnEvent('next')") 下一筆
  button.btn.mx-2(@click.stop="btnEvent('back')") 返回
  img(v-if="cardUploadImage" :srcl="cardUploadImage")
</template>
<script lang="ts">
import { defineComponent, ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import * as PIXI from 'pixi.js'
import { updateItemImageColorById, getCardList } from '../../service/api.js' // updateItemImageById, updateItemColorById
interface RoulettePrize {
  label: string,
  occupy: number,
  accum: number
}
export default defineComponent({
  setup () {
    const route = useRoute()
    const router = useRouter()
    if (Object.keys(route.params).length === 0) router.replace({ name: 'CardItems' })
    const itemDom = ref()
    const currentSize = ref(600)
    const wheelTimeStamp = ref(0)
    const paramId = ref(route.params.id)
    const cardTitle = ref(route.params.title)
    const cardUploadImage = ref(route.params.image)
    const itemContainer: PIXI.Container = new PIXI.Container()
    const canvasSize = reactive({ width: 0, height: 0 })
    const pagination = reactive({ page: 1, per: 10})
    // const _tmp = JSON.parse(route.params.pagination)
    const selectedTarget = ref()
    const startPostion = reactive({ x: 0, y: 0, imgx: 0, imgy: 0})
    const cards = ref([])
    // try {
    //   const _tmpArr:any = JSON.parse(route.params.cards)
    //   if (Array.isArray(_tmpArr)) {
    //     cards.value.concat(_tmpArr)
    //   }
      
    // } catch (err => {
    //   // cards = ref()

    // }
    
    const color = ref("#ffffff")
    const images = ref([])
    const maxImgWidt = 8000
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
      prepareCard(route.params.color, `${route.params.title}.png`, true)
        // ${route.params.title}.png
    })

    function prepareCard (paramColor, paramImage: string, isFirstTime) {
      color.value = paramColor
      images.value = [`/cards/${paramImage}`] // , '/cards/mountains.jpg'
      app.loader
        .add(isFirstTime ? images.value : images.value.slice(1, -1))
        .load((loader, resources) => {
          renderCanvas()
        })
    }
    

    function renderCanvas () {
      const _img: PIXI.Sprite = new PIXI.Sprite(PIXI.Texture.from(images.value[0]))
      // const _view: PIXI.Sprite = new PIXI.Sprite(PIXI.Texture.from(images[1]))
      const _background: PIXI.Graphics = new PIXI.Graphics()
      // const _circle: PIXI.Graphics = new PIXI.Graphics()

      
      const _scale:number = Math.min(currentSize.value / Math.max(_img.width, 800), 2);

      function HEXToVBColor(rrggbb: string) {
        rrggbb = rrggbb.replace('#', '')
        // const bbggrr = rrggbb.substr(4, 2) + rrggbb.substr(2, 2) + rrggbb.substr(0, 2);
        return parseInt(rrggbb.replace('#', ''), 16);
      }

      // _circle.beginFill(HEXToVBColor('#FF0000'))
      // _circle.drawCircle(0, 0, 260)
      // _circle.endFill()


      _background.beginFill(HEXToVBColor(color.value || '#FFFFFF'))
      _background.drawRect(0, 0, 800, 800)
      _background.endFill()
      // _background.alpha = .25
      _background.x = -400
      _background.y = -400

      // _view.anchor.x = .5
      // _view.anchor.y = .5
      // _view.alpha = .5
      // _view.mask = _circle
      
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
      
      itemContainer.addChild(_background)
      // itemContainer.addChild(_view)
      // itemContainer.addChild(_circle)
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
          if (event.timeStamp - wheelTimeStamp.value < 100 || (event.deltaY < 0 && currentSize.value <= 0) || (event.deltaY >= 0 && currentSize.value >= maxImgWidt)) return
          wheelTimeStamp.value = event.timeStamp
          currentSize.value += ((event.deltaY > 0 ? 1 : -1) * wheelUnitSize)
          renderCanvas()
        })
        // console.log('----test----')
        // console.log(itemDom.value)
        // itemDom.value.onscroll = function(e){
        //   console.log(e)
        // };
      }
    }

    // <input id="party" type="datetime-local" name="partydate" value="2017-06-01T08:30">
    // vscode://vscode.github-authentication/did-authenticate?windowid=1&code=dd71c6187f0b5235c350&state=83e38975-c6c8-4d78-b1cd-37970abf2a28

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
      updateItemImageColorById(paramId.value, color.value, app.renderer.view.toDataURL('image/jpeg', 0.78))
        .then(res => {
          console.log(res)
        })
        .catch(err => {
          console.log(err)
        })
    }

    async function btnEvent (eventName) {

      if (eventName === 'back') { 
        router.replace({ name: 'CardItems' , params: {"pagination": JSON.stringify(pagination)}})
        return
      }
      const currentIndex = cards.value.findIndex(card => card['id'] == paramId.value)
      let newItem = null
      if (pagination.page === 1 && currentIndex === 0 && eventName === 'previous') return
      else if (pagination.page < 4 && currentIndex === pagination.per -1 && eventName === 'next') {
        pagination.page += 1
        const res: any = await getCardList(pagination.page, pagination.per)
        cards.value = res['data']['items']
        newItem = cards[0];
      } else if (pagination.page > 1 && currentIndex === 0 && eventName === 'previous') {
        pagination.page -= 1
        const res:any = await getCardList(pagination.page, pagination.per)
        cards.value = res['data']['items']
        newItem = cards[0]
      } else {
        newItem = (eventName === 'next') 
          ? cards.value[currentIndex + 1]
          : cards.value[currentIndex - 1]
      }
      if (newItem) {
        paramId.value = newItem['id']
        cardTitle.value = newItem['title']
        prepareCard(newItem['color'], `${newItem['title']}.png`, false)
      }

      // const _currentItem = paramId 

      // prepareCard(route.params.color, `${route.params.title}.png`)

    }

    return { itemDom, uploadImageEvent, color, currentSize, renderCanvas, btnEvent, cardTitle, cardUploadImage }
  }
})
</script>


<style lang="sass" scoped>
.upload-image
  width: 100px
  @apply rounded bg-blue-800 my-3 ml-3 cursor-pointer text-white text-center
.btn
  @apply px-2 rounded
  background-color: blue
  color: #fff
</style>

