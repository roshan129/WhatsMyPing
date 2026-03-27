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

function JsonPage({ page }) {
  const [input, setInput] = useState(page.exampleInput || '{\n  "hello": "world"\n}')
  const [formatted, setFormatted] = useState('')
  const [error, setError] = useState(null)
  const [errorDetails, setErrorDetails] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [copyLabel, setCopyLabel] = useState('Copy Output')
  const apiBase = import.meta.env.VITE_API_BASE_URL || ''

  useEffect(() => {
    updateMetadata(page.title, page.description)
  }, [page.description, page.title])

  useEffect(() => {
    setInput(page.exampleInput || '{\n  "hello": "world"\n}')
    setFormatted('')
    setError(null)
    setErrorDetails(null)
    setIsLoading(false)
    setCopyLabel('Copy Output')
  }, [page.exampleInput, page.path])

  const handleFormat = async () => {
    if (!input.trim()) {
      setError('Paste JSON to format it first.')
      setErrorDetails(null)
      setFormatted('')
      return
    }

    setIsLoading(true)
    setError(null)
    setErrorDetails(null)
    setFormatted('')
    setCopyLabel('Copy Output')

    try {
      const response = await fetch(`${apiBase}/api/json/format`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input }),
      })
      const data = await response.json()

      if (!response.ok) {
        const requestError = new Error(data.error || `Server responded with ${response.status}`)
        requestError.details = data.details || null
        throw requestError
      }

      setFormatted(data.formatted || '')
    } catch (err) {
      console.error(err)
      setError(err.message || 'Could not format the JSON right now.')
      setErrorDetails(err.details || null)
    } finally {
      setIsLoading(false)
    }
  }

  const handleClear = () => {
    setInput('')
    setFormatted('')
    setError(null)
    setErrorDetails(null)
    setCopyLabel('Copy Output')
  }

  const handleCopy = async () => {
    if (!formatted) {
      return
    }

    try {
      await navigator.clipboard.writeText(formatted)
      setCopyLabel('Copied')
    } catch (err) {
      console.error(err)
      setCopyLabel('Copy Failed')
    }
  }

  return (
    <main className="app">
      <header className="site-header">
        <AppLink href="/" className="brand">
          What's My Ping?
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
          <p className="hero-value">{page.toolFocus || 'Format and validate JSON'}</p>
          <p className="hero-meta">{page.heroNote}</p>
        </div>
      </header>

      <section className="card" aria-label="JSON formatter tool">
        <div className="controls">
          <button onClick={handleFormat} disabled={isLoading} className="primary-button">
            {isLoading ? 'Formatting…' : 'Format JSON'}
          </button>
          <button onClick={handleClear} className="secondary-button">
            Clear
          </button>
          <button onClick={handleCopy} className="secondary-button" disabled={!formatted}>
            {copyLabel}
          </button>
        </div>

        {error && (
          <div className="error-block">
            <p className="error">{error}</p>
            {errorDetails && <p className="error-detail">Details: {errorDetails}</p>}
          </div>
        )}

        <div className="json-layout">
          <div className="json-panel">
            <div className="json-panel-header">
              <h2>Input JSON</h2>
              <p>{page.formHint}</p>
            </div>
            <textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              className="json-textarea"
              spellCheck="false"
              aria-label="JSON input"
            />
          </div>

          <div className="json-panel">
            <div className="json-panel-header">
              <h2>Formatted output</h2>
              <p>{formatted ? 'Ready to copy or review.' : 'Run the formatter to see output here.'}</p>
            </div>
            <pre className="json-output" aria-label="JSON output">
              {formatted || 'Formatted JSON will appear here.'}
            </pre>
          </div>
        </div>

        <div className="related-links">
          <h2>Related checks</h2>
          <div className="tool-grid">
            <AppLink href="/ping-test" className="tool-card">
              <span className="tool-card-title">Run A Ping Test</span>
              <span className="tool-card-copy">
                Switch back to network testing when you want to compare application issues with connection latency.
              </span>
            </AppLink>
            <AppLink href="/what-is-my-ip" className="tool-card">
              <span className="tool-card-title">Check Your IP</span>
              <span className="tool-card-copy">
                Confirm your current public IP before debugging remote APIs, allowlists, or environment access.
              </span>
            </AppLink>
            <AppLink href="/dns-lookup" className="tool-card">
              <span className="tool-card-title">Run A DNS Lookup</span>
              <span className="tool-card-copy">
                Inspect DNS records when the JSON is fine but the hostname or service route still looks wrong.
              </span>
            </AppLink>
            <AppLink href="/json-validator" className="tool-card">
              <span className="tool-card-title">Validate JSON</span>
              <span className="tool-card-copy">
                Use the validator-focused page when your main goal is checking whether a payload is structurally valid.
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

export default JsonPage
