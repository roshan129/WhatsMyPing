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

const AppLink = ({ href, children, className }) => {
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
    window.history.pushState({}, '', href)
    window.dispatchEvent(new PopStateEvent('popstate'))
  }

  return (
    <a href={href} onClick={handleClick} className={className}>
      {children}
    </a>
  )
}

const MODE_ROUTE_MAP = {
  format: '/timestamp-converter',
  parse: '/convert-timestamp',
}

const buildCopyText = (result) =>
  [
    `ISO: ${result.iso}`,
    `UTC: ${result.utc}`,
    `Local: ${result.local}`,
    `Unix seconds: ${result.unixSeconds}`,
    `Unix milliseconds: ${result.unixMilliseconds}`,
  ].join('\n')

function TimestampPage({ page }) {
  const [input, setInput] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [copyLabel, setCopyLabel] = useState('Copy Results')
  const apiBase = import.meta.env.VITE_API_BASE_URL || ''
  const isFormatMode = page.mode !== 'parse'
  const inputLabel = isFormatMode ? 'Unix timestamp input' : 'Date or date-time input'
  const inputPlaceholder = isFormatMode ? '1710000000 or 1710000000000' : '2026-04-03T10:30:00Z'
  const primaryOutputLabel = isFormatMode ? 'ISO output' : 'Unix seconds output'
  const primaryOutputValue = result ? (isFormatMode ? result.iso : String(result.unixSeconds)) : ''

  useEffect(() => {
    updateMetadata(page.title, page.description)
  }, [page.description, page.title])

  useEffect(() => {
    setInput('')
    setResult(null)
    setError(null)
    setIsLoading(false)
    setCopyLabel('Copy Results')
  }, [page.path])

  const handleModeChange = (mode) => {
    const nextPath = MODE_ROUTE_MAP[mode]
    if (!nextPath || nextPath === page.path) {
      return
    }

    window.history.pushState({}, '', nextPath)
    window.dispatchEvent(new PopStateEvent('popstate'))
  }

  const handleConvert = async () => {
    if (!input.trim()) {
      setError(isFormatMode ? 'Paste a Unix timestamp to convert it first.' : 'Paste a date or date-time value to convert it first.')
      setResult(null)
      return
    }

    setIsLoading(true)
    setError(null)
    setResult(null)
    setCopyLabel('Copy Results')

    try {
      const endpoint = isFormatMode ? '/api/timestamp/format' : '/api/timestamp/parse'
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

      setResult(data)
    } catch (err) {
      console.error(err)
      setError(err.message || 'Could not convert the timestamp value right now.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleClear = () => {
    setInput('')
    setResult(null)
    setError(null)
    setCopyLabel('Copy Results')
  }

  const handleCopy = async () => {
    if (!result) {
      return
    }

    try {
      await navigator.clipboard.writeText(buildCopyText(result))
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
          <p className="hero-value">{page.toolFocus || 'Unix time conversion'}</p>
          <p className="hero-meta">{page.heroNote}</p>
        </div>
      </header>

      <section className="card" aria-label="Timestamp converter tool">
        <div className="controls">
          <button
            onClick={() => handleModeChange('format')}
            className={`secondary-button ${isFormatMode ? 'active' : ''}`}
          >
            Timestamp to Date
          </button>
          <button
            onClick={() => handleModeChange('parse')}
            className={`secondary-button ${!isFormatMode ? 'active' : ''}`}
          >
            Date to Timestamp
          </button>
          <button onClick={handleConvert} disabled={isLoading} className="primary-button">
            {isLoading ? 'Converting…' : isFormatMode ? 'Convert Timestamp' : 'Convert Date'}
          </button>
          <button onClick={handleClear} className="secondary-button">
            Clear
          </button>
          <button onClick={handleCopy} className="secondary-button" disabled={!result}>
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
              <h2>{primaryOutputLabel}</h2>
              <p>{result ? 'Primary converted value is ready to copy or review.' : 'Run the converter to see the main output here.'}</p>
            </div>
            <pre className="json-output" aria-label={primaryOutputLabel}>
              {primaryOutputValue || 'Converted output will appear here.'}
            </pre>
          </div>
        </div>

        {result && (
          <div className="results-grid">
            <div className="results" data-reveal="1">
              <p className="ping-label">UTC</p>
              <p className="hero-meta">{result.utc}</p>
            </div>
            <div className="results" data-reveal="2">
              <p className="ping-label">Local</p>
              <p className="hero-meta">{result.local}</p>
            </div>
            <div className="results" data-reveal="3">
              <p className="ping-label">Unix Seconds</p>
              <p className="ip-value">{result.unixSeconds}</p>
            </div>
            <div className="results" data-reveal="3">
              <p className="ping-label">Unix Milliseconds</p>
              <p className="ip-value">{result.unixMilliseconds}</p>
            </div>
          </div>
        )}

        <div className="related-links">
          <h2>Related checks</h2>
          <div className="tool-grid">
            <AppLink href="/json-formatter" className="tool-card">
              <span className="tool-card-title">Format JSON</span>
              <span className="tool-card-copy">
                Clean up payloads that include timestamp fields before sending them to APIs or test fixtures.
              </span>
            </AppLink>
            <AppLink href="/uuid-generator" className="tool-card">
              <span className="tool-card-title">UUID Generator</span>
              <span className="tool-card-copy">
                Generate IDs alongside timestamp values when you are preparing events, records, or import data.
              </span>
            </AppLink>
            <AppLink href="/jwt-decoder" className="tool-card">
              <span className="tool-card-title">JWT Decoder</span>
              <span className="tool-card-copy">
                Inspect `iat`, `nbf`, and `exp` claims and compare them with readable timestamps during auth debugging.
              </span>
            </AppLink>
            <AppLink href="/url-encode" className="tool-card">
              <span className="tool-card-title">URL Encoder</span>
              <span className="tool-card-copy">
                Encode converted timestamps when they need to travel inside URLs, redirects, or query parameters.
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

export default TimestampPage
