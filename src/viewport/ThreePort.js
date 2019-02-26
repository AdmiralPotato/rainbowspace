import * as THREE from 'three'
window.THREE = THREE

const deg = Math.PI / 180
const deg45 = Math.PI / 4
const ThreePort = function ({
  canvas,
  updateFunc,
  resizeFunc
}) {
  this.width = 0
  this.height = 0
  this.renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
    canvas
  })
  this.camera = new THREE.PerspectiveCamera(
    45,
    1, // doesn't matter, recalculated in next function call anyway
    0.1,
    10000
  )
  this.scene = new THREE.Scene()
  this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement)
  this.camera.position.set(-1, 6, -5)
  this.camera.lookAt(new THREE.Vector3(0, 0, 0))
  this.controls.enableDamping = true // an animation loop is required when either damping or auto-rotation are enabled
  this.controls.dampingFactor = 0.25
  this.controls.screenSpacePanning = false
  this.controls.enablePan = false
  this.controls.minDistance = 1
  this.controls.maxDistance = 10
  this.controls.minPolarAngle = -Infinity // Math.PI / 2
  this.controls.maxPolarAngle = Math.PI / 2
  this.updateFunc = updateFunc
  this.resizeFunc = resizeFunc
  this.resize()
  this.loopWrapped = (time) => { this.loop(time) }
  this.start()
}
ThreePort.prototype = {
  start () {
    this.go = true
    requestAnimationFrame(this.loopWrapped)
  },
  stop () {
    this.go = false
  },
  resize () {
    const canvas = this.renderer.domElement
    const clientWidth = canvas.clientWidth
    const clientHeight = canvas.clientHeight
    const dpr = window.devicePixelRatio
    this.width = clientWidth * dpr
    this.height = clientHeight * dpr
    if (
      canvas.width !== this.width ||
      canvas.height !== this.height
    ) {
      const aspect = this.width / this.height
      const desiredMinimumFov = deg45
      // this ensures that I always have a 90deg square in the center of both landscape and portrait viewports
      this.camera.fov = (
        aspect >= 1 ? desiredMinimumFov : 2 * Math.atan(Math.tan(desiredMinimumFov / 2) / aspect)
      ) / deg
      this.camera.aspect = aspect
      this.camera.updateProjectionMatrix()
      this.renderer.setPixelRatio(dpr)
      this.renderer.setSize(
        clientWidth,
        clientHeight,
        false
      )
      if (this.resizeFunc) {
        this.resizeFunc({
          width: this.width,
          height: this.height,
          clientWidth,
          clientHeight
        })
      }
    }
  },
  loop (time) {
    if (this.go) {
      requestAnimationFrame(this.loopWrapped)
      this.resize()
      this.animate(time)
    }
  },
  animate (time) {
    this.controls.update()
    if (this.updateFunc) {
      this.updateFunc(time)
    }
    this.renderer.render(this.scene, this.camera)
  }
}

export default ThreePort
