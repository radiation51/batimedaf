/**
 * Makes the site's photographs light enough for the web, in place:
 *
 *   npm run optimize-images
 *
 * - JPEGs are resized to at most 2000 px wide (never enlarged) and
 *   re-encoded as progressive JPEG (mozjpeg,
 *   quality 78, or 70 for a very detailed photo still over 450 KB), only
 *   when that makes the file smaller.
 * - PNG photographs become JPEGs of the same name (`.png` -> `.jpg`); the
 *   PNG is removed. lib/imageStyle.js maps old `.png` paths still saved in
 *   the content to the `.jpg`.
 * - Files already light enough are left alone, so running it again does
 *   not re-compress them.
 *
 * Keep the originals somewhere safe before running it.
 */
import { readdir, rename, stat, unlink } from 'node:fs/promises'
import { join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const ROOT = fileURLToPath(new URL('../public/images/', import.meta.url))
const LIGHT_ENOUGH = 420 * 1024

async function* files(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) yield* files(path)
    else yield path
  }
}

const kb = (bytes) => `${Math.round(bytes / 1024)} KB`
let before = 0
let after = 0

for await (const path of files(ROOT)) {
  const lower = path.toLowerCase()
  const isJpeg = lower.endsWith('.jpg') || lower.endsWith('.jpeg')
  const isPng = lower.endsWith('.png')
  if (!isJpeg && !isPng) continue

  const size = (await stat(path)).size
  // Wide enough for a full-screen photo on a large display.
  const maxWidth = 2000
  const { width } = await sharp(path).metadata()
  before += size

  if (isJpeg && width <= maxWidth && size <= LIGHT_ENOUGH) {
    after += size
    continue
  }

  const target = isPng ? path.replace(/\.png$/i, '.jpg') : `${path}.tmp`
  const encode = (quality) =>
    sharp(path)
      .rotate()
      .resize({ width: maxWidth, withoutEnlargement: true })
      .jpeg({ quality, progressive: true, mozjpeg: true })
      .toFile(target)
  // Very detailed photos (aerial views, foliage) get a little more.
  await encode(78)
  if ((await stat(target)).size > 450 * 1024) await encode(70)
  const newSize = (await stat(target)).size

  if (isPng) {
    await unlink(path)
    after += newSize
    console.log(`${relative(ROOT, path)} -> .jpg  ${kb(size)} -> ${kb(newSize)}`)
  } else if (newSize < size) {
    await rename(target, path)
    after += newSize
    console.log(`${relative(ROOT, path)}  ${kb(size)} -> ${kb(newSize)}`)
  } else {
    await unlink(target)
    after += size
  }
}

console.log(`\nTotal: ${(before / 1048576).toFixed(1)} MB -> ${(after / 1048576).toFixed(1)} MB`)
