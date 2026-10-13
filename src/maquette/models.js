import * as THREE from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'

/**
 * Architectural models of the residences, after their renderings: white
 * floor plates with softly rounded corners, deep loggias between white
 * fins, sliding glass doors that reflect the sky, oak cladding, travertine
 * floors, glass rails, potted and trailing plants, balcony furniture, a
 * few windows lit warm, and a roof terrace. Nothing around the building.
 *
 * Each storey is its own group so a page can separate them; a storey
 * listed in `residence.floorsTaken` (0 = ground floor) is built in greys,
 * without colour or light. Every storey's geometry is merged by material,
 * so a building stays a few dozen draw calls.
 */

/** "atelier" for workshop/loft residences, "bosquet" for the others. */
export function kindOf(residence) {
  return /atelier|loft|manufact|usine/i.test(`${residence.slug} ${residence.name}`)
    ? 'atelier'
    : 'bosquet'
}

/** The residence's number of storeys, from its "Niveaux" figure. */
export function levelsOf(residence) {
  const stat = residence.stats?.find((s) => /niveau|level|étage|floor/i.test(s.label))
  const value = Number(stat?.value)
  if (value > 0) return Math.min(value, 12)
  return kindOf(residence) === 'atelier' ? 3 : 5
}

/** "Rez-de-chaussée", "1er étage", "2e étage"… or the English names. */
export function floorName(index, lang = 'fr') {
  if (lang === 'en') {
    if (index === 0) return 'Ground floor'
    const n = index % 100
    const suffix =
      n % 10 === 1 && n !== 11 ? 'st' : n % 10 === 2 && n !== 12 ? 'nd' : n % 10 === 3 && n !== 13 ? 'rd' : 'th'
    return `${index}${suffix} floor`
  }
  if (index === 0) return 'Rez-de-chaussée'
  return index === 1 ? '1er étage' : `${index}e étage`
}

const SPECS = {
  // Two offset wings, as in the renderings.
  bosquet: {
    blocks: [
      { w: 13, d: 7.6, x: 2.6, z: 0 },
      { w: 8.2, d: 7.6, x: -8, z: -1.6 },
    ],
    fh: 1,
    bay: 2.1,
    depth: 1,
    pool: true,
  },
  // One long, deep block with tall loft storeys and skylights.
  atelier: {
    blocks: [{ w: 19, d: 9, x: 0, z: 0 }],
    fh: 1.3,
    bay: 2.8,
    depth: 1.1,
    pool: false,
  },
}

const SLAB = 0.14

/* ---------- Materials ---------- */

function colourPalette() {
  const std = (color, extra = {}) => new THREE.MeshStandardMaterial({ color, roughness: 0.8, ...extra })
  return {
    white: std(0xf5f1ea, { roughness: 0.82 }),
    glass: std(0x4f88bd, { roughness: 0.05, metalness: 0.6, envMapIntensity: 1.3 }),
    glow: std(0xffe2b3, { emissive: 0xffc27a, emissiveIntensity: 0.85, roughness: 0.5 }),
    frame: std(0x3f4142, { roughness: 0.45, metalness: 0.5 }),
    wood: std(0xb88a5f, { roughness: 0.68 }),
    stone: std(0xe6d6bb, { roughness: 0.75 }),
    rail: std(0xd9e9ef, { roughness: 0.04, transparent: true, opacity: 0.3, depthWrite: false }),
    brass: std(0xa48a68, { roughness: 0.32, metalness: 0.75 }),
    leaf: std(0x5d8a3b, { roughness: 0.85, flatShading: true }),
    leafLight: std(0x86a957, { roughness: 0.85, flatShading: true }),
    trail: std(0x4b7631, { roughness: 0.9, flatShading: true }),
    pot: std(0xb8653f, { roughness: 0.9 }),
    sage: std(0xa7b597),
    sand: std(0xdcc6a2),
    clay: std(0xc4774f),
    canvas: std(0xf3ebdb, { side: THREE.DoubleSide }),
    water: std(0x56b8c8, { roughness: 0.05, metalness: 0.15, emissive: 0x0d4a55, emissiveIntensity: 0.25 }),
  }
}

/* A taken storey: the same parts in greys, no colour and no light. */
function greyPalette() {
  const g = (v, extra = {}) => new THREE.MeshStandardMaterial({ color: v, roughness: 0.9, ...extra })
  const light = g(0xbdbdbb)
  const mid = g(0xa6a6a4)
  const dark = g(0x8b8b89)
  return {
    white: light,
    glass: dark,
    glow: dark,
    frame: dark,
    wood: mid,
    stone: light,
    rail: g(0xc4c4c2, { transparent: true, opacity: 0.3, depthWrite: false }),
    brass: dark,
    leaf: mid,
    leafLight: mid,
    trail: mid,
    pot: mid,
    sage: mid,
    sand: light,
    clay: mid,
    canvas: g(0xc9c9c7, { side: THREE.DoubleSide }),
    water: mid,
  }
}

/* ---------- Geometry ---------- */

// Unit shapes, scaled into place and merged.
const UNIT = {
  box: new THREE.BoxGeometry(1, 1, 1),
  cyl: new THREE.CylinderGeometry(0.5, 0.5, 1, 14),
  cone: new THREE.ConeGeometry(0.5, 1, 7),
  blob: new THREE.IcosahedronGeometry(0.5, 1),
}

const KEEP = ['position', 'normal', 'uv']

/** Collects shapes by material, then merges each set into one mesh. */
class Batch {
  constructor() {
    this.parts = {}
    this.m = new THREE.Matrix4()
    this.q = new THREE.Quaternion()
    this.e = new THREE.Euler()
  }

  add(key, geometry, [x, y, z], [sx, sy, sz] = [1, 1, 1], [rx, ry, rz] = [0, 0, 0]) {
    const g = geometry.index ? geometry.toNonIndexed() : geometry.clone()
    for (const name of Object.keys(g.attributes)) if (!KEEP.includes(name)) g.deleteAttribute(name)
    g.clearGroups()
    this.q.setFromEuler(this.e.set(rx, ry, rz))
    g.applyMatrix4(this.m.compose(new THREE.Vector3(x, y, z), this.q, new THREE.Vector3(sx, sy, sz)))
    ;(this.parts[key] ??= []).push(g)
  }

  /** A box standing on y. */
  box(key, w, h, d, x, y, z) {
    this.add(key, UNIT.box, [x, y + h / 2, z], [w, h, d])
  }

  cyl(key, r, h, x, y, z) {
    this.add(key, UNIT.cyl, [x, y + h / 2, z], [r * 2, h, r * 2])
  }

  blob(key, r, x, y, z, squash = 1) {
    this.add(key, UNIT.blob, [x, y, z], [r * 2, r * 2 * squash, r * 2])
  }

  build(materials, group) {
    for (const [key, geos] of Object.entries(this.parts)) {
      const mesh = new THREE.Mesh(mergeGeometries(geos), materials[key])
      geos.forEach((g) => g.dispose())
      const see = materials[key].transparent
      mesh.castShadow = !see
      mesh.receiveShadow = !see
      group.add(mesh)
    }
  }
}

function roundedRect(w, d, r) {
  const x = -w / 2
  const y = -d / 2
  const s = new THREE.Shape()
  s.moveTo(x + r, y)
  s.lineTo(x + w - r, y)
  s.absarc(x + w - r, y + r, r, -Math.PI / 2, 0, false)
  s.lineTo(x + w, y + d - r)
  s.absarc(x + w - r, y + d - r, r, 0, Math.PI / 2, false)
  s.lineTo(x + r, y + d)
  s.absarc(x + r, y + d - r, r, Math.PI / 2, Math.PI, false)
  s.lineTo(x, y + r)
  s.absarc(x + r, y + r, r, Math.PI, Math.PI * 1.5, false)
  return s
}

/** A floor plate with softly rounded corners, standing on y. */
function plate(batch, w, d, x, y, z, key = 'white') {
  const geo = new THREE.ExtrudeGeometry(roundedRect(w, d, 0.45), {
    depth: SLAB,
    bevelEnabled: false,
    curveSegments: 6,
  })
  geo.rotateX(-Math.PI / 2)
  batch.add(key, geo, [x, y, z])
  geo.dispose()
}

// A stable pseudo-random sequence per residence, so the plants and the
// furniture stay where they are from one visit to the next.
function seeded(text) {
  let s = 0
  for (const ch of text) s = (s * 31 + ch.charCodeAt(0)) >>> 0
  return () => {
    s = (s + 0x6d2b79f5) >>> 0
    let t = s
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function pottedPlant(batch, x, y, z, size = 1) {
  batch.cyl('pot', 0.13 * size, 0.22 * size, x, y, z)
  batch.blob('leaf', 0.22 * size, x, y + 0.42 * size, z)
  batch.blob('leafLight', 0.15 * size, x + 0.1 * size, y + 0.58 * size, z - 0.05 * size)
}

function tableSet(batch, x, y, z, rand) {
  batch.cyl('white', 0.17, 0.03, x, y + 0.28, z)
  batch.cyl('frame', 0.025, 0.28, x, y, z)
  const cushion = rand() < 0.5 ? 'sage' : 'sand'
  for (const side of [-1, 1]) {
    batch.box(cushion, 0.17, 0.16, 0.17, x + side * 0.32, y, z)
    batch.box(cushion, 0.17, 0.18, 0.04, x + side * 0.32, y + 0.16, z - 0.07)
  }
}

function lounger(batch, x, y, z, cushion) {
  batch.box('wood', 0.56, 0.06, 0.2, x, y + 0.04, z)
  batch.box(cushion, 0.4, 0.04, 0.19, x + 0.06, y + 0.1, z)
  batch.add(cushion, UNIT.box, [x - 0.22, y + 0.18, z], [0.05, 0.22, 0.19], [0, 0, -0.5])
}

function parasol(batch, x, y, z) {
  batch.cyl('frame', 0.015, 0.75, x, y, z)
  batch.add('canvas', UNIT.cone, [x, y + 0.8, z], [0.9, 0.18, 0.9])
}

/* One storey of one wing: core with glass doors and oak panels, white fins
   dividing loggias front and back, rails, plants and furniture. */
function storeyWing(batch, spec, { w, d, x, z }, k, rand, lit) {
  const h = spec.fh - SLAB
  const depth = spec.depth
  const run = w - 0.6

  // The plate above, and the inhabited core.
  plate(batch, w, d, x, h, z)
  batch.box('white', run + 0.1, h, d - 2 * depth, x, 0, z)

  // End walls with tall windows.
  for (const end of [-1, 1]) {
    const ex = x + end * (w / 2 - 0.16)
    batch.box('white', 0.32, h, d - 0.9, ex, 0, z)
    for (const wz of [-0.9, 0.9]) {
      batch.box(lit && rand() < 0.3 ? 'glow' : 'glass', 0.04, h * 0.62, 0.62, ex + end * 0.17, h * 0.18, z + wz)
    }
  }

  const n = Math.max(2, Math.round(run / spec.bay))
  const seg = run / n
  for (const side of [-1, 1]) {
    const face = z + side * (d / 2 - depth)
    const mid = z + side * (d / 2 - depth / 2)

    batch.box('stone', run, 0.02, depth - 0.05, x, 0, mid)
    batch.box('rail', w - 1, 0.34, 0.03, x, 0, z + side * (d / 2 - 0.05))
    batch.box('brass', w - 1, 0.03, 0.05, x, 0.34, z + side * (d / 2 - 0.05))

    for (let i = 1; i < n; i++) {
      batch.box('white', 0.16, h, depth, x - run / 2 + i * seg, 0, mid)
    }

    for (let i = 0; i < n; i++) {
      const cx = x - run / 2 + seg * (i + 0.5)

      // Sliding glass door in a dark frame, an oak panel beside it.
      const doorW = seg * 0.56
      const doorX = cx - seg * 0.13
      batch.box(lit && rand() < 0.32 ? 'glow' : 'glass', doorW, h * 0.84, 0.04, doorX, 0.02, face + side * 0.02)
      batch.box('frame', doorW + 0.04, 0.035, 0.06, doorX, h * 0.86, face + side * 0.03)
      batch.box('frame', 0.03, h * 0.84, 0.06, doorX, 0.02, face + side * 0.03)
      batch.box('wood', seg * 0.27, h * 0.92, 0.03, cx + seg * 0.31, 0.01, face + side * 0.016)

      // Life on the loggia.
      const r = rand()
      const front = z + side * (d / 2 - depth * 0.4)
      if (r < 0.34) pottedPlant(batch, cx + seg * 0.28, 0.02, front, 0.9 + rand() * 0.4)
      else if (r < 0.58) tableSet(batch, cx, 0.02, front - side * 0.05, rand)
      else if (r < 0.74) lounger(batch, cx, 0.02, front, rand() < 0.5 ? 'clay' : 'sand')

      // A planter along the rail.
      if (rand() < 0.42) {
        const pz = z + side * (d / 2 - 0.17)
        batch.box('white', seg * 0.66, 0.15, 0.16, cx, 0.02, pz)
        for (const off of [-0.25, 0, 0.25]) {
          batch.blob(rand() < 0.5 ? 'leaf' : 'leafLight', 0.13 + rand() * 0.05, cx + off * seg, 0.24, pz)
        }
      }

      // Greenery trailing over the plate edge, as in the renderings.
      if (k > 0 && rand() < 0.36) {
        const tz = z + side * (d / 2 + 0.035)
        const count = 2 + Math.floor(rand() * 2)
        for (let t = 0; t < count; t++) {
          const len = 0.35 + rand() * 0.45
          batch.add('trail', UNIT.cone, [cx + (t - 1) * 0.2 + rand() * 0.1, h - len / 2 + 0.06, tz], [0.2, len, 0.14], [Math.PI, 0, 0])
        }
      }
    }
  }
}

/* The roof terrace over the main wing: parapet, deck, pool or skylights,
   pergola, parasol, loungers, planters; a plant room. */
function roof(batch, spec, rand) {
  const { w, d, x, z } = spec.blocks[0]
  for (const side of [-1, 1]) {
    batch.box('rail', w - 1, 0.3, 0.03, x, 0, z + side * (d / 2 - 0.08))
  }
  // The other wings: a planted roof garden with a deck and loungers.
  spec.blocks.slice(1).forEach((b) => {
    for (const side of [-1, 1]) batch.box('rail', b.w - 1, 0.3, 0.03, b.x, 0, b.z + side * (b.d / 2 - 0.08))
    batch.box('stone', b.w * 0.5, 0.03, b.d * 0.5, b.x + b.w * 0.12, 0, b.z)
    batch.box('white', b.w * 0.3, 0.2, b.d * 0.62, b.x - b.w * 0.28, 0, b.z)
    for (let i = 0; i < 6; i++) {
      batch.blob(i % 2 ? 'leaf' : 'leafLight', 0.24 + rand() * 0.12, b.x - b.w * 0.28 + (rand() - 0.5) * b.w * 0.24, 0.32, b.z + (i / 5 - 0.5) * b.d * 0.5)
    }
    lounger(batch, b.x + b.w * 0.12, 0.03, b.z - 0.5, 'sage')
    lounger(batch, b.x + b.w * 0.12, 0.03, b.z + 0.4, 'sand')
    parasol(batch, b.x + b.w * 0.3, 0.03, b.z)
    pottedPlant(batch, b.x + b.w * 0.42, 0, b.z + b.d * 0.34, 1.2)
  })

  batch.box('stone', w * 0.62, 0.03, d * 0.62, x + w * 0.12, 0, z + 0.3)
  if (spec.pool) {
    batch.box('white', 3, 0.12, 1.5, x + w * 0.2, 0, z + 0.9)
    batch.box('water', 2.8, 0.13, 1.3, x + w * 0.2, 0, z + 0.9)
    lounger(batch, x + w * 0.2 - 0.8, 0.03, z - 0.4, 'sand')
    lounger(batch, x + w * 0.2 + 0.1, 0.03, z - 0.4, 'clay')
    parasol(batch, x + w * 0.2 + 1.2, 0.03, z - 0.5)
  } else {
    for (let i = -2; i <= 2; i++) {
      batch.box('white', 2, 0.28, 2.6, x + i * 3.4, 0, z - 1)
      batch.box('glass', 1.8, 0.04, 2.4, x + i * 3.4, 0.28, z - 1)
    }
    tableSet(batch, x + 2, 0.03, z + 2.4, rand)
    parasol(batch, x + 2, 0.03, z + 2.4)
  }

  // Pergola of oak slats on four posts.
  const px = x - w * 0.22
  for (const [ox, oz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
    batch.cyl('wood', 0.04, 0.85, px + ox * 1.1, 0, z + oz * 0.8)
  }
  for (let i = 0; i < 9; i++) batch.box('wood', 0.07, 0.05, 1.9, px - 1.1 + i * 0.275, 0.85, z)
  tableSet(batch, px, 0.03, z, rand)

  batch.box('white', 2, 0.65, 1.4, x - w * 0.38, 0, z - d * 0.22)
  for (const [ox, oz] of [[0.42, 0.36], [-0.44, 0.34], [0.4, -0.34]]) {
    pottedPlant(batch, x + ox * w, 0, z + oz * d, 1.3)
  }
}

/** A clay outline around a storey, shown while it is pointed at. */
function outline(spec, height) {
  const geos = spec.blocks.map(({ w, d, x, z }) => {
    const g = new THREE.EdgesGeometry(new THREE.BoxGeometry(w + 0.4, height, d + 0.4))
    g.translate(x, height / 2, z)
    return g
  })
  const lines = new THREE.LineSegments(mergeGeometries(geos), new THREE.LineBasicMaterial({ color: 0x8f4a30 }))
  lines.visible = false
  return lines
}

export function buildModel(residence) {
  const kind = kindOf(residence)
  const spec = SPECS[kind]
  const levels = levelsOf(residence)
  const taken = new Set(residence.floorsTaken ?? [])
  const rand = seeded(residence.slug ?? residence.name ?? 'residence')
  const colour = colourPalette()
  const grey = greyPalette()

  const root = new THREE.Group()
  const floors = []

  for (let k = 0; k < levels; k++) {
    const group = new THREE.Group()
    group.position.y = SLAB + k * spec.fh
    const isTaken = taken.has(k)
    const batch = new Batch()
    if (k === 0) spec.blocks.forEach(({ w, d, x, z }) => plate(batch, w, d, x, -SLAB, z))
    spec.blocks.forEach((block) => storeyWing(batch, spec, block, k, rand, !isTaken))
    batch.build(isTaken ? grey : colour, group)
    const line = outline(spec, spec.fh)
    group.add(line)
    group.userData.floor = { index: k, taken: isTaken, outline: line }
    floors.push(group)
    root.add(group)
  }

  const top = new THREE.Group()
  top.position.y = SLAB + levels * spec.fh
  const batch = new Batch()
  roof(batch, spec, rand)
  batch.build(colour, top)
  floors.push(top)
  root.add(top)

  return { root, floors, levels, kind }
}
