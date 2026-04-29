import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const frontendDir = path.resolve(__dirname, '..')
const distDir = path.join(frontendDir, 'dist')
const serverEntryUrl = pathToFileURL(path.join(distDir, 'server', 'entry-server.js')).href
const siteUrl = (process.env.SITE_URL || 'https://roswag.com').replace(/\/+$/, '')

const { prerenderRoutes, render } = await import(serverEntryUrl)
const template = await fs.readFile(path.join(distDir, 'index.html'), 'utf8')

const ensureTrailingSlashRoute = (route) => (route === '/' ? '/' : `${route.replace(/\/+$/, '')}/`)

const canonicalForRoute = (route) => `${siteUrl}${ensureTrailingSlashRoute(route)}`

const injectCanonical = (html, canonicalUrl) => {
  const canonicalTag = `<link rel="canonical" href="${canonicalUrl}" />`

  if (/<link[^>]*rel="canonical"[^>]*>/i.test(html)) {
    return html.replace(/<link[^>]*rel="canonical"[^>]*>/i, canonicalTag)
  }

  return html.replace('</head>', `  ${canonicalTag}\n  </head>`)
}

const injectMetaKeywords = (html, keywords) => {
  if (!keywords) {
    return html
  }

  const tag = `<meta name="keywords" content="${keywords}" />`
  if (/<meta[^>]*name="keywords"[^>]*>/i.test(html)) {
    return html.replace(/<meta[^>]*name="keywords"[^>]*>/i, tag)
  }

  return html.replace('</head>', `  ${tag}\n  </head>`)
}

const injectDocument = (html, { title, description, keywords }, canonicalUrl) =>
  injectCanonical(
    injectMetaKeywords(
      html
        .replace(/<title>.*?<\/title>/, `<title>${title}</title>`)
        .replace(
          /<meta[\s\S]*?name="description"[\s\S]*?content="[^"]*"[\s\S]*?\/>/,
          `<meta name="description" content="${description}" />`
        )
        .replace('<div id="root"></div>', `<div id="root">${htmlContentPlaceholder}</div>`),
      keywords
    ),
    canonicalUrl
  )

const htmlContentPlaceholder = '__PRERENDERED_APP__'

for (const route of prerenderRoutes) {
  const { appHtml, head } = render(route)
  const documentHtml = injectDocument(template, head, canonicalForRoute(route)).replace(
    htmlContentPlaceholder,
    appHtml
  )
  const outputPath =
    route === '/'
      ? path.join(distDir, 'index.html')
      : path.join(distDir, route.slice(1), 'index.html')

  await fs.mkdir(path.dirname(outputPath), { recursive: true })
  await fs.writeFile(outputPath, documentHtml, 'utf8')
}

await fs.rm(path.join(distDir, 'server'), { recursive: true, force: true })
