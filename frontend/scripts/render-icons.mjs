// Renders public/favicon.svg to the PNG icons the PWA manifest and iOS need.
// Usage: npm run icons
import { chromium } from '@playwright/test'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const pub = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../public')
const svg = readFileSync(path.join(pub, 'favicon.svg'), 'utf8')

const targets = [
  { file: 'icon-192.png', size: 192, pad: 0, bg: 'transparent' },
  { file: 'icon-512.png', size: 512, pad: 0, bg: 'transparent' },
  // maskable icons get cropped to a circle/squircle by Android; keep the art in the safe zone
  { file: 'icon-maskable-512.png', size: 512, pad: 0.12, bg: '#ff8a3d' },
  // iOS draws its own rounded corners and shows transparency as black
  { file: 'apple-touch-icon.png', size: 180, pad: 0, bg: '#ff8a3d' },
]

const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {})
const page = await browser.newPage()
for (const t of targets) {
  const inner = Math.round(t.size * (1 - 2 * t.pad))
  await page.setViewportSize({ width: t.size, height: t.size })
  await page.setContent(
    `<html><body style="margin:0;background:${t.bg};display:grid;place-items:center;width:${t.size}px;height:${t.size}px">
      <div style="width:${inner}px;height:${inner}px">${svg.replace('<svg ', '<svg width="100%" height="100%" ')}</div>
    </body></html>`,
  )
  await page.screenshot({ path: path.join(pub, t.file), omitBackground: t.bg === 'transparent' })
  console.log('wrote', t.file)
}
await browser.close()
