import { useEffect, useState } from 'react'
import './App.css'
import PingPage from './pages/PingPage'
import { getRouteForPath } from './routes'

const CLOUDFLARE_BEACON_SRC = 'https://static.cloudflareinsights.com/beacon.min.js'

const getInitialPathname = (initialPath) => {
  if (initialPath) {
    return initialPath
  }

  if (typeof window !== 'undefined') {
    return window.location.pathname
  }

  return '/'
}

const ensureCloudflareAnalytics = (token) => {
  if (!token || typeof document === 'undefined') {
    return
  }

  const existingScript = document.querySelector('script[data-cf-beacon]')
  if (existingScript) {
    return
  }

  const script = document.createElement('script')
  script.defer = true
  script.src = CLOUDFLARE_BEACON_SRC
  script.setAttribute('data-cf-beacon', JSON.stringify({ token }))
  document.body.appendChild(script)
}

function App({ initialPath = null }) {
  const [pathname, setPathname] = useState(() => getInitialPathname(initialPath))
  const analyticsToken = import.meta.env.VITE_CLOUDFLARE_ANALYTICS_TOKEN

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined
    }

    const handleLocationChange = () => {
      setPathname(window.location.pathname)
    }

    window.addEventListener('popstate', handleLocationChange)
    return () => {
      window.removeEventListener('popstate', handleLocationChange)
    }
  }, [])

  useEffect(() => {
    ensureCloudflareAnalytics(analyticsToken)
  }, [analyticsToken])

  const page = getRouteForPath(pathname)

  return <PingPage page={page} />
}

export default App
