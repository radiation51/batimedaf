import * as THREE from 'three'

/** A sky for the glass to reflect: deep blue above, warm towards the horizon. */
function skyScene() {
  const scene = new THREE.Scene()
  const geo = new THREE.SphereGeometry(10, 32, 16)
  const colours = []
  const top = new THREE.Color(0x3f86d8)
  const horizon = new THREE.Color(0xf6e2c8)
  const ground = new THREE.Color(0xcfc3b2)
  const pos = geo.attributes.position
  for (let i = 0; i < pos.count; i++) {
    const y = pos.getY(i) / 10
    const c = y > 0 ? horizon.clone().lerp(top, Math.pow(y, 0.6)) : horizon.clone().lerp(ground, Math.min(1, -y * 3))
    colours.push(c.r, c.g, c.b)
  }
  geo.setAttribute('color', new THREE.Float32BufferAttribute(colours, 3))
  scene.add(new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.BackSide })))
  // The sun, low in the west.
  const sun = new THREE.Mesh(new THREE.SphereGeometry(0.9, 16, 8), new THREE.MeshBasicMaterial({ color: 0xfff1d6 }))
  sun.position.set(6, 3.2, 5)
  scene.add(sun)
  return scene
}

/**
 * A still studio for one architectural model: soft sun with shadows,
 * studio reflections, a fixed three-quarter view the pointer can turn.
 * It draws only when something changes (a turn, storeys moving), so an
 * idle model costs nothing. `explode(on)` separates the storeys,
 * `highlight(i)` outlines and raises one, `pickFloor(x, y)` finds the one
 * under the pointer.
 */
export class Stage {
  constructor(canvas, { ground = null } = {}) {
    this.groundColour = ground
    this.canvas = canvas
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.renderer.outputColorSpace = THREE.SRGBColorSpace
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping
    this.renderer.toneMappingExposure = 1
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = THREE.PCFShadowMap
    // Shadows are redrawn only when the storeys move.
    this.renderer.shadowMap.autoUpdate = false

    this.scene = new THREE.Scene()
    const pmrem = new THREE.PMREMGenerator(this.renderer)
    const sky = skyScene()
    this.env = pmrem.fromScene(sky, 0.02).texture
    sky.traverse((o) => {
      o.geometry?.dispose()
      o.material?.dispose()
    })
    pmrem.dispose()
    this.scene.environment = this.env
    this.scene.environmentIntensity = 0.9

    // Late afternoon: a blue sky above, a warm low sun with clear shadows.
    this.scene.add(new THREE.HemisphereLight(0xc6dcf2, 0xe6d6bf, 0.5))
    this.sun = new THREE.DirectionalLight(0xffd9aa, 3.1)
    this.sun.castShadow = true
    this.sun.shadow.mapSize.set(2048, 2048)
    this.sun.shadow.bias = -0.0003
    this.sun.shadow.normalBias = 0.02
    this.sun.shadow.radius = 3
    this.scene.add(this.sun)
    this.scene.add(this.sun.target)
    const fill = new THREE.DirectionalLight(0xdde8f5, 0.3)
    fill.position.set(22, 8, 6)
    this.scene.add(fill)

    this.camera = new THREE.PerspectiveCamera(24, 1, 1, 500)
    this.azimuth = 0.62
    this.elevation = 0.46
    this.radius = 50
    this.target = new THREE.Vector3()
    this.drag = null

    this.model = null
    this.exploded = false
    this.highlighted = null
    this.gap = 0.52
    this.visible = true
    this.frame = 0

    this.tick = this.tick.bind(this)
    this.resize = this.resize.bind(this)
    this.resizeObserver = new ResizeObserver(this.resize)
    this.resizeObserver.observe(canvas.parentElement)
    this.intersection = new IntersectionObserver(([entry]) => {
      this.visible = entry.isIntersecting
      if (this.visible) this.invalidate()
    })
    this.intersection.observe(canvas)
    this.resize()
  }

  setModel(model) {
    this.model = model
    this.scene.add(model.root)
    model.floors.forEach((floor) => {
      Object.assign(floor.userData, { base: floor.position.y, offset: 0, target: 0, from: 0, startAt: 0 })
    })
    model.root.updateMatrixWorld(true)
    const sphere = new THREE.Box3().setFromObject(model.root).getBoundingSphere(new THREE.Sphere())
    this.rest = sphere
    this.target.copy(sphere.center)
    this.target.y = sphere.center.y * 0.8

    // The sun's shadow covers the model and its plinth, no more.
    const r = sphere.radius * 1.4
    Object.assign(this.sun.shadow.camera, { left: -r, right: r, top: r, bottom: -r, near: 1, far: 140 })
    this.sun.shadow.camera.updateProjectionMatrix()
    this.sun.target.position.copy(sphere.center)
    this.sun.position.copy(sphere.center).add(new THREE.Vector3(-20, 21, 22))

    // No plinth: the model stands on the page, only its shadow shows.
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(sphere.radius * 6, sphere.radius * 6),
      new THREE.ShadowMaterial({ color: 0x3a2c1f, opacity: 0.2 }),
    )
    ground.rotation.x = -Math.PI / 2
    ground.position.set(sphere.center.x, 0, sphere.center.z)
    ground.receiveShadow = true
    this.scene.add(ground)

    // A thin ground under the building, in a pale shade of the residence's colour.
    if (this.groundColour !== null) {
      const box = new THREE.Box3().setFromObject(model.root)
      const size = box.getSize(new THREE.Vector3())
      const w = size.x + 4
      const d = size.z + 4
      const r = 1.4
      const shape = new THREE.Shape()
      shape.moveTo(-w / 2 + r, -d / 2)
      shape.lineTo(w / 2 - r, -d / 2)
      shape.absarc(w / 2 - r, -d / 2 + r, r, -Math.PI / 2, 0, false)
      shape.lineTo(w / 2, d / 2 - r)
      shape.absarc(w / 2 - r, d / 2 - r, r, 0, Math.PI / 2, false)
      shape.lineTo(-w / 2 + r, d / 2)
      shape.absarc(-w / 2 + r, d / 2 - r, r, Math.PI / 2, Math.PI, false)
      shape.lineTo(-w / 2, -d / 2 + r)
      shape.absarc(-w / 2 + r, -d / 2 + r, r, Math.PI, Math.PI * 1.5, false)
      const geo = new THREE.ExtrudeGeometry(shape, { depth: 0.08, bevelEnabled: false, curveSegments: 8 })
      geo.rotateX(-Math.PI / 2)
      const plot = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color: this.groundColour, roughness: 0.95 }))
      const centre = box.getCenter(new THREE.Vector3())
      plot.position.set(centre.x, -0.079, centre.z)
      plot.receiveShadow = true
      this.scene.add(plot)
    }

    this.fit()
    this.renderer.shadowMap.needsUpdate = true
    this.invalidate()
  }

  /** Camera distance so the model fits with its storeys separated. */
  fit() {
    if (!this.rest) return
    const fov = THREE.MathUtils.degToRad(this.camera.fov)
    const aspect = Math.min(1, this.camera.aspect)
    const levels = this.model?.floors.length ?? 1
    const radius = this.rest.radius + levels * this.gap * 0.35
    this.radius = (radius / Math.sin(fov / 2) / Math.max(aspect, 0.6)) * 0.82
  }

  /** Separates the storeys (on) or settles them, one after the other. */
  explode(on) {
    if (!this.model || this.exploded === on) return
    this.exploded = on
    this.retarget()
  }

  /** Outlines and raises one storey a little more; null for none. */
  highlight(index) {
    if (!this.model || this.highlighted === index) return
    this.highlighted = index
    this.model.floors.forEach((floor) => {
      const info = floor.userData.floor
      if (info) info.outline.visible = info.index === index
    })
    this.retarget(true)
  }

  retarget(quick = false) {
    const now = performance.now() / 1000
    const n = this.model.floors.length
    this.model.floors.forEach((floor, k) => {
      const d = floor.userData
      let target = this.exploded ? k * this.gap + (!d.floor ? this.gap * 0.5 : 0) : 0
      if (d.floor && d.floor.index === this.highlighted) target += 0.22
      if (target === d.target) return
      d.from = d.offset
      d.target = target
      d.startAt = quick ? now : now + (this.exploded ? k : n - 1 - k) * 0.05
      d.duration = quick ? 0.35 : 0.6
    })
    this.invalidate()
  }

  /** The storey under a point of the canvas, as its index, or null. */
  pickFloor(clientX, clientY) {
    if (!this.model) return null
    const rect = this.canvas.getBoundingClientRect()
    const pointer = new THREE.Vector2(
      ((clientX - rect.left) / rect.width) * 2 - 1,
      -((clientY - rect.top) / rect.height) * 2 + 1,
    )
    const ray = new THREE.Raycaster()
    ray.setFromCamera(pointer, this.camera)
    const storeys = this.model.floors.filter((f) => f.userData.floor)
    const hit = ray.intersectObjects(storeys, true).find((h) => h.object.isMesh)
    if (!hit) return null
    let o = hit.object
    while (o && !o.userData.floor) o = o.parent
    return o ? o.userData.floor.index : null
  }

  startDrag(x, y) {
    this.drag = { x, y, azimuth: this.azimuth, elevation: this.elevation }
  }

  /** Turns the view; true once the pointer has really moved. */
  moveDrag(x, y) {
    if (!this.drag) return false
    this.azimuth = this.drag.azimuth - (x - this.drag.x) * 0.008
    this.elevation = THREE.MathUtils.clamp(this.drag.elevation + (y - this.drag.y) * 0.004, 0.12, 1.1)
    this.invalidate()
    return Math.hypot(x - this.drag.x, y - this.drag.y) > 5
  }

  endDrag() {
    this.drag = null
  }

  resize() {
    const parent = this.canvas.parentElement
    const w = Math.max(1, parent.clientWidth)
    const h = Math.max(1, parent.clientHeight)
    this.renderer.setSize(w, h, false)
    this.camera.aspect = w / h
    this.camera.updateProjectionMatrix()
    this.fit()
    this.invalidate()
  }

  /** Asks for one more frame. */
  invalidate() {
    if (!this.frame && this.visible) this.frame = requestAnimationFrame(this.tick)
  }

  tick() {
    this.frame = 0
    const now = performance.now() / 1000
    let moving = false
    if (this.model) {
      for (const floor of this.model.floors) {
        const d = floor.userData
        if (d.offset === d.target) continue
        const t = Math.min(Math.max((now - d.startAt) / d.duration, 0), 1)
        const eased = 1 - Math.pow(1 - t, 3)
        d.offset = t >= 1 ? d.target : d.from + (d.target - d.from) * eased
        floor.position.y = d.base + d.offset
        moving = true
      }
    }
    if (moving) this.renderer.shadowMap.needsUpdate = true

    const r = this.radius
    this.camera.position.set(
      this.target.x + Math.sin(this.azimuth) * Math.cos(this.elevation) * r,
      this.target.y + Math.sin(this.elevation) * r,
      this.target.z + Math.cos(this.azimuth) * Math.cos(this.elevation) * r,
    )
    this.camera.lookAt(this.target)
    this.renderer.render(this.scene, this.camera)
    if (moving) this.invalidate()
  }

  dispose() {
    cancelAnimationFrame(this.frame)
    this.frame = -1
    this.resizeObserver.disconnect()
    this.intersection.disconnect()
    const seen = new Set()
    this.scene.traverse((o) => {
      if (o.geometry && !seen.has(o.geometry)) {
        seen.add(o.geometry)
        o.geometry.dispose()
      }
      const mats = Array.isArray(o.material) ? o.material : o.material ? [o.material] : []
      for (const mat of mats) {
        if (seen.has(mat)) continue
        seen.add(mat)
        mat.dispose()
      }
    })
    this.env.dispose()
    this.renderer.dispose()
    // Hands the WebGL context back: browsers only allow a handful at once.
    this.renderer.forceContextLoss()
  }
}
