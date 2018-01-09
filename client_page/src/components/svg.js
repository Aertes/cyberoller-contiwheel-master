import { fabric } from 'fabric'
import lunZi from '../assets/img/lunzi.png'
import every from '../assets/img/every.png'

import wf1 from '../assets/img/lunzi/wai/full/Sponsorship.png'
import wf2 from '../assets/img/lunzi/wai/full/Promotion.png'
import wf3 from '../assets/img/lunzi/wai/full/Retail: Point of Sales Materials.png'
import wf4 from '../assets/img/lunzi/wai/full/E-Marketing:Digital.png'
import wf5 from '../assets/img/lunzi/wai/full/Events.png'
import wf6 from '../assets/img/lunzi/wai/full/Traditional Public Relations.png'
import wf7 from '../assets/img/lunzi/wai/full/Above the line.png'

import ws1 from '../assets/img/lunzi/wai/shot/Sponsorship.png'
import ws2 from '../assets/img/lunzi/wai/shot/Promotion.png'
import ws3 from '../assets/img/lunzi/wai/shot/Retail: POSM.png'
import ws4 from '../assets/img/lunzi/wai/shot/Digital.png'
import ws5 from '../assets/img/lunzi/wai/shot/Events.png'
import ws6 from '../assets/img/lunzi/wai/shot/PR.png'
import ws7 from '../assets/img/lunzi/wai/shot/ATL.png'

import nf1 from '../assets/img/lunzi/nei/full/value.png'
import nf2 from '../assets/img/lunzi/nei/full/Product.png'
import nf3 from '../assets/img/lunzi/nei/full/Awareness : Education.png'
import nf4 from '../assets/img/lunzi/nei/full/Safety.png'
import nf5 from '../assets/img/lunzi/nei/full/Recommendation.png'
import nf6 from '../assets/img/lunzi/nei/full/Technology & Innovation.png'
import nf7 from '../assets/img/lunzi/nei/full/Automotive Competence.png'

import ns1 from '../assets/img/lunzi/nei/shot/Value.png'
import ns2 from '../assets/img/lunzi/nei/shot/Product.png'
import ns3 from '../assets/img/lunzi/nei/shot/Awareness.png'
import ns4 from '../assets/img/lunzi/nei/shot/Safety.png'
import ns5 from '../assets/img/lunzi/nei/shot/Trustworthy.png'
import ns6 from '../assets/img/lunzi/nei/shot/T&I.png'
import ns7 from '../assets/img/lunzi/nei/shot/Automotive.png'

let clickFn = null
const count = ['', 'Value / Vision', 'Product', 'Awareness / Education',
  'Safety', 'Trustworthy/Quality/Original \n Equipment & Turning Company \n Recommendation',
  'Technology & Innovation', 'Automotive Competence']
const conntChild = ['', 'Promotion', 'Retail/ Point of Sales Materials',
  'E-Marketing/Digital', 'Events', 'Traditional Public Relations', 'Above the line', 'Sponsorship']
const pathNeiFull = [
  '', wf2, wf3, wf4, wf5, wf6, wf7, wf1
]
const pathNeiShot = [
  '', ws2, ws3, ws4, ws5, ws6, ws7, ws1
]
const pathWaiShot = [
  '', ns1, ns2, ns3, ns4, ns5, ns6, ns7
]
const pathWaiFull = [
  '', nf1, nf2, nf3, nf4, nf5, nf6, nf7
]

const data = (() => {
  let d = {}
  for (let i = 1; i < 8; i++) {
    d[i] = {}
    d[i].name = i === 2 ? count[i] : count[i].substring(0, 10) + '...'
    d[i].fullName = count[i]
    d[i].shotName = count[i].substring(0, 10) + '...'
    d[i].id = i
    d[i].path = i === 2 ? 'full' : 'shot'
    d[i].shotPath = pathWaiShot[i]
    d[i].fullPath = pathWaiFull[i]
    d[i].child = {}
    d[i].check = i === 2
    d[i].move = false
    d[i].moveOne = 0.02
    d[i].nowOne = 0
    d[i].deg = i * -45 + 90
    for (let j = 1; j < 8; j++) {
      d[i].child[j] = {}
      d[i].child[j].fullName = conntChild[j]
      d[i].child[j].name = j === 2 ? conntChild[j] : conntChild[j].substring(0, 10) + '...'
      d[i].child[j].shotName = conntChild[j].substring(0, 10) + '...'
      d[i].child[j].path = j === 2 ? 'full' : 'shot'
      d[i].child[j].shotPath = pathNeiShot[j]
      d[i].child[j].fullPath = pathNeiFull[j]
      d[i].child[j].id = i + '.' + j
      d[i].child[j].check = j === 2
      d[i].child[j].move = false
      d[i].child[j].moveOne = 0.02
      d[i].child[j].nowOne = 0
      d[i].child[j].deg = j * -45 + 90
      d[i].child[j].parent = d[i]
    }
  }
  // d[2].child[3].name = 'Retail/POSM'
  // d[2].child[4].name = 'E-marketing / Digital'
  // d[2].child[5].name = 'Events'
  // d[2].child[6].name = 'Traditional PR'
  // d[2].child[7].name = 'ATL'
  // d[2].child[1].name = 'Sponsorship'
  // d[2].child[2].name = 'Promotion'
  return d
})()

let PI = Math.PI
let centerX = 0
let centerY = 0
let cos = Math.cos
let sin = Math.sin
// let doughnutRadius = 200
// let cutoutRadius = 180

const create = (doughnutRadius, cutoutRadius, obj) => {
  let startRadius = -PI / 2
  let reArray = []
  return new Promise((resolve) => {
    for (let i = 1; i < 8; i++) {
      fabric.Image.fromURL(obj[i].shotPath, function (shotImg) {
        fabric.Image.fromURL(obj[i].fullPath, function (fullImg) {
          let nowQuanData = obj[i]
          let segmentAngle = ((nowQuanData.check ? 0.25 : 0.125) * (PI * 2))
          segmentAngle -= 0.03
          let endRadius = startRadius + segmentAngle
          let largeArc = ((endRadius - startRadius) % (PI * 2)) > PI ? 1 : 0
          let startX = centerX + cos(startRadius) * doughnutRadius
          let startY = centerY + sin(startRadius) * doughnutRadius
          let endX2 = centerX + cos(startRadius) * cutoutRadius
          let endY2 = centerY + sin(startRadius) * cutoutRadius
          let endX = centerX + cos(endRadius) * doughnutRadius
          let endY = centerY + sin(endRadius) * doughnutRadius
          let startX2 = centerX + cos(endRadius) * cutoutRadius
          let startY2 = centerY + sin(endRadius) * cutoutRadius
          let fontRadius = doughnutRadius - ((doughnutRadius - cutoutRadius) / 2)
          let endRadiusF = startRadius + (segmentAngle / 2)
          let endFX = centerX + cos(endRadiusF) * fontRadius
          let endFY = centerY + sin(endRadiusF) * fontRadius
          let cmd = [
            'M', startX, startY, // Move pointer
            'A', doughnutRadius, doughnutRadius, 0, largeArc, 1, endX, endY, // Draw outer arc path
            'L', startX2, startY2, // Draw line path(this line connects outer and innner arc paths)
            'A', cutoutRadius, cutoutRadius, 0, largeArc, 0, endX2, endY2, // Draw inner arc path
            'Z' // Cloth path
          ]
          let pathObj = new fabric.Path(cmd.join(' '))
          pathObj.set({
            perPixelTargetFind: true,
            fill: !nowQuanData.check ? '#ffa340' : '#fff',
            name: 'yuan',
            data: obj[i]
          })
          // let text = new fabric.Text(obj[i].name, {
          //   fontSize: 20,
          //   fontFamily: 'VOWNBE+ContinentalStagSansLCG-Light Verdana arial sans-serif YouYuan STXihei YaHei',
          //   color: '#191617',
          //   left: endFX,
          //   top: endFY,
          //   angle: endRadiusF * 180 / PI + 90,
          //   originX: 'center',
          //   originY: 'center'
          // })
          fullImg.set({
            opacity: obj[i].path === 'full' ? 1 : 0,
            hoverCursor: 'default',
            perPixelTargetFind: true,
            selectable: false,
            left: endFX,
            top: endFY,
            angle: endRadiusF * 180 / PI + 90,
            originX: 'center',
            originY: 'center',
            height: fullImg.height > 35 ? 35 : fullImg.height,
            width: fullImg.height > 35 ? 35 / fullImg.height * fullImg.width : fullImg.width
          })
          shotImg.set({
            opacity: obj[i].path === 'shot' ? 1 : 0,
            hoverCursor: 'default',
            perPixelTargetFind: true,
            selectable: false,
            left: endFX,
            top: endFY,
            angle: endRadiusF * 180 / PI + 90,
            originX: 'center',
            originY: 'center'
          })
          let group = new fabric.Group([pathObj, fullImg, shotImg], {
            subTargetCheck: true
          })
          reArray.push(group)
          segmentAngle += 0.03
          startRadius += segmentAngle
          if (reArray.length === 7) {
            resolve(reArray)
          }
        })
      })
    }
  })
  // return reArray
}

const createBasic = canvas => {
  let group
  const tabFunc = () => {
    return quan => {
      return new Promise((resolve) => {
        let nowDrowData = null
        for (let key of Object.keys(data)) {
          if (data[key].check) {
            nowDrowData = data[key].child
          }
        }
        Promise.all([create(230, 148, data), create(295, 240, nowDrowData)]).then(([pathGroup2, pathGroup]) => {
          let group2
          if (quan.quanType === 'groupFirst') {
            let deg = quan.getAngle()
            canvas.remove(quan)
            group2 = new fabric.Group(pathGroup2, {
              perPixelTargetFind: true,
              hoverCursor: 'pointer',
              selectable: false,
              subTargetCheck: true,
              name: 'quanGroup',
              quanType: 'groupFirst',
              left: 163,
              top: 163,
              tab: tabFunc
            })
            group2.setAngle(deg)
            canvas.add(group2)
          }
          let deg2 = group2 ? 0 : group.getAngle()
          canvas.remove(group)
          group = new fabric.Group(pathGroup, {
            perPixelTargetFind: true,
            hoverCursor: 'pointer',
            selectable: false,
            subTargetCheck: true,
            left: 98,
            name: 'quanGroup',
            top: 98,
            centerTransform: true,
            tab: tabFunc
          })
          group.setAngle(deg2)
          canvas.add(group)
          resolve(quan.quanType === 'groupFirst' ? group2 : group)
        })
      })
    }
  }
  create(295, 240, data[2].child).then(pathGroup => {
    group = new fabric.Group(pathGroup, {
      perPixelTargetFind: true,
      hoverCursor: 'pointer',
      selectable: false,
      subTargetCheck: true,
      left: 98,
      name: 'quanGroup',
      top: 98,
      centerTransform: true,
      tab: tabFunc
    })
    canvas.add(group)
  })
  // group.setAngle(50)
  create(230, 148, data).then(pathGroup2 => {
    let group2 = new fabric.Group(pathGroup2, {
      perPixelTargetFind: true,
      hoverCursor: 'pointer',
      selectable: false,
      subTargetCheck: true,
      name: 'quanGroup',
      quanType: 'groupFirst',
      left: 163,
      top: 163,
      tab: tabFunc
    })
    canvas.add(group2)
  })
}

const createSvg = (reFn) => {
  clickFn = reFn
  let canvas = new fabric.Canvas('canvas', { selection: false })
  fabric.Image.fromURL(lunZi, img => {
    img.set({
      hoverCursor: 'default',
      perPixelTargetFind: true,
      selectable: false
    })
    canvas.add(img)
    createBasic(canvas)
    fabric.Image.fromURL(every, img => {
      img.set({
        hoverCursor: 'default',
        perPixelTargetFind: true,
        selectable: false
      })
      canvas.add(img)
    })
  })
  canvas.on('mouse:down', function (options) {
    let nowQuan = options.target
    let goDeg = 0
    if (options.target && options.target.name && options.target.name === 'quanGroup') {
      options.target.forEachObject(dom => {
        dom.item(0).setFill('#ffa340')
        dom.item(0).data.move = dom.item(0).data.check
        dom.item(0).data.check = false
        dom.item(0).data.name = dom.item(0).data.shotName
        dom.item(0).data.path = 'shot'
      })
    }
    if (options.subTargets && options.subTargets[0] && options.subTargets[0].item(0)) {
      options.subTargets[0].item(0).setFill('#fff')
      options.subTargets[0].item(0).data.check = true
      options.subTargets[0].item(0).data.move = true
      options.subTargets[0].item(0).data.name = options.subTargets[0].item(0).data.fullName
      options.subTargets[0].item(0).data.path = 'full'
      goDeg = options.subTargets[0].item(0).data.deg
      clickFn && clickFn(options.subTargets[0].item(0).data)
      if (options.subTargets[0].item(0).data.child) {
        let child = options.subTargets[0].item(0).data.child
        for (let key of Object.keys(child)) {
          child[key].check = parseInt(key) === 2
        }
      }
    }
    if (nowQuan.tab) {
      nowQuan.tab(nowQuan).then(nowQuanType => {
        move(nowQuanType, goDeg, canvas)
      })
    }
    canvas.renderAll()
  })
}

const move = (obj, deg, canvas) => {
  if (obj.getAngle() - deg > 180) {
    move(obj, 360 + deg, canvas)
    return
  }
  if (obj.getAngle() - deg < -180) {
    move(obj, deg - 360, canvas)
    return
  }
  let isnext = true
  let one = 20
  one = Math.abs(one)
  if (deg > obj.getAngle()) {
    let value = obj.getAngle() + one
    if (value > deg) {
      obj.setAngle(deg)
      canvas.renderAll()
      isnext = false
    } else {
      obj.setAngle(value)
    }
  } else {
    let value = obj.getAngle() - one
    if (value < deg) {
      obj.setAngle(deg)
      isnext = false
    } else {
      obj.setAngle(value)
    }
  }
  canvas.renderAll()
  if (isnext) {
    setTimeout(() => {
      move(obj, deg, canvas)
    }, 1000 / 30)
  }
}

export default createSvg
