import { useEffect, useRef, useState } from 'react'
import { navPages, toolPages } from '../seoContent'

const FEATURED_TOOL_PATHS = ['/ping-test', '/what-is-my-ip', '/dns-lookup', '/json-formatter']
const DISPLAY_FONT = { fontFamily: "'Bricolage Grotesque', sans-serif" }
const HOME_TERMINAL_LINES = [
  { text: '$ ping 8.8.8.8', type: 'cmd' },
  { text: 'seq=1  time=11ms  ttl=57', type: 'ok' },
  { text: 'seq=2  time=12ms  ttl=57', type: 'ok' },
  { text: 'seq=3  time=9ms   ttl=57', type: 'ok' },
  { text: '', type: 'blank' },
  { text: '$ your-ip', type: 'cmd' },
  { text: '203.0.113.47  IPv4  AS13335 Cloudflare', type: 'accent' },
  { text: '', type: 'blank' },
  { text: '$ json format', type: 'cmd' },
  { text: '{ "status": "valid", "keys": 12 }', type: 'accent' },
]

const getPingQuality = (latencyMs) => {
  if (latencyMs == null) return null

  if (latencyMs <= 30) {
    return { label: 'Excellent', color: '#16a34a' }
  }
  if (latencyMs <= 60) {
    return { label: 'Good', color: '#22c55e' }
  }
  if (latencyMs <= 100) {
    return { label: 'Playable', color: '#eab308' }
  }
  return { label: 'Poor', color: '#ef4444' }
}

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

const buildEndpoint = (apiBase, target, samples) => {
  const params = new URLSearchParams()
  params.set('samples', String(samples))
  if (target) {
    params.set('target', target)
  }
  return `${apiBase}/api/ping?${params.toString()}`
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

function TerminalPanel() {
  return (
    <div className="terminal-panel" aria-label="Roswag terminal preview">
      <div className="terminal-panel-header">
        <span className="terminal-dot" />
        <span className="terminal-dot" />
        <span className="terminal-dot" />
        <span className="terminal-title">roswag - terminal</span>
      </div>
      <div className="terminal-lines">
        {HOME_TERMINAL_LINES.map((line, index) => (
          <div key={`${line.text}-${index}`} className={`terminal-line ${line.type}`}>
            {line.text || '\u00a0'}
          </div>
        ))}
      </div>
    </div>
  )
}

function PingPage({ page }) {
  const [latencyMs, setLatencyMs] = useState(null)
  const [latestResult, setLatestResult] = useState(null)
  const [isTesting, setIsTesting] = useState(false)
  const [isContinuous, setIsContinuous] = useState(false)
  const [error, setError] = useState(null)
  const [history, setHistory] = useState([])
  const intervalRef = useRef(null)
  const apiBase = import.meta.env.VITE_API_BASE_URL || ''
  const isHomePage = page.path === '/'

  useEffect(() => {
    updateMetadata(page.title, page.description)
  }, [page.description, page.title])

  useEffect(() => {
    setLatencyMs(null)
    setLatestResult(null)
    setHistory([])
    setError(null)
    setIsTesting(false)
    setIsContinuous(false)
  }, [page.path])

  useEffect(() => {
    if (!isContinuous) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      return
    }

    const runPing = async () => {
      try {
        const response = await fetch(buildEndpoint(apiBase, page.target, 2))
        if (!response.ok) {
          throw new Error(`Server responded with ${response.status}`)
        }

        const data = await response.json()
        const latency = typeof data.latencyMs === 'number' ? Math.round(data.latencyMs) : null
        setLatencyMs(latency)
        setLatestResult(data)
        setHistory((prev) => {
          const next = [...prev, { timestamp: Date.now(), latency }]
          return next.slice(-60)
        })
        setError(null)
      } catch (err) {
        console.error(err)
        setError('Could not reach the ping server. Make sure the backend is running.')
      }
    }

    runPing()
    intervalRef.current = setInterval(runPing, 1000)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [apiBase, isContinuous, page.target])

  const handleCheckPing = async () => {
    setIsTesting(true)
    setError(null)

    try {
      const response = await fetch(buildEndpoint(apiBase, page.target, 4))
      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`)
      }

      const data = await response.json()
      const latency = typeof data.latencyMs === 'number' ? Math.round(data.latencyMs) : null
      setLatencyMs(latency)
      setLatestResult(data)
      setHistory((prev) => {
        const next = [...prev, { timestamp: Date.now(), latency }]
        return next.slice(-60)
      })
    } catch (err) {
      setError('Could not reach the ping server. Make sure the backend is running.')
      console.error(err)
    } finally {
      setIsTesting(false)
    }
  }

  const toggleContinuous = () => {
    setIsContinuous((prev) => !prev)
  }

  const quality = getPingQuality(latencyMs)
  const stats =
    history.length > 0
      ? {
          count: history.length,
          average: Math.round(history.reduce((sum, entry) => sum + entry.latency, 0) / history.length),
          min: Math.min(...history.map((entry) => entry.latency)),
          max: Math.max(...history.map((entry) => entry.latency)),
        }
      : null
  const latestHistoryLatency = history.length > 0 ? history[history.length - 1].latency : null
  const chartRangeLabel = stats ? `${stats.min} - ${stats.max} ms` : 'No range yet'

  const targetBreakdown = latestResult?.targets
    ? Object.entries(latestResult.targets)
    : latestResult?.target && typeof latestResult.latencyMs === 'number'
      ? [[latestResult.target, latestResult.latencyMs]]
      : []
  const featuredTools = toolPages.filter((toolPage) => FEATURED_TOOL_PATHS.includes(toolPage.path))
  const homeToolPages = isHomePage ? toolPages : featuredTools
  const toolLinkPages = isHomePage ? featuredTools : toolPages
  const heroStats = isHomePage
    ? [
        { label: 'Tools', value: '9' },
        { label: 'Sign-up time', value: '0ms' },
        { label: 'Client-side', value: '100%' },
      ]
    : [
        {
          label: 'Target',
          value: page.target ? page.target.toUpperCase() : 'BLENDED',
        },
        { label: 'Mode', value: isContinuous ? 'Live' : 'Ready' },
        { label: 'Trend', value: history.length > 0 ? `${history.length} samples` : 'Fresh start' },
      ]

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

      <header className={isHomePage ? 'hero home-hero' : 'hero'}>
        {isHomePage ? (
          <>
            <div className="home-hero-copy">
              <div className="hero-badges" aria-label="Key product highlights">
                <span className="hero-badge">9 tools · no sign-up</span>
              </div>
              <h1 className="home-hero-title">{page.h1}</h1>
              <p className="home-hero-subtitle">{page.subtitle}</p>
              <div className="home-hero-actions">
                <button
                  onClick={() => onNavigate('ping')}
                  className="home-hero-primary"
                  style={DISPLAY_FONT}
                >
                  Run Ping Test <span aria-hidden="true">→</span>
                </button>
                <button onClick={() => onNavigate('json')} className="home-hero-secondary">
                  Format JSON
                </button>
              </div>
            </div>
            <div className="home-hero-visual" aria-label="Roswag terminal preview">
              <TerminalPanel />
            </div>
            <div className="home-hero-stats" aria-label="Key product highlights">
              {heroStats.map((stat) => (
                <div key={stat.label} className="home-stat">
                  <span className="home-stat-value">{stat.value}</span>
                  <span className="home-stat-label">{stat.label}</span>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="hero-text">
              <p className="eyebrow">{page.eyebrow}</p>
              <h1>{page.h1}</h1>
              <p className="subtitle">{page.subtitle}</p>
            </div>
            <div className="hero-card ping-hero-card">
              <p className="hero-label">Session status</p>
              <p className="hero-value">{isContinuous ? 'Running' : 'Idle'}</p>
              <p className="hero-meta">{page.heroNote}</p>
              <div className="hero-stat-grid">
                {heroStats.map((stat) => (
                  <div key={stat.label} className="hero-stat">
                    <span className="hero-stat-label">{stat.label}</span>
                    <span className="hero-stat-value">{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </header>

      {isHomePage && (
        <section className="card home-hub" aria-label="All Roswag tools">
          <div className="learn-header home-hub-header">
            <h2>All Tools</h2>
            <p>Open the exact utility you need without leaving the landing page.</p>
          </div>
          <div className="tool-grid">
            {homeToolPages.map((toolPage) => (
              <AppLink key={toolPage.path} href={toolPage.path} className="tool-card">
                <span className="tool-card-title">{toolPage.navLabel}</span>
                <span className="tool-card-copy">{toolPage.description}</span>
              </AppLink>
            ))}
          </div>
        </section>
      )}

      <section className="card" aria-label="Ping controls and results">
        {!isHomePage && (
          <div className="section-intro">
            <p className="eyebrow">Featured tool</p>
            <h2>Start With A Ping Test</h2>
            <p className="hero-meta">
              Use the default ping experience below for a quick latency baseline, then branch into
              the other utilities when you need deeper debugging.
            </p>
          </div>
        )}
        <div className="controls">
          <button onClick={handleCheckPing} disabled={isTesting} className="primary-button">
            {isTesting ? 'Testing…' : 'Check Ping Once'}
          </button>
          <button
            onClick={toggleContinuous}
            className={`secondary-button ${isContinuous ? 'active' : ''}`}
          >
            {isContinuous ? 'Stop Continuous Test' : 'Start Continuous Test'}
          </button>
        </div>

        {error && <p className="error">{error}</p>}

        <div className="results-grid">
          {latencyMs != null && !error && (
            <div className="results ping-results-card" data-reveal="1">
              <p className="ping-label">Current ping</p>
              <p className="ping-value">
                <span>{latencyMs}</span> ms
              </p>
              <div className="ping-status-row">
                <span className="ping-quality-chip" style={{ color: quality?.color || undefined }}>
                  {quality ? quality.label : 'Unknown'}
                </span>
                <span className="ping-status-copy">
                  {isContinuous ? 'Live sampling is active' : 'Run a test or enable live sampling'}
                </span>
              </div>
              {quality && (
                <p className="ping-quality">
                  Status:{' '}
                  <span style={{ color: quality.color, fontWeight: 600 }}>{quality.label}</span>
                </p>
              )}
            </div>
          )}

          {stats && !error && (
            <div className="stats ping-stats-card" data-reveal="2">
              <div className="stats-header">
                <h2>Session stats</h2>
                <span className="stats-count">{stats.count} samples</span>
              </div>
              <ul>
                <li>
                  <strong>Average:</strong> {stats.average} ms
                </li>
                <li>
                  <strong>Minimum:</strong> {stats.min} ms
                </li>
                <li>
                  <strong>Maximum:</strong> {stats.max} ms
                </li>
              </ul>
            </div>
          )}

          {!error && history.length > 0 && (
            <div className="stats ping-chart-summary" data-reveal="2">
              <div className="stats-header">
                <h2>Latest trend</h2>
                <span className="stats-count">Last sample</span>
              </div>
              <ul>
                <li>
                  <strong>Current trend:</strong> {latestHistoryLatency} ms
                </li>
                <li>
                  <strong>Range:</strong> {chartRangeLabel}
                </li>
                <li>
                  <strong>Mode:</strong> {isContinuous ? 'Continuous' : 'Single run'}
                </li>
              </ul>
            </div>
          )}
        </div>

        {targetBreakdown.length > 0 && !error && (
          <div className="target-breakdown">
            <h2>Measured targets</h2>
            <div className="target-grid">
              {targetBreakdown.map(([targetId, targetLatency]) => (
                <div key={targetId} className="target-card">
                  <p className="target-name">{targetId}</p>
                  <p className="target-latency">{targetLatency} ms</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {history.length > 0 && !error && (
          <div className="history history-panel" data-reveal="3">
            <div className="history-header">
              <div>
                <h2>Recent pings</h2>
                <p className="history-copy">
                  Tracking the last {Math.min(history.length, 60)} samples gives you a better sense
                  of stability than any single number.
                </p>
              </div>
              <div className="history-meta">
                <span className="history-meta-pill">Range {chartRangeLabel}</span>
                <span className="history-meta-pill">Average {stats?.average ?? '-'} ms</span>
              </div>
            </div>
            {history.length > 1 && (
              <div className="history-chart" role="img" aria-label="Ping history chart">
                <svg viewBox="0 0 100 40" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="pingLine" x1="0" x2="1" y1="0" y2="0">
                      <stop offset="0%" stopColor="#38bdf8" />
                      <stop offset="100%" stopColor="#f97316" />
                    </linearGradient>
                    <linearGradient id="pingFill" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="rgba(56, 189, 248, 0.35)" />
                      <stop offset="100%" stopColor="rgba(2, 6, 23, 0)" />
                    </linearGradient>
                  </defs>
                  {(() => {
                    const samples = history.slice(-60)
                    const values = samples.map((point) => point.latency)
                    const min = Math.min(...values)
                    const max = Math.max(...values)
                    const range = Math.max(8, max - min)
                    const stepX = 100 / (samples.length - 1)
                    const points = samples.map((point, index) => {
                      const x = index * stepX
                      const normalized = (point.latency - min) / range
                      const y = 34 - normalized * 28
                      return `${x},${y}`
                    })
                    const line = `M ${points.join(' L ')}`
                    const fill = `${line} L 100,38 L 0,38 Z`
                    return (
                      <>
                        <path d={fill} fill="url(#pingFill)" stroke="none" />
                        <path d={line} fill="none" stroke="url(#pingLine)" strokeWidth="1.6" />
                      </>
                    )
                  })()}
                </svg>
                <div className="chart-legend">
                  <span>Last {Math.min(history.length, 60)} samples</span>
                  <span>Range: {chartRangeLabel}</span>
                </div>
              </div>
            )}
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Time</th>
                  <th>Latency (ms)</th>
                </tr>
              </thead>
              <tbody>
                {history
                  .slice(-10)
                  .map((entry, index, entries) => {
                    const displayIndex = history.length - entries.length + index + 1
                    const time = new Date(entry.timestamp).toLocaleTimeString()
                    return (
                      <tr key={entry.timestamp + index}>
                        <td>{displayIndex}</td>
                        <td>{time}</td>
                        <td>{entry.latency}</td>
                      </tr>
                    )
                  })
                  .reverse()}
              </tbody>
            </table>
          </div>
        )}

        <div className="related-links">
          <h2>Related checks</h2>
          <div className="tool-grid">
            <AppLink href="/what-is-my-ip" className="tool-card">
              <span className="tool-card-title">Check Your IP</span>
              <span className="tool-card-copy">
                See the public IP address and IP version your browser is using right now.
              </span>
            </AppLink>
            <AppLink href="/ip-check" className="tool-card">
              <span className="tool-card-title">Run An IP Check</span>
              <span className="tool-card-copy">
                Verify your current public IP before troubleshooting routing, access, or VPN issues.
              </span>
            </AppLink>
            <AppLink href="/dns-lookup" className="tool-card">
              <span className="tool-card-title">Run A DNS Lookup</span>
              <span className="tool-card-copy">
                Inspect DNS records when latency is fine but a domain, mail route, or subdomain still looks wrong.
              </span>
            </AppLink>
            <AppLink href="/json-formatter" className="tool-card">
              <span className="tool-card-title">Format JSON</span>
              <span className="tool-card-copy">
                Clean up raw API responses and payloads when the network looks fine but the data still needs debugging.
              </span>
            </AppLink>
            <AppLink href="/base64-encode" className="tool-card">
              <span className="tool-card-title">Base64 Encoder</span>
              <span className="tool-card-copy">
                Encode or decode quick values when your debugging flow moves from network checks into payload inspection.
              </span>
            </AppLink>
            <AppLink href="/url-encode" className="tool-card">
              <span className="tool-card-title">URL Encoder</span>
              <span className="tool-card-copy">
                Encode or decode URL text when links, callback params, or request values need quick inspection.
              </span>
            </AppLink>
            <AppLink href="/uuid-generator" className="tool-card">
              <span className="tool-card-title">UUID Generator</span>
              <span className="tool-card-copy">
                Generate fresh UUIDs for request tracing, fixture setup, or debugging flows after checking network latency.
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

        <div className="range-grid">
          <div className="range-card">
            <h3>Excellent</h3>
            <p>0-30 ms. Competitive play and voice chat feel immediate.</p>
          </div>
          <div className="range-card">
            <h3>Good</h3>
            <p>31-60 ms. Most online games and live apps still feel smooth.</p>
          </div>
          <div className="range-card">
            <h3>Playable</h3>
            <p>61-100 ms. Delay becomes easier to notice during faster reactions.</p>
          </div>
          <div className="range-card">
            <h3>Poor</h3>
            <p>100+ ms. Expect lag, slower responses, and more visible instability.</p>
          </div>
        </div>

        <div className="seo-copy">
          {page.sections.map((section) => (
            <article key={section.title} className="copy-card">
              <h3>{section.title}</h3>
              <p>{section.body}</p>
            </article>
          ))}
        </div>

        {!isHomePage && (
          <div className="tool-links">
            <h2>{isHomePage ? 'Explore Roswag Tools' : 'Popular Ping Tests'}</h2>
            <div className="tool-grid">
              {toolLinkPages.map((toolPage) => (
                <AppLink key={toolPage.path} href={toolPage.path} className="tool-card">
                  <span className="tool-card-title">{toolPage.navLabel}</span>
                  <span className="tool-card-copy">{toolPage.description}</span>
                </AppLink>
              ))}
            </div>
          </div>
        )}
      </section>

      <footer className="footer">
        <p>
          Tip: run a continuous test while you play, stream, or call to catch spikes instead of
          relying on a single sample.
        </p>
      </footer>
    </main>
  )
}

export default PingPage
