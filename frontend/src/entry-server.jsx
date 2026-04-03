import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import App from './App'
import { getRouteForPath } from './routes'

const escapeAttribute = (value) =>
  String(value).replaceAll('&', '&amp;').replaceAll('"', '&quot;')

export const prerenderRoutes = [
  '/',
  '/ping-test',
  '/ping-google',
  '/ping-cloudflare',
  '/ping-discord',
  '/ping-youtube',
  '/ping-aws',
  '/what-is-my-ip',
  '/ip-check',
  '/check-my-ip',
  '/my-ip-address',
  '/ip-lookup',
  '/dns-lookup',
  '/dns-check',
  '/check-dns-records',
  '/mx-lookup',
  '/txt-lookup',
  '/json-formatter',
  '/json-pretty-print',
  '/json-validator',
  '/json-viewer',
  '/base64-encode',
  '/base64-decode',
  '/text-to-base64',
  '/base64-to-text',
  '/url-encode',
  '/url-decode',
  '/encode-url',
  '/decode-url',
  '/uuid-generator',
  '/generate-uuid',
  '/uuid-v4-generator',
  '/random-uuid-generator',
  '/uuid-generator-online',
  '/jwt-decoder',
  '/decode-jwt',
  '/jwt-parser',
  '/jwt-inspector',
  '/jwt-decoder-online',
  '/timestamp-converter',
  '/unix-timestamp-converter',
  '/epoch-converter',
  '/convert-timestamp',
  '/timestamp-to-date',
]

export function render(url) {
  const page = getRouteForPath(url)
  const appHtml = renderToString(
    <StrictMode>
      <App initialPath={url} />
    </StrictMode>
  )

  return {
    appHtml,
    head: {
      title: page.title,
      description: escapeAttribute(page.description),
    },
  }
}
