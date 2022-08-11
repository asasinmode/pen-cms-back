const randomInRange = (min, max) => {
   return Math.floor(Math.random() * (max - min + 1)) + min;
}
const updateDimensions = () => {
   canvas.width = window.innerWidth
   canvas.height = window.innerHeight
}
const animatePens = (pens) => {
   pens.forEach(pen => {
      me = floaties[pen]
      const percentOfLifeTime = (Date.now() - me.creationTime) / me.lifetime
      if(percentOfLifeTime < 0.65){
         me.scale = (me.finalScale * (percentOfLifeTime / 0.65)) + 1
      } else {
         me.scale = (1 + me.finalScale) * (1 - ((percentOfLifeTime - 0.65) / 0.35))
      }
      let img = new Image()
      img.src = me.img
      const newSize = me.scale * config.baseSize
      ctx.drawImage(img, me.x, me.y, newSize, newSize)
   })
}

window.addEventListener("resize", updateDimensions)

const canvas = document.querySelector("#canvasBackground")
const ctx = canvas.getContext("2d")
updateDimensions()

const config = {
   minLifetime: 5 * 1000,
   maxLifetime: 12 * 1000,
   pens: [
      "pen1.webp",
      "pen2.webp",
      "pen3.webp",
      "pen4.webp",
      "pen5.webp",
   ],
   baseSize: 20
}

class floatingPen {
   constructor() {
      this.x = Math.random() * (canvas.width - 20)
      this.y = Math.random() * (canvas.height - 20)
      this.lifetime = randomInRange(config.minLifetime, config.maxLifetime)
      this.scale = 1
      this.finalScale = Math.random() + 1
      this.creationTime = Date.now()
      this.img = `canvas/${ config.pens[randomInRange(0, config.pens.length - 1)] }`
      setTimeout(() => {
         delete floaties[this.creationTime]
      }, this.lifetime);
  }
}

const floaties = {}

setInterval(() => {
   const pen = new floatingPen()
   floaties[pen.creationTime] = pen
}, 907);
setInterval(() => {
   const pen = new floatingPen()
   floaties[pen.creationTime] = pen
}, 1097);

const render = () => {
   ctx.clearRect(0, 0, canvas.width, canvas.height)
   animatePens(Object.keys(floaties))
   requestAnimationFrame(render)
}
render()