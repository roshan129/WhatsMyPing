import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const frontendDir = path.resolve(__dirname, '..')
const distDir = path.join(frontendDir, 'dist')
const serverEntryUrl = pathToFileURL(path.join(distDir, 'server', 'entry-server.js')).href

const { prerenderRoutes, render } = await import(serverEntryUrl)
const template = await fs.readFile(path.join(distDir, 'index.html'), 'utf8')

const injectDocument = (html, { title, description }) =>
  html
    .replace(/<title>.*?<\/title>/, `<title>${title}</title>`)
    .replace(
      /<meta[\s\S]*?name="description"[\s\S]*?content="[^"]*"[\s\S]*?\/>/,
      `<meta name="description" content="${description}" />`
    )
    .replace('<div id="root"></div>', `<div id="root">${htmlContentPlaceholder}</div>`)

const htmlContentPlaceholder = '__PRERENDERED_APP__'

for (const route of prerenderRoutes) {
  const { appHtml, head } = render(route)
  const documentHtml = injectDocument(template, head).replace(htmlContentPlaceholder, appHtml)
  const outputPath =
    route === '/'
      ? path.join(distDir, 'index.html')
      : path.join(distDir, route.slice(1), 'index.html')

  await fs.mkdir(path.dirname(outputPath), { recursive: true })
  await fs.writeFile(outputPath, documentHtml, 'utf8')
}

await fs.rm(path.join(distDir, 'server'), { recursive: true, force: true })
