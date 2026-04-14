import { useEffect, useState } from 'react'
import { navPages, toolPages } from '../seoContent'

const updateMetadata = (title, description) => {
  document.title = title

  let meta = document.querySelector('meta[name="description"]')
  if (!meta) {
    meta = document.createElement('meta')
    meta.setAttribute('name', 'description')
    document.head.appendChild(meta)
  }
  meta.setAttribute('content', description)
}

const toTrailingSlashPath = (value) => {
  if (!value || value === '/') {
    return '/'
  }

  return `${value.replace(/\/+$/, '')}/`
}

const AppLink = ({ href, children, className }) => {
  const canonicalHref = toTrailingSlashPath(href)

  const handleClick = (event) => {
    if (
      event.defaultPrevented ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      event.button !== 0
    ) {
      return
    }

    event.preventDefault()
    window.history.pushState({}, '', canonicalHref)
    window.dispatchEvent(new PopStateEvent('popstate'))
  }

  return (
    <a href={canonicalHref} onClick={handleClick} className={className}>
      {children}
    </a>
  )
}

const MODE_ROUTE_MAP = {
  encode: '/base64-encode',
  decode: '/base64-decode',
}

function Base64Page({ page }) {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [copyLabel, setCopyLabel] = useState('Copy Output')
  const apiBase = import.meta.env.VITE_API_BASE_URL || ''
  const isEncodeMode = page.mode === 'encode'
  const inputLabel = isEncodeMode ? 'Text input' : 'Base64 input'
  const outputLabel = isEncodeMode ? 'Base64 output' : 'Decoded text'
  const inputPlaceholder = isEncodeMode
    ? 'Paste your text here'
    : 'Paste your Base64 here'

  useEffect(() => {
    updateMetadata(page.title, page.description)
  }, [page.description, page.title])

  useEffect(() => {
    setInput('')
    setOutput('')
    setError(null)
    setIsLoading(false)
    setCopyLabel('Copy Output')
  }, [page.path])

  const handleModeChange = (mode) => {
    const nextPath = MODE_ROUTE_MAP[mode]
    if (!nextPath || nextPath === page.path) {
      return
    }

    window.history.pushState({}, '', toTrailingSlashPath(nextPath))
    window.dispatchEvent(new PopStateEvent('popstate'))
  }

  const handleConvert = async () => {
    if (!input.length) {
      setError(isEncodeMode ? 'Paste text to encode first.' : 'Paste Base64 to decode first.')
      setOutput('')
      return
    }

    setIsLoading(true)
    setError(null)
    setOutput('')
    setCopyLabel('Copy Output')

    try {
      const endpoint = isEncodeMode ? '/api/base64/encode' : '/api/base64/decode'
      const response = await fetch(`${apiBase}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input }),
      })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || `Server responded with ${response.status}`)
      }

      setOutput(data.output || '')
    } catch (err) {
      console.error(err)
      setError(err.message || 'Could not convert the Base64 input right now.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleClear = () => {
    setInput('')
    setOutput('')
    setError(null)
    setCopyLabel('Copy Output')
  }

  const handleCopy = async () => {
    if (!output) {
      return
    }

    try {
      await navigator.clipboard.writeText(output)
      setCopyLabel('Copied')
    } catch (err) {
      console.error(err)
      setCopyLabel('Copy Failed')
    }
  }

  return (
    <main className="app">
      <header className="site-header">
        <AppLink href="/" className="brand-lockup" aria-label="Roswag home">
          <span className="brand">Roswag</span>
          <span className="brand-subtitle">Developer &amp; Network Tools</span>
        </AppLink>
        <nav className="top-nav" aria-label="Popular tools">
          {navPages.map((toolPage) => (
            <AppLink
              key={toolPage.path}
              href={toolPage.path}
              className={`nav-link ${toolPage.path === page.path ? 'active' : ''}`}
            >
              {toolPage.navLabel}
            </AppLink>
          ))}
        </nav>
      </header>

      <header className="hero">
        <div className="hero-text">
          <p className="eyebrow">{page.eyebrow}</p>
          <h1>{page.h1}</h1>
          <p className="subtitle">{page.subtitle}</p>
        </div>
        <div className="hero-card">
          <p className="hero-label">Tool focus</p>
          <p className="hero-value">{page.toolFocus || 'Base64 encode and decode'}</p>
          <p className="hero-meta">{page.heroNote}</p>
        </div>
      </header>

      <section className="card" aria-label="Base64 conversion tool">
        <div className="controls">
          <button
            onClick={() => handleModeChange('encode')}
            className={`secondary-button ${isEncodeMode ? 'active' : ''}`}
          >
            Encode
          </button>
          <button
            onClick={() => handleModeChange('decode')}
            className={`secondary-button ${!isEncodeMode ? 'active' : ''}`}
          >
            Decode
          </button>
          <button onClick={handleConvert} disabled={isLoading} className="primary-button">
            {isLoading ? 'Converting…' : isEncodeMode ? 'Encode To Base64' : 'Decode Base64'}
          </button>
          <button onClick={handleClear} className="secondary-button">
            Clear
          </button>
          <button onClick={handleCopy} className="secondary-button" disabled={!output}>
            {copyLabel}
          </button>
        </div>

        {error && <p className="error">{error}</p>}

        <div className="json-layout">
          <div className="json-panel">
            <div className="json-panel-header">
              <h2>{inputLabel}</h2>
              <p>{page.formHint}</p>
            </div>
            <textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              className="json-textarea"
              spellCheck="false"
              aria-label={inputLabel}
              placeholder={inputPlaceholder}
            />
          </div>

          <div className="json-panel">
            <div className="json-panel-header">
              <h2>{outputLabel}</h2>
              <p>{output ? 'Ready to copy or review.' : 'Run the converter to see output here.'}</p>
            </div>
            <pre className="json-output" aria-label={outputLabel}>
              {output || 'Converted output will appear here.'}
            </pre>
          </div>
        </div>

        <div className="related-links">
          <h2>Related checks</h2>
          <div className="tool-grid">
            <AppLink href="/json-formatter" className="tool-card">
              <span className="tool-card-title">Format JSON</span>
              <span className="tool-card-copy">
                Clean up structured payloads after decoding Base64 or before encoding content for transport.
              </span>
            </AppLink>
            <AppLink href="/dns-lookup" className="tool-card">
              <span className="tool-card-title">Run A DNS Lookup</span>
              <span className="tool-card-copy">
                Check DNS records when encoded configuration values are part of a broader deployment or debugging flow.
              </span>
            </AppLink>
            <AppLink href="/what-is-my-ip" className="tool-card">
              <span className="tool-card-title">Check Your IP</span>
              <span className="tool-card-copy">
                Confirm your network context before debugging APIs, gateways, or services that exchange encoded data.
              </span>
            </AppLink>
            <AppLink href="/url-encode" className="tool-card">
              <span className="tool-card-title">URL Encoder</span>
              <span className="tool-card-copy">
                Move between Base64 and URL encoding quickly when a debugging workflow includes both transport-safe formats.
              </span>
            </AppLink>
            <AppLink href="/uuid-generator" className="tool-card">
              <span className="tool-card-title">UUID Generator</span>
              <span className="tool-card-copy">
                Generate fresh UUID v4 values when encoded payloads, fixtures, or tokens need stable-looking unique IDs.
              </span>
            </AppLink>
            <AppLink href="/jwt-decoder" className="tool-card">
              <span className="tool-card-title">JWT Decoder</span>
              <span className="tool-card-copy">
                Inspect token headers and payloads when Base64-style encoded auth values need a clearer, JSON-first view.
              </span>
            </AppLink>
          </div>
        </div>
      </section>

      <section className="learn" aria-label={page.introHeading}>
        <div className="learn-header">
          <h2>{page.introHeading}</h2>
          <p>{page.introBody}</p>
        </div>

        {page.quickFacts?.length > 0 && (
          <div className="quick-facts">
            <h2>{page.quickFactsHeading}</h2>
            <div className="range-grid">
              {page.quickFacts.map((fact) => (
                <article key={fact} className="range-card">
                  <p>{fact}</p>
                </article>
              ))}
            </div>
          </div>
        )}

        <div className="seo-copy">
          {page.sections.map((section) => (
            <article key={section.title} className="copy-card">
              <h3>{section.title}</h3>
              <p>{section.body}</p>
            </article>
          ))}
        </div>

        <div className="tool-links">
          <h2>Popular Tools</h2>
          <div className="tool-grid">
            {toolPages.map((toolPage) => (
              <AppLink key={toolPage.path} href={toolPage.path} className="tool-card">
                <span className="tool-card-title">{toolPage.navLabel}</span>
                <span className="tool-card-copy">{toolPage.description}</span>
              </AppLink>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}

export default Base64Page
