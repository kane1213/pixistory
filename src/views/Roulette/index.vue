<template lang="pug">
#roulette(ref="rouletteDom")
.prize_num NUMBER: {{ prizeNum + 1 }}, ROTATION: {{ rotationNum }}
</template>
<script lang="ts">
import { computed, defineComponent, ref, reactive, onMounted } from 'vue'
import * as PIXI from 'pixi.js'
import { TweenMax, TimelineMax, Linear, Strong } from 'gsap'
interface RoulettePrize {
  label: string,
  occupy: number,
  accum: number
}
export default defineComponent({
  setup () {
    const rouletteDom = ref()
    const prizeNum = ref(0)
    const rotationNum = ref(0)
    const generateColors = (num: Number): number[] => new Array(num).fill(0).map(() => Math.floor(Math.random()*16777215))
    const rouletteSecs: RoulettePrize[] = [
      { label: 'prizeOne', occupy: 4, accum: 0 },
      { label: 'prizeTwo', occupy: 1, accum: 0 },
      { label: 'prizeThree', occupy: 1, accum: 0 },
      { label: 'prizeFour', occupy: 2, accum: 0 },
      { label: 'prizeFive', occupy: 3, accum: 0 },
      { label: 'prizeSix', occupy: 2, accum: 0 },
      { label: 'prizeSeven', occupy: 1, accum: 0 },
    ]
    const allTimeLine = new TimelineMax({ repeat: -1 })

    const num = rouletteSecs.reduce((acc, sec):number => acc + sec.occupy ,0)
    const average: number = 360 / num
    const roulette: PIXI.Container = new PIXI.Container()
    const lightSpriteList: PIXI.AnimatedSprite[] = []
    onMounted(() => {
      // const images = ['/recipe1/meats.png', '/recipe2/poteto1.png', '/recipe1/meats.png', '/recipe2/poteto1.png', '/recipe1/meats.png', '/recipe2/poteto1.png', '/recipe1/meats.png', '/recipe2/poteto1.png']
      const images = new Array(10).fill('/foodsicon/').map((v,i) => `${v}food${i + 1}.png`)
      // const lightImgs = new Array(35).fill('/lights/tile0').map((v, i) => `${v}${('0' + i).slice(-2)}.png`)
      const lightImgs = new Array(3).fill('/lights/bulb').map((v, i) => `${v}${(i+1)}.png`)
      // const containers: PIXI.Container[] = []
      const mayLayout: HTMLElement = document.getElementById('mainLayout')!
      const { clientWidth, clientHeight } = mayLayout
      const app = new PIXI.Application({
        width: clientWidth,
        height: clientHeight,
        transparent: true
      });
      
      app.stage.addChild(roulette)
      const arcAngle = Math.PI / (num / 2)
      // const startAngle = arcAngle * 1
      const outsideRadius = clientWidth * .5
      const insideRadius = 10
      const position = 0
      const colors = generateColors(num)
      const imgSize = 120
      
      let accumNum = 0

      app.loader
        .add(images.concat(lightImgs))
        .load((loader, resources) => {


          rouletteSecs.forEach((sec, idx) => {
            // if (idx > 2) return
            const fontSize = 180
            const _container: PIXI.Container = new PIXI.Container()
            const _graphics: PIXI.Graphics = new PIXI.Graphics()
            const _mask: PIXI.Graphics = new PIXI.Graphics()
            const _text: PIXI.Text = new PIXI.Text(`${idx + 1}`, new PIXI.TextStyle({ fontSize, fill: '#ffffff' }))
            // const _texture: PIXI.Texture = PIXI.Texture.from(images[idx])
            const _img: PIXI.Sprite = new PIXI.Sprite(PIXI.Texture.from(images[idx]))
            const _previewOccupy =  idx > 0  ? rouletteSecs[idx - 1].occupy : 0
            accumNum += _previewOccupy

            sec.accum = accumNum
            const selfAngle = (arcAngle * sec.occupy / 2) 
            const base = Math.PI / 180 * 90
            _graphics.beginFill(colors[idx])
            _graphics.arc(position, position, outsideRadius, -selfAngle - base, selfAngle - base, false)
            _graphics.arc(position, position, insideRadius, selfAngle - base, -selfAngle - base, true)
            _graphics.endFill()

            _mask.beginFill(colors[idx])
            _mask.arc(position, position, outsideRadius, -selfAngle - base, selfAngle - base, false)
            _mask.arc(position, position, insideRadius, selfAngle - base, -selfAngle - base, true)
            _mask.endFill()

            _text.anchor.x = .5
            _text.anchor.y = .5
            _text.y = -outsideRadius + fontSize * .38 + 30
            _text.alpha = .25
            // _text.y = -outsideRadius * .25

            _img.anchor.x = .5
            _img.anchor.y = .5
            
            if (_img.width > imgSize) { 
              _img.scale.x = _img.scale.y = imgSize / _img.width
            }

            _img.y = -outsideRadius + _img.height + 50

            _container.addChild(_graphics)
            _container.addChild(_mask)
            _container.addChild(_text)
            _container.addChild(_img)
            _container.mask = _mask
            _container.rotation = Math.PI / 180 * (average * (idx > 0 ? sec.accum - (rouletteSecs[0].occupy * .5) + sec.occupy * .5 : 0))
            roulette.addChild(_container)
          })
          roulette.x = clientWidth * .5
          roulette.y = clientHeight * .5
          if (rouletteDom.value) {
            const element: HTMLDivElement = rouletteDom.value!
            element.appendChild(app.view)
          }
          const outter: PIXI.Container = new PIXI.Container()
          app.stage.addChild(outter)
          const layout = new PIXI.Graphics()
          layout.lineStyle(30, 0xff0000, 1, 0)
          layout.drawCircle(0, 0, outsideRadius)
          layout.endFill()
          outter.addChild(layout)

          const arrow = new PIXI.Graphics()
          arrow.beginFill(0x000000);
          arrow.moveTo(-10, 0)
          arrow.lineTo(0, -100)
          arrow.lineTo(10, 0)
          arrow.closePath()
          outter.addChild(arrow)

          const middleCircle = new PIXI.Graphics()
          middleCircle.beginFill(0x000000)
          middleCircle.drawCircle(0, 0, 15)
          middleCircle.endFill()
          outter.addChild(middleCircle)
          const numOfLight = 8
          for(let i = 0; i <= numOfLight; i ++) {
            const lightSprites = new PIXI.AnimatedSprite(lightImgs.reduce((acc: PIXI.Texture[], img: string): PIXI.Texture[] => acc.concat(PIXI.Texture.from(img)) , []))
            lightSpriteList.push(lightSprites)
            outter.addChild(lightSprites)
            lightSprites.anchor.x = lightSprites.anchor.y = .5
            lightSprites.pivot.y = (outsideRadius - 10) * 2
            lightSprites.scale.x = lightSprites.scale.y = .5
            lightSprites.rotation = Math.PI / 180 * 360 / numOfLight * i
            lightSprites.animationSpeed = 0.05
            // lightSprites.gotoAndPlay(i)
          }
          outter.x = clientWidth * .5
          outter.y = clientHeight * .5
          const loop = new TweenMax(roulette, 5, { rotation: arcAngle * (num), ease: Linear.easeNone })
          allTimeLine.add(loop)
          allTimeLine.play()
          roulette.interactive = roulette.buttonMode = true
          roulette.addListener('click', startLottery)
          roulette.addListener('touchstart', startLottery)
        })
    })

    const startLottery = () => {
      const _children = allTimeLine.getChildren()
      _children.forEach(child => {
        allTimeLine.remove(child)
      })
      allTimeLine.clear()
      allTimeLine._repeat = 0
      const prize: number = Math.floor(Math.random() * rouletteSecs.length)
      prizeNum.value = prize
      const { occupy, accum } = rouletteSecs[prize]
      const _startAngle = average * rouletteSecs[0].occupy * .5
      const _accumAngle = average * accum
      const _half = average * (occupy * (.1 + Math.random() * .9))
      const lottery = new TweenMax(roulette, 6, { rotation: Math.PI / 180 * (360 * 4 - _accumAngle - _half + _startAngle), ease: Strong.easeOut })
      rotationNum.value = roulette.rotation
      allTimeLine.add(lottery)
      roulette.rotation = 0

      // roulette.children[prize]['children'].slice(0,2).forEach(graphics => {
      //   graphics.arc(0, 0, outsideRadius, -selfAngle - base, selfAngle - base, false)
      //   graphics.arc(0, 0, insideRadius, selfAngle - base, -selfAngle - base, true)
      // })


      allTimeLine.play().then(() => {
        lightSpriteList.forEach(light => {
          light.gotoAndStop(0)
        })
      })

      lightSpriteList.forEach((item, idx) => {
        item.gotoAndPlay(idx)
      })
    }
    return { rouletteDom, prizeNum, rotationNum }
  }
})
</script>

<style lang="sass" scoped>
.prize_num
  @apply fixed right-2 bottom-10
</style>
