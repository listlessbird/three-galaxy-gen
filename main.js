import "./style.css"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import * as dat from "lil-gui"

/**
 * Base
 */
// Debug
const gui = new dat.GUI({
  width: 460,
})

// Canvas
const canvas = document.querySelector("canvas.webgl")

// Scene
const scene = new THREE.Scene()

const params = {
  count: 100000,
  particleSize: 0.01,
  sizeAttenuation: true,
  radius: 5,
  branches: 3,
  spin: 1,
}

let geometry = null
let material = null
let points = null

function generateGalaxy() {
  if (points !== null) {
    geometry.dispose()
    material.dispose()
    scene.remove(points)
  }

  geometry = new THREE.BufferGeometry()

  const positions = new Float32Array(params.count * 3)

  for (let i = 0; i < params.count; i++) {
    const i3 = i * 3
    const radius = Math.random() * params.radius

    const spinAngle = radius * params.spin

    const branchAngle = ((i % params.branches) / params.branches) * 2 * Math.PI

    // if (i < 20) {
    //   console.log(i, branchAngle)
    // }

    positions[i3] = Math.cos(branchAngle + spinAngle) * radius
    positions[i3 + 1] = 0
    positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius
  }

  const bufferPosAttr = new THREE.BufferAttribute(positions, 3)

  geometry.setAttribute("position", bufferPosAttr)

  material = new THREE.PointsMaterial({
    size: params.particleSize,
    sizeAttenuation: params.sizeAttenuation,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  })

  points = new THREE.Points(geometry, material)

  scene.add(points)
}

generateGalaxy()

const debugGalaxy = gui.addFolder("Galaxy Params")
debugGalaxy
  .add(params, "count")
  .min(500)
  .max(500000)
  .step(100)
  .onFinishChange(generateGalaxy)
debugGalaxy
  .add(params, "particleSize", 0.01, 1, 0.01)
  .onFinishChange(generateGalaxy)
debugGalaxy.add(params, "sizeAttenuation").onFinishChange(generateGalaxy)
debugGalaxy.add(params, "radius", 5, 20, 0.01).onFinishChange(generateGalaxy)
debugGalaxy.add(params, "branches", 2, 10, 1).onFinishChange(generateGalaxy)
debugGalaxy.add(params, "spin", -5, 5, 0.01).onFinishChange(generateGalaxy)
/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  // Update camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  // Update renderer
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
)
camera.position.x = 3
camera.position.y = 3
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
  const elapsedTime = clock.getElapsedTime()

  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
