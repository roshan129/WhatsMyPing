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

function UuidPage({ page }) {
  const [count, setCount] = useState('1')
  const [uuids, setUuids] = useState([])
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [copyAllLabel, setCopyAllLabel] = useState('Copy All')
  const [copiedUuidIndex, setCopiedUuidIndex] = useState(null)
  const apiBase = import.meta.env.VITE_API_BASE_URL || ''

  useEffect(() => {
    updateMetadata(page.title, page.description)
  }, [page.description, page.title])

  useEffect(() => {
    setCount('1')
    setUuids([])
    setError(null)
    setIsLoading(false)
    setCopyAllLabel('Copy All')
    setCopiedUuidIndex(null)
  }, [page.path])

  const generateUuids = async () => {
    setIsLoading(true)
    setError(null)
    setCopyAllLabel('Copy All')
    setCopiedUuidIndex(null)

    try {
      const response = await fetch(`${apiBase}/api/uuid?count=${count}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || `Server responded with ${response.status}`)
      }

      setUuids(Array.isArray(data.uuids) ? data.uuids : [])
    } catch (err) {
      console.error(err)
      setUuids([])
      setError(err.message || 'Could not generate UUIDs right now.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleClear = () => {
    setUuids([])
    setError(null)
    setCopyAllLabel('Copy All')
    setCopiedUuidIndex(null)
  }

  const handleCopyAll = async () => {
    if (!uuids.length) {
      return
    }

    try {
      await navigator.clipboard.writeText(uuids.join('\n'))
      setCopyAllLabel('Copied All')
    } catch (err) {
      console.error(err)
      setCopyAllLabel('Copy Failed')
    }
  }

  const handleCopyOne = async (uuid, index) => {
    try {
      await navigator.clipboard.writeText(uuid)
      setCopiedUuidIndex(index)
      setCopyAllLabel('Copy All')
    } catch (err) {
      console.error(err)
      setCopiedUuidIndex(null)
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
          <p className="hero-value">{page.toolFocus || 'UUID v4 generation'}</p>
          <p className="hero-meta">{page.heroNote}</p>
        </div>
      </header>

      <section className="card" aria-label="UUID generator tool">
        <div className="controls">
          <label className="control-field" htmlFor="uuid-count">
            <span className="dns-label">Number of UUIDs</span>
            <select
              id="uuid-count"
              value={count}
              onChange={(event) => setCount(event.target.value)}
              className="dns-input"
              aria-label="Number of UUIDs"
            >
              {Array.from({ length: 20 }, (_, index) => String(index + 1)).map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </label>
          <button onClick={generateUuids} disabled={isLoading} className="primary-button">
            {isLoading ? 'Generating…' : 'Generate UUIDs'}
          </button>
          <button
            onClick={generateUuids}
            disabled={isLoading || !uuids.length}
            className="secondary-button"
          >
            Regenerate
          </button>
          <button onClick={handleClear} className="secondary-button">
            Clear
          </button>
          <button onClick={handleCopyAll} disabled={!uuids.length} className="secondary-button">
            {copyAllLabel}
          </button>
        </div>

        {error && <p className="error">{error}</p>}

        {!uuids.length && !error && !isLoading && (
          <p className="loading-copy">
            Choose how many UUID v4 values you want, then generate a fresh batch instantly.
          </p>
        )}

        {uuids.length > 0 && (
          <>
            <div className="results-grid">
              <div className="results" data-reveal="1">
                <p className="ping-label">Generated</p>
                <p className="ip-value">{uuids.length}</p>
              </div>
              <div className="stats" data-reveal="2">
                <h2>Batch details</h2>
                <ul>
                  <li>
                    <strong>Version:</strong> UUID v4
                  </li>
                  <li>
                    <strong>Copy mode:</strong> Single or full batch
                  </li>
                  <li>
                    <strong>Current route:</strong> {page.shortLabel}
                  </li>
                </ul>
              </div>
            </div>

            <div className="target-breakdown" data-reveal="3">
              <h2>Generated UUIDs</h2>
              <div className="uuid-list">
                {uuids.map((uuid, index) => (
                  <article key={`${uuid}-${index}`} className="uuid-card">
                    <div className="uuid-card-header">
                      <p className="ping-label">UUID {index + 1}</p>
                      <button
                        onClick={() => handleCopyOne(uuid, index)}
                        className="secondary-button"
                        aria-label={`Copy UUID ${index + 1}`}
                      >
                        {copiedUuidIndex === index ? 'Copied' : `Copy UUID ${index + 1}`}
                      </button>
                    </div>
                    <pre className="json-output uuid-value" aria-label={`UUID ${index + 1} value`}>
                      {uuid}
                    </pre>
                  </article>
                ))}
              </div>
            </div>
          </>
        )}

        <div className="related-links">
          <h2>Related checks</h2>
          <div className="tool-grid">
            <AppLink href="/json-formatter" className="tool-card">
              <span className="tool-card-title">Format JSON</span>
              <span className="tool-card-copy">
                Drop generated UUIDs into payloads or API fixtures, then pretty print the full JSON before using it.
              </span>
            </AppLink>
            <AppLink href="/base64-encode" className="tool-card">
              <span className="tool-card-title">Base64 Encoder</span>
              <span className="tool-card-copy">
                Move into Base64 encoding when a generated UUID needs to travel inside a token, config blob, or test fixture.
              </span>
            </AppLink>
            <AppLink href="/url-encode" className="tool-card">
              <span className="tool-card-title">URL Encoder</span>
              <span className="tool-card-copy">
                Encode generated UUIDs for query strings, callback values, or link parameters without leaving Roswag.
              </span>
            </AppLink>
            <AppLink href="/ping-test" className="tool-card">
              <span className="tool-card-title">Run A Ping Test</span>
              <span className="tool-card-copy">
                Jump back into network checks after creating IDs for requests, payloads, or debugging sessions.
              </span>
            </AppLink>
            <AppLink href="/jwt-decoder" className="tool-card">
              <span className="tool-card-title">JWT Decoder</span>
              <span className="tool-card-copy">
                Inspect JWT claims when generated UUIDs end up inside auth subjects, request IDs, or fixture tokens.
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

export default UuidPage
