import { useEffect, useRef, useState } from 'react'
import './App.css'

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

const TARGETS = [
  { id: 'backend', label: 'Local backend (HTTP)', query: 'backend' },
  { id: 'google-dns', label: 'Google DNS (8.8.8.8)', query: 'google-dns' },
  { id: 'cloudflare', label: 'Cloudflare (1.1.1.1)', query: 'cloudflare' },
]

function App() {
  const [latencyMs, setLatencyMs] = useState(null)
  const [isTesting, setIsTesting] = useState(false)
  const [isContinuous, setIsContinuous] = useState(false)
  const [error, setError] = useState(null)
  const [history, setHistory] = useState([])
  const intervalRef = useRef(null)
  const apiBase = import.meta.env.VITE_API_BASE_URL || ''

  const recordPing = (latency) => {
    setLatencyMs(latency)
    setHistory((prev) => {
      const next = [...prev, { timestamp: Date.now(), latency }]
      // keep last 60 measurements
      return next.slice(-60)
    })
  }

  const handleCheckPing = async () => {
    setIsTesting(true)
    setError(null)

    try {
      const start = performance.now()
      const endpoint = '/api/ping'
      const response = await fetch(
        `${apiBase}${endpoint}`
      )

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`)
      }

      const data = await response.json()
      let latency
      if (typeof data.latencyMs === 'number') {
        latency = Math.round(data.latencyMs)
      } else {
        const end = performance.now()
        latency = Math.round(end - start)
      }
      recordPing(latency)
    } catch (err) {
      setError('Could not reach the ping server. Make sure the backend is running.')
      console.error(err)
    } finally {
      setIsTesting(false)
    }
  }

  const quality = getPingQuality(latencyMs)

  // Continuous ping logic
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
        const start = performance.now()
        const endpoint = '/api/ping'
        const response = await fetch(
          `${apiBase}${endpoint}`
        )
        if (!response.ok) {
          throw new Error(`Server responded with ${response.status}`)
        }
        const data = await response.json()
        let latency
        if (typeof data.latencyMs === 'number') {
          latency = Math.round(data.latencyMs)
        } else {
          const end = performance.now()
          latency = Math.round(end - start)
        }
        recordPing(latency)
        setError(null)
      } catch (err) {
        console.error(err)
        setError('Could not reach the ping server. Make sure the backend is running.')
      }
    }

    // initial ping immediately
    runPing()
    intervalRef.current = setInterval(runPing, 1000)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isContinuous])

  const toggleContinuous = () => {
    setIsContinuous((prev) => !prev)
  }

  const stats =
    history.length > 0
      ? {
          count: history.length,
          average: Math.round(history.reduce((sum, h) => sum + h.latency, 0) / history.length),
          min: Math.min(...history.map((h) => h.latency)),
          max: Math.max(...history.map((h) => h.latency)),
        }
      : null

  return (
    <main className="app">
      <header className="hero">
        <div className="hero-text">
          <p className="eyebrow">Realtime latency check</p>
          <h1>What's My Ping?</h1>
          <p className="subtitle">
            Measure your network latency and see whether it is ready for ranked, raids, or casual
            play.
          </p>
        </div>
        <div className="hero-card">
          <p className="hero-label">Session status</p>
          <p className="hero-value">{isContinuous ? 'Running' : 'Idle'}</p>
          <p className="hero-meta">Using reliable global DNS targets</p>
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
                  <span style={{ color: quality.color, fontWeight: 600 }}>
                    {quality.label}
                  </span>
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
                  <span>Range: {stats ? `${stats.min}–${stats.max} ms` : '—'}</span>
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
                  .map((entry, index, arr) => {
                    const displayIndex = history.length - arr.length + index + 1
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

      <section className="learn" aria-label="Ping explanation">
        <div className="learn-header">
          <h2>What does ping mean?</h2>
          <p>
            Ping is the round trip time for a signal to leave your device, reach a server, and come
            back. Lower values feel instant, while higher values introduce delay and can make fast
            reactions feel sluggish.
          </p>
        </div>

        <div className="range-grid">
          <div className="range-card">
            <h3>Excellent</h3>
            <p>0–30 ms. Competitive play feels instant.</p>
          </div>
          <div className="range-card">
            <h3>Good</h3>
            <p>31–60 ms. Most online games feel smooth.</p>
          </div>
          <div className="range-card">
            <h3>Playable</h3>
            <p>61–100 ms. Still usable, but reactions feel slower.</p>
          </div>
          <div className="range-card">
            <h3>Poor</h3>
            <p>100+ ms. Expect noticeable lag and delays.</p>
          </div>
        </div>

        <div className="faq">
          <h2>Quick answers</h2>
          <ul>
            <li>
              <strong>Why does this differ from in-game ping?</strong> Each game server, tick rate,
              and routing path is different. This tool measures a basic round trip to a selected
              target.
            </li>
            <li>
              <strong>What affects ping the most?</strong> Distance to the server, Wi‑Fi congestion,
              background downloads, and ISP routing.
            </li>
            <li>
              <strong>How can I improve it?</strong> Use wired Ethernet, choose closer servers,
              update Wi‑Fi firmware, and pause large downloads while playing.
            </li>
          </ul>
        </div>
      </section>

      <footer className="footer">
        <p>
          Tip: Run a continuous test while you play to spot spikes or unstable routing in real
          time.
        </p>
      </footer>
    </main>
  )
}

export default App
