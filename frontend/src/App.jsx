import { useState } from 'react'
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
  const [error, setError] = useState(null)

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

      setLatencyMs(latency)
    } catch (err) {
      setError('Could not reach the ping server. Make sure the backend is running.')
      console.error(err)
    } finally {
      setIsTesting(false)
    }
  }

  const quality = getPingQuality(latencyMs)

  return (
    <main className="app">
      <h1>What's My Ping?</h1>
      <p className="subtitle">
        Check your current network latency. Lower ping usually means smoother online gaming.
      </p>

      <div className="card">
        <button onClick={handleCheckPing} disabled={isTesting} className="primary-button">
          {isTesting ? 'Testing…' : 'Check Ping'}
        </button>

        {error && <p className="error">{error}</p>}

        {latencyMs != null && !error && (
          <div className="results">
            <p className="ping-value">
              Your ping: <span>{latencyMs}</span> ms
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
      </div>
    </main>
  )
}

export default App
