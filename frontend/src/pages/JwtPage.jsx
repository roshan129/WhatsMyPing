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

const EMPTY_OUTPUT = 'Decoded header and payload will appear here.'

const formatJson = (value) => JSON.stringify(value, null, 2)

const CopyIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="jwt-icon">
    <path
      d="M9 9h9v11H9zM6 5h9v2H8v9H6z"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="jwt-icon">
    <path
      d="M5 12.5 9.5 17 19 7.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

function JwtPage({ page }) {
  const [input, setInput] = useState('')
  const [headerOutput, setHeaderOutput] = useState('')
  const [payloadOutput, setPayloadOutput] = useState('')
  const [meta, setMeta] = useState(null)
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [copyHeaderLabel, setCopyHeaderLabel] = useState('Copy Header')
  const [copyPayloadLabel, setCopyPayloadLabel] = useState('Copy Payload')
  const [headerCopied, setHeaderCopied] = useState(false)
  const [payloadCopied, setPayloadCopied] = useState(false)
  const apiBase = import.meta.env.VITE_API_BASE_URL || ''

  useEffect(() => {
    updateMetadata(page.title, page.description)
  }, [page.description, page.title])

  useEffect(() => {
    setInput('')
    setHeaderOutput('')
    setPayloadOutput('')
    setMeta(null)
    setError(null)
    setIsLoading(false)
    setCopyHeaderLabel('Copy Header')
    setCopyPayloadLabel('Copy Payload')
    setHeaderCopied(false)
    setPayloadCopied(false)
  }, [page.path])

  const handleDecode = async () => {
    if (!input.trim()) {
      setError('Paste a JWT to decode it first.')
      setHeaderOutput('')
      setPayloadOutput('')
      setMeta(null)
      return
    }

    setIsLoading(true)
    setError(null)
    setHeaderOutput('')
    setPayloadOutput('')
    setMeta(null)
    setCopyHeaderLabel('Copy Header')
    setCopyPayloadLabel('Copy Payload')
    setHeaderCopied(false)
    setPayloadCopied(false)

    try {
      const response = await fetch(`${apiBase}/api/jwt/decode`, {
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

      setHeaderOutput(formatJson(data.header || {}))
      setPayloadOutput(formatJson(data.payload || {}))
      setMeta(data.meta || null)
    } catch (err) {
      console.error(err)
      setError(err.message || 'Could not decode the JWT right now.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleClear = () => {
    setInput('')
    setHeaderOutput('')
    setPayloadOutput('')
    setMeta(null)
    setError(null)
    setCopyHeaderLabel('Copy Header')
    setCopyPayloadLabel('Copy Payload')
    setHeaderCopied(false)
    setPayloadCopied(false)
  }

  const handleCopy = async (value, target) => {
    if (!value) {
      return
    }

    try {
      await navigator.clipboard.writeText(value)
      if (target === 'header') {
        setCopyHeaderLabel('Copied Header')
        setCopyPayloadLabel('Copy Payload')
        setHeaderCopied(true)
        setPayloadCopied(false)
        window.setTimeout(() => {
          setHeaderCopied(false)
          setCopyHeaderLabel('Copy Header')
        }, 1000)
      } else {
        setCopyPayloadLabel('Copied Payload')
        setCopyHeaderLabel('Copy Header')
        setPayloadCopied(true)
        setHeaderCopied(false)
        window.setTimeout(() => {
          setPayloadCopied(false)
          setCopyPayloadLabel('Copy Payload')
        }, 1000)
      }
    } catch (err) {
      console.error(err)
      if (target === 'header') {
        setCopyHeaderLabel('Copy Failed')
      } else {
        setCopyPayloadLabel('Copy Failed')
      }
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
        <div className="hero-text jwt-hero-text">
          <p className="eyebrow">{page.eyebrow}</p>
          <h1>{page.h1}</h1>
          <p className="subtitle">{page.subtitle}</p>
        </div>
        <div className="hero-card jwt-hero-card">
          <p className="hero-label">Tool focus</p>
          <p className="hero-value">{page.toolFocus || 'JWT decoding'}</p>
          <p className="hero-meta">{page.heroNote}</p>
        </div>
      </header>

      <section className="card" aria-label="JWT decoder tool">
        <div className="jwt-workspace">
          <div className="jwt-input-panel">
            <div className="jwt-panel-top">
              <div>
                <p className="hero-label">Input</p>
                <h2>Paste the full token</h2>
                <p className="hero-meta">{page.formHint}</p>
              </div>
              <div className="jwt-status-badge">{isLoading ? 'Decoding now' : meta ? 'Decoded' : 'Ready'}</div>
            </div>

            <textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              className="json-textarea jwt-input"
              spellCheck="false"
              aria-label="JWT input"
              placeholder="Paste your JWT here"
            />

            {error && <p className="error">{error}</p>}

            <article className="jwt-meta-card jwt-meta-highlight jwt-timing-summary">
              <p className="hero-label">Timing Hints</p>
              <div className="jwt-timing-list">
                <div className="jwt-timing-row">
                  <span className="jwt-timing-name">Issued At</span>
                  <span className="jwt-timing-text">{meta?.issuedAt || 'Not present'}</span>
                </div>
                <div className="jwt-timing-row">
                  <span className="jwt-timing-name">Not Before</span>
                  <span className="jwt-timing-text">{meta?.notBefore || 'Not present'}</span>
                </div>
                <div className="jwt-timing-row">
                  <span className="jwt-timing-name">Expires At</span>
                  <span className="jwt-timing-text">{meta?.expiresAt || 'Not present'}</span>
                </div>
              </div>
              <p className="hero-meta">Use these timestamps as inspection hints, not trust verification.</p>
            </article>
          </div>

          <div className="jwt-inspector">
            <div className="controls jwt-controls">
              <button onClick={handleDecode} disabled={isLoading} className="primary-button">
                {isLoading ? 'Decoding…' : 'Decode JWT'}
              </button>
              <button onClick={handleClear} className="secondary-button">
                Clear
              </button>
            </div>

            <div className="jwt-output-grid">
              <div className="json-panel jwt-output-panel">
                <div className="json-panel-header jwt-output-header">
                  <div>
                    <h2>Decoded header</h2>
                    <p>{headerOutput ? 'Header fields are ready to inspect or copy.' : 'Decode a JWT to inspect the header.'}</p>
                  </div>
                  <button
                    onClick={() => handleCopy(headerOutput, 'header')}
                    className="secondary-button jwt-icon-button"
                    disabled={!headerOutput}
                    aria-label={copyHeaderLabel}
                    title={copyHeaderLabel}
                  >
                    {headerCopied ? <CheckIcon /> : <CopyIcon />}
                  </button>
                </div>
                <pre className="json-output jwt-output" aria-label="Decoded JWT header">
                  {headerOutput || EMPTY_OUTPUT}
                </pre>
              </div>

              <div className="json-panel jwt-output-panel">
                <div className="json-panel-header jwt-output-header">
                  <div>
                    <h2>Decoded payload</h2>
                    <p>{payloadOutput ? 'Claims are ready to review or copy.' : 'Decode a JWT to inspect the payload.'}</p>
                  </div>
                  <button
                    onClick={() => handleCopy(payloadOutput, 'payload')}
                    className="secondary-button jwt-icon-button"
                    disabled={!payloadOutput}
                    aria-label={copyPayloadLabel}
                    title={copyPayloadLabel}
                  >
                    {payloadCopied ? <CheckIcon /> : <CopyIcon />}
                  </button>
                </div>
                <pre className="json-output jwt-output" aria-label="Decoded JWT payload">
                  {payloadOutput || EMPTY_OUTPUT}
                </pre>
              </div>
            </div>

            <div className="jwt-meta-grid">
              <article className="jwt-meta-card jwt-meta-highlight">
                <p className="hero-label">Algorithm</p>
                <p className="jwt-meta-value">{meta?.algorithm || 'Unknown'}</p>
                <p className="hero-meta">Declared in the header as `alg`.</p>
              </article>
              <article className="jwt-meta-card jwt-meta-highlight">
                <p className="hero-label">Token Type</p>
                <p className="jwt-meta-value">{meta?.type || 'Unknown'}</p>
                <p className="hero-meta">Usually `JWT`, but not always present.</p>
              </article>
              <article className="jwt-meta-card jwt-meta-highlight">
                <p className="hero-label">Signature</p>
                <p className="jwt-meta-value">{meta ? (meta.hasSignature ? 'Present' : 'Missing') : 'Waiting'}</p>
                <p className="hero-meta">Presence only. This page does not verify it.</p>
              </article>
            </div>
          </div>
        </div>

        <div className="related-links">
          <h2>Related checks</h2>
          <div className="tool-grid">
            <AppLink href="/json-formatter" className="tool-card">
              <span className="tool-card-title">Format JSON</span>
              <span className="tool-card-copy">
                Clean up JWT claims or related payloads after decoding when you want to inspect larger JSON structures.
              </span>
            </AppLink>
            <AppLink href="/base64-decode" className="tool-card">
              <span className="tool-card-title">Base64 Decoder</span>
              <span className="tool-card-copy">
                Compare Base64 and Base64URL workflows when you are debugging encoded headers, payloads, or config fragments.
              </span>
            </AppLink>
            <AppLink href="/uuid-generator" className="tool-card">
              <span className="tool-card-title">UUID Generator</span>
              <span className="tool-card-copy">
                Generate UUIDs for subjects, request IDs, or fixture data when a JWT workflow overlaps with test setup.
              </span>
            </AppLink>
            <AppLink href="/url-encode" className="tool-card">
              <span className="tool-card-title">URL Encoder</span>
              <span className="tool-card-copy">
                Encode callback URLs or parameter values when your auth debugging flow moves from tokens into redirects.
              </span>
            </AppLink>
          </div>
        </div>

        <div className="jwt-banner">
          <div>
            <p className="hero-label">Decode-only mode</p>
            <h2>Inspect claims fast without pretending to verify trust.</h2>
            <p className="hero-meta">
              This tool decodes JWT structure for debugging and review. It does not verify the signature,
              issuer, audience, or signing key.
            </p>
          </div>
          <div className="jwt-token-map" aria-label="JWT token structure">
            <span className="jwt-token-part jwt-token-header">Header</span>
            <span className="jwt-token-dot">.</span>
            <span className="jwt-token-part jwt-token-payload">Payload</span>
            <span className="jwt-token-dot">.</span>
            <span className="jwt-token-part jwt-token-signature">Signature</span>
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

export default JwtPage
