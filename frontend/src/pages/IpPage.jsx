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

function IpPage({ page }) {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const apiBase = import.meta.env.VITE_API_BASE_URL || ''

  useEffect(() => {
    updateMetadata(page.title, page.description)
  }, [page.description, page.title])

  useEffect(() => {
    let isCancelled = false

    const loadIp = async () => {
      setIsLoading(true)
      setError(null)
      setData(null)

      try {
        const response = await fetch(`${apiBase}/api/ip`)
        if (!response.ok) {
          throw new Error(`Server responded with ${response.status}`)
        }

        const nextData = await response.json()
        if (!isCancelled) {
          setData(nextData)
        }
      } catch (err) {
        console.error(err)
        if (!isCancelled) {
          setError('Could not load your IP information. Make sure the backend is running.')
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false)
        }
      }
    }

    loadIp()

    return () => {
      isCancelled = true
    }
  }, [apiBase, page.path])

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
          <p className="hero-label">Lookup status</p>
          <p className="hero-value">
            {isLoading ? 'Loading' : error ? 'Unavailable' : 'Ready'}
          </p>
          <p className="hero-meta">{page.heroNote}</p>
        </div>
      </header>

      <section className="card" aria-label="IP lookup results">
        {isLoading && <p className="loading-copy">Checking your current public IP address…</p>}
        {error && <p className="error">{error}</p>}

        {data && !error && (
          <div className="results-grid">
            <div className="results" data-reveal="1">
              <p className="ping-label">Your IP address</p>
              <p className="ip-value">{data.ip ?? 'Unavailable'}</p>
            </div>
            <div className="stats" data-reveal="2">
              <h2>Connection details</h2>
              <ul className="ip-detail-list">
                <li>
                  <strong>IP version:</strong> {data.version ? `IPv${data.version}` : 'Unknown'}
                </li>
                <li>
                  <strong>User agent:</strong> {data.userAgent || 'Unavailable'}
                </li>
              </ul>
            </div>
          </div>
        )}

        <div className="related-links">
          <h2>Related checks</h2>
          <div className="tool-grid">
            <AppLink href="/ping-test" className="tool-card">
              <span className="tool-card-title">Run A Ping Test</span>
              <span className="tool-card-copy">
                Measure latency to Google and Cloudflare for a quick responsiveness baseline.
              </span>
            </AppLink>
            <AppLink href="/ping-google" className="tool-card">
              <span className="tool-card-title">Ping Google</span>
              <span className="tool-card-copy">
                Compare your current IP setup with a focused latency test to a major global network.
              </span>
            </AppLink>
            <AppLink href="/ping-cloudflare" className="tool-card">
              <span className="tool-card-title">Ping Cloudflare</span>
              <span className="tool-card-copy">
                Check how responsive your current connection feels to a nearby edge network.
              </span>
            </AppLink>
            <AppLink href="/dns-lookup" className="tool-card">
              <span className="tool-card-title">Run A DNS Lookup</span>
              <span className="tool-card-copy">
                Inspect DNS records after confirming your public IP and before digging into domain-level issues.
              </span>
            </AppLink>
            <AppLink href="/json-formatter" className="tool-card">
              <span className="tool-card-title">Format JSON</span>
              <span className="tool-card-copy">
                Validate and pretty print API payloads after confirming your connection and public IP details.
              </span>
            </AppLink>
            <AppLink href="/base64-encode" className="tool-card">
              <span className="tool-card-title">Base64 Encoder</span>
              <span className="tool-card-copy">
                Convert text or inspect encoded values while debugging API requests, headers, and environment setup.
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

export default IpPage
