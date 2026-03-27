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

const formatRecordValue = (type, value) => {
  if (type === 'MX' && value && typeof value === 'object') {
    if (value.isNullMx) {
      return 'Null MX (this domain does not accept email)'
    }

    return `Priority ${value.priority} - ${value.exchange}`
  }

  return String(value)
}

function DnsPage({ page }) {
  const [domain, setDomain] = useState('')
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const apiBase = import.meta.env.VITE_API_BASE_URL || ''

  useEffect(() => {
    updateMetadata(page.title, page.description)
  }, [page.description, page.title])

  useEffect(() => {
    setDomain('')
    setData(null)
    setError(null)
    setIsLoading(false)
  }, [page.exampleDomain, page.path])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setIsLoading(true)
    setError(null)
    setData(null)

    try {
      const params = new URLSearchParams({ domain })
      const response = await fetch(`${apiBase}/api/dns?${params.toString()}`)
      const nextData = await response.json()

      if (!response.ok) {
        throw new Error(nextData.error || `Server responded with ${response.status}`)
      }

      setData(nextData)
    } catch (err) {
      console.error(err)
      setError(err.message || 'Could not load DNS records. Make sure the backend is running.')
    } finally {
      setIsLoading(false)
    }
  }

  const recordEntries = data ? Object.entries(data.records || {}) : []

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
          <p className="hero-label">Lookup focus</p>
          <p className="hero-value">{page.lookupFocus || 'Common DNS records'}</p>
          <p className="hero-meta">{page.heroNote}</p>
        </div>
      </header>

      <section className="card" aria-label="DNS lookup form and results">
        <form className="dns-form" onSubmit={handleSubmit}>
          <label className="dns-label" htmlFor="dns-domain">
            Domain or subdomain
          </label>
          <div className="controls dns-controls">
            <input
              id="dns-domain"
              name="domain"
              type="text"
              value={domain}
              onChange={(event) => setDomain(event.target.value)}
              className="dns-input"
              placeholder={page.placeholder || page.exampleDomain || 'example.com'}
              autoComplete="off"
              spellCheck="false"
            />
            <button type="submit" disabled={isLoading} className="primary-button">
              {isLoading ? 'Checking DNS…' : 'Check DNS Records'}
            </button>
          </div>
          <p className="hero-meta">{page.formHint}</p>
        </form>

        {error && <p className="error">{error}</p>}

        {!data && !error && !isLoading && (
          <p className="loading-copy">
            Enter a domain like <strong>{page.exampleDomain || 'example.com'}</strong> to inspect
            its DNS records.
          </p>
        )}

        {data && !error && (
          <>
            <div className="results-grid">
              <div className="results" data-reveal="1">
                <p className="ping-label">Queried domain</p>
                <p className="ip-value">{data.domain}</p>
              </div>
              <div className="stats" data-reveal="2">
                <h2>Lookup details</h2>
                <ul className="ip-detail-list">
                  <li>
                    <strong>Record groups:</strong> {recordEntries.length}
                  </li>
                  <li>
                    <strong>Queried at:</strong> {new Date(data.queriedAt).toLocaleString()}
                  </li>
                  <li>
                    <strong>Warnings:</strong> {data.warnings?.length ? data.warnings.join(', ') : 'None'}
                  </li>
                </ul>
              </div>
            </div>

            <div className="target-breakdown" data-reveal="3">
              <h2>DNS records</h2>
              <div className="record-grid">
                {recordEntries.map(([type, values]) => (
                  <article key={type} className="record-card">
                    <div className="record-header">
                      <h3>{type}</h3>
                      <span className="record-badge">{values.length} found</span>
                    </div>
                    {values.length > 0 ? (
                      <ul className="record-list">
                        {values.map((value) => {
                          const key = typeof value === 'object' ? JSON.stringify(value) : value
                          return <li key={`${type}-${key}`}>{formatRecordValue(type, value)}</li>
                        })}
                      </ul>
                    ) : (
                      <p className="record-empty">No {type} records were returned for this lookup.</p>
                    )}
                  </article>
                ))}
              </div>
            </div>
          </>
        )}

        <div className="related-links">
          <h2>Related checks</h2>
          <div className="tool-grid">
            <AppLink href="/ping-test" className="tool-card">
              <span className="tool-card-title">Run A Ping Test</span>
              <span className="tool-card-copy">
                Check whether latency problems are showing up alongside your DNS setup.
              </span>
            </AppLink>
            <AppLink href="/what-is-my-ip" className="tool-card">
              <span className="tool-card-title">Check Your IP</span>
              <span className="tool-card-copy">
                Confirm the public IP and version your current network is using before deeper debugging.
              </span>
            </AppLink>
            <AppLink href="/ping-google" className="tool-card">
              <span className="tool-card-title">Ping Google</span>
              <span className="tool-card-copy">
                Compare DNS results with a quick latency check to a widely reachable network.
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

export default DnsPage
