import { useEffect, useRef, useState } from 'react'
import { toolPages } from '../seoContent'

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

function PingPage({ page }) {
  const [latencyMs, setLatencyMs] = useState(null)
  const [latestResult, setLatestResult] = useState(null)
  const [isTesting, setIsTesting] = useState(false)
  const [isContinuous, setIsContinuous] = useState(false)
  const [error, setError] = useState(null)
  const [history, setHistory] = useState([])
  const intervalRef = useRef(null)
  const apiBase = import.meta.env.VITE_API_BASE_URL || ''

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

  const targetBreakdown = latestResult?.targets
    ? Object.entries(latestResult.targets)
    : latestResult?.target && typeof latestResult.latencyMs === 'number'
      ? [[latestResult.target, latestResult.latencyMs]]
      : []

  return (
    <main className="app">
      <header className="site-header">
        <AppLink href="/" className="brand">
          What's My Ping?
        </AppLink>
        <nav className="top-nav" aria-label="Popular ping tools">
          {toolPages.map((toolPage) => (
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
          <p className="hero-label">Session status</p>
          <p className="hero-value">{isContinuous ? 'Running' : 'Idle'}</p>
          <p className="hero-meta">{page.heroNote}</p>
        </div>
      </header>

      <section className="card" aria-label="Ping controls and results">
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
            <div className="results" data-reveal="1">
              <p className="ping-label">Current ping</p>
              <p className="ping-value">
                <span>{latencyMs}</span> ms
              </p>
              {quality && (
                <p className="ping-quality">
                  Status:{' '}
                  <span style={{ color: quality.color, fontWeight: 600 }}>{quality.label}</span>
                </p>
              )}
            </div>
          )}

          {stats && !error && (
            <div className="stats" data-reveal="2">
              <h2>Session stats ({stats.count} samples)</h2>
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
          <div className="history" data-reveal="3">
            <h2>Recent pings</h2>
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
                  <span>Range: {stats ? `${stats.min}-${stats.max} ms` : '-'}</span>
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

        <div className="tool-links">
          <h2>Popular Ping Tests</h2>
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
