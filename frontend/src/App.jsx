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

function App() {
  const [latencyMs, setLatencyMs] = useState(null)
  const [isTesting, setIsTesting] = useState(false)
  const [isContinuous, setIsContinuous] = useState(false)
  const [error, setError] = useState(null)
  const [history, setHistory] = useState([])
  const intervalRef = useRef(null)

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
      const response = await fetch('/api/ping')

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`)
      }

      await response.json()
      const end = performance.now()
      const latency = Math.round(end - start)
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
        const response = await fetch('/api/ping')
        if (!response.ok) {
          throw new Error(`Server responded with ${response.status}`)
        }
        await response.json()
        const end = performance.now()
        const latency = Math.round(end - start)
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
      <h1>What's My Ping?</h1>
      <p className="subtitle">
        Check your current network latency. Lower ping usually means smoother online gaming.
      </p>

      <div className="card">
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

        {latencyMs != null && !error && (
          <div className="results">
            <p className="ping-value">
              Current ping: <span>{latencyMs}</span> ms
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
          <div className="stats">
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

        {history.length > 0 && !error && (
          <div className="history">
            <h2>Recent pings</h2>
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
      </div>
    </main>
  )
}

export default App
