<template lang="pug">
div.p-2
  div.flex
    label.mr-1 TITLE
    input.border(type="text" v-model="cardTitle")
  div.flex
    label.mr-1 Chinese
    input.border(type="text" v-model="cardChinese")
  select(v-model="cardType" class="w-full mb-2 py-2")
    option(v-for="(item, i) in typeOptions" :key="item" :value="item.value") {{item.label}}({{item.value}})
  //- select(v-model="cardType")
  //-   option(v-for="(item, i) in typeList" :key="item" :value="i + 1") {{item}}
  input(type="file" v-if="!imageBase64 && !oldImageBase64" ref="imageInput" @change="imageChangeEvent")
  button.text-white.bg-red-800.px-2.mr-2.rounded(v-else @click.stop="cleanImageBase64") REMOVE
  button.text-white.bg-blue-800.px-2.mr-2.rounded(@click.stop="toggleCircle") CIRCLE
  button.text-white.bg-yellow-800.px-2.rounded(@click.stop="toggleRounded") ROUND
#item(ref="itemDom")
img(v-if="oldImageBase64" :src="oldImageBase64")
div.flex.items-center
  div.upload-image.mr-2(@click.stop="uploadImageEvent") UPLOAD
  div
    button.bg-yellow-200.mx-1.px-2(@click.stop="setColor('yellow')") YELLOW
    button.bg-blue-200.mx-1.px-2(@click.stop="setColor('blue')") BLUE
  button.btn.mx-2(@click.stop="btnEvent") 返回
</template>
<script lang="ts">
import { defineComponent, ref, reactive, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import * as PIXI from 'pixi.js'
import { addCardItem, updateCardItem, getCategoryOptions } from '../../service/api.js' // updateItemImageById, updateItemColorById
import BlackShape from '/src/assets/images/whiteshape.png'
// import step6 from '/src/assets/images/recipe1/step6.png'


interface RoulettePrize {
  label: string,
  occupy: number,
  accum: number
}
export default defineComponent({
  setup () {
    // const route = useRoute()
    const store = useStore()
    const router = useRouter()
    const itemDom = ref()
    const imageInput = ref()
    const currentSize = ref(600)
    const wheelTimeStamp = ref(0)
    const cardTitle = ref('')
    const cardType = ref(1)
    const cardChinese = ref('')
    const itemContainer: PIXI.Container = new PIXI.Container()
    const canvasSize = reactive({ width: 0, height: 0 })
    const typeList = ['ANIMAL', 'FOOD', 'ENVIRONMENT']
    const typeOptions = [...store.state.options.type]
    
    const selectedTarget = ref()
    const startPostion = reactive({ x: 0, y: 0, imgx: 0, imgy: 0})
    const color = ref('#fffde3')
    const imageBase64 = ref('')
    const oldImageBase64 = ref('')
    const maxImgWidt = 8000
    const showCircle = ref(false)
    const showRounded = ref(true)
    const isEditMode = ref(false)
    // getCategoryOptions()
    //   .then(({ data }) => {
    //     data.forEach((item: any) => { typeOptions.push(item) })
    //   })

    if (store.state.editingItem) {
      cardTitle.value = store.state.editingItem.title
      cardChinese.value = store.state.editingItem.chinese
      oldImageBase64.value = store.state.editingItem.image
      cardType.value = store.state.editingItem.type
      isEditMode.value = true
      // console.log(store.state.editingItem)
    }

    let app
    onUnmounted(() => {
      store.commit('setEditingItem')
    })

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
        // prepareCard(route.params.color, `${route.params.title}.png`, true)
        // ${route.params.title}.png
    })

    function prepareCard (paramColor, paramImage, isFirstTime) {
      // color.value = paramColor
      // images.value = [`/cards/${paramImage}`] // , '/cards/mountains.jpg'
      // app.loader
      //   .add(isFirstTime ? images.value : images.value.slice(1, -1))
      //   .load((loader, resources) => {
      //     renderCanvas()
      //   })
    }
    

    function renderCanvas () {
      if (!imageBase64.value) return
      const _img: PIXI.Sprite = new PIXI.Sprite(PIXI.Texture.from(imageBase64.value))
      // const _view: PIXI.Sprite = new PIXI.Sprite(PIXI.Texture.from(images[1]))
      const _background: PIXI.Graphics = new PIXI.Graphics()
      
      const _scale:number = Math.min(currentSize.value / Math.max(_img.width, 800), 2);

      function HEXToVBColor(rrggbb: string) {
        rrggbb = rrggbb.replace('#', '')
        // const bbggrr = rrggbb.substr(4, 2) + rrggbb.substr(2, 2) + rrggbb.substr(0, 2);
        return parseInt(rrggbb.replace('#', ''), 16);
      }
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
      if (showCircle.value) {
        const _circle: PIXI.Graphics = new PIXI.Graphics()
        _circle.beginFill(HEXToVBColor('#FF0000'))
        _circle.drawCircle(400, 400, 360)
        _circle.endFill()
        _img.mask = _circle
      } else if (showRounded.value) {
        const _blackShape: PIXI.Sprite = PIXI.Sprite.from(BlackShape)
        // const _blackShape: PIXI.Graphics = new PIXI.Graphics()
        const _rate = 800 / _blackShape.width
        _blackShape.scale.x = _blackShape.scale.y = _rate
        _blackShape.pivot.x = 400 / _rate
        _blackShape.pivot.y = _blackShape.height * .5
        // _blackShape.y = (800 - _blackShape.height) / 2
        // _blackShape.pivot.y = (-400) / _rate
        itemContainer.addChild(_blackShape)

        // console.log(_blackShape.height)
        _img.mask = _blackShape
        // _blackShape.mask = _img
      }



      itemContainer.x = canvasSize.width * .5
      itemContainer.y = canvasSize.width * .5
      if (itemDom.value) {
        const element: HTMLDivElement = itemDom.value!
        
        element.appendChild(app.view)
        itemDom.value.addEventListener('mousedown', onDragStart)
        itemDom.value.addEventListener('mouseup', onDragEnd)
        itemDom.value.addEventListener('mouseupoutside', onDragEnd)
        itemDom.value.addEventListener('wheel', wheelEvent)
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

    function wheelEvent (event) {
      const wheelUnitSize = 50
      if (event.timeStamp - wheelTimeStamp.value < 100 || (event.deltaY < 0 && currentSize.value <= 0) || (event.deltaY >= 0 && currentSize.value >= maxImgWidt)) return
      wheelTimeStamp.value = event.timeStamp
      currentSize.value += ((event.deltaY > 0 ? 1 : -1) * wheelUnitSize)
      renderCanvas()
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

    async function btnEvent () {
      router.push({ name: 'CardItems' })
    }

    function imageChangeEvent(event) {

      // var FR= new FileReader();
    
      // FR.addEventListener("load", function(e) {
      //   document.getElementById("img").src       = e.target.result;
      //   document.getElementById("b64").innerHTML = e.target.result;
      // }); 
      
      // FR.readAsDataURL( this.files[0] );


      const _fileReader = new FileReader()
      _fileReader.addEventListener('load', evt => {
          if (evt && evt.target && evt.target.result) {
            const _b64: string | ArrayBuffer = evt.target.result
            if (typeof _b64 === 'string') {
              imageBase64.value = _b64;
              renderCanvas();
            }
          }
        })
      _fileReader.readAsDataURL(event.target.files[0])
    }

    function setColor (_color: string) {
      color.value = _color ==='yellow' ? '#fffde3' : '#f1f0ff';
      renderCanvas()
    }

    function uploadImageEvent () {
      // title: string, chinese: string, color: string, base64: string, type: number
      if (isEditMode.value) {
        updateCardItem({ 
          id: store.state.editingItem.id,
          title: cardTitle.value, 
          color: color.value, 
          chinese: cardChinese.value, 
          image: app.renderer.view.toDataURL('image/jpeg', 0.78), 
          typeId: +cardType.value })
      } else {
        addCardItem({ title: cardTitle.value, color: color.value, chinese: cardChinese.value, base64: app.renderer.view.toDataURL('image/jpeg', 0.78), type: +cardType.value });
      }
    }

    function cleanImageBase64 () {
      if (oldImageBase64.value) {
        oldImageBase64.value = ''
      } else {
        itemDom.value.removeEventListener('mousedown', onDragStart)
        itemDom.value.removeEventListener('mouseup', onDragEnd)
        itemDom.value.removeEventListener('mouseupoutside', onDragEnd)
        itemDom.value.removeEventListener('wheel', wheelEvent)
        imageBase64.value = ''
        itemDom.value.innerHTML = ''
      }
    }

    function toggleCircle() {
      showCircle.value = !showCircle.value
      renderCanvas()
    }

    function toggleRounded () {
      showRounded.value = !showRounded.value
      renderCanvas()
    }

    return { showCircle, toggleCircle, toggleRounded, itemDom, imageInput, color, currentSize, renderCanvas, btnEvent, cardTitle, cardChinese, cardType, imageChangeEvent, setColor, uploadImageEvent, typeList, typeOptions, imageBase64, oldImageBase64, cleanImageBase64 }
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

