// Turns dist-artifact/index.html into the body fragment a claude.ai Artifact expects
// (the host adds doctype/html/head/body itself) and writes dist-artifact/page.html.
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const dir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../dist-artifact')
const html = readFileSync(path.join(dir, 'index.html'), 'utf8')
const tags = [...html.matchAll(/<(script|link)\b[^>]*(?:src|href)="\.\/assets\/[^"]+"[^>]*>(?:<\/script>)?/g)].map((m) =>
  m[0].replace(/\s+crossorigin/, ''),
)
writeFileSync(
  path.join(dir, 'page.html'),
  `<title>Migini</title>
<meta name="description" content="Spil for børn uden reklamer. Lav mad med Kapi og Bao.">
${tags.join('\n')}
<div id="root"></div>
`,
)
console.log('wrote page.html with', tags.length, 'asset tags')
