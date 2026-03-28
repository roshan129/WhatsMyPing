import { useEffect, useState } from 'react'
import './App.css'
import Base64Page from './pages/Base64Page'
import DnsPage from './pages/DnsPage'
import IpPage from './pages/IpPage'
import JsonPage from './pages/JsonPage'
import PingPage from './pages/PingPage'
import { getRouteForPath } from './routes'

const getInitialPathname = (initialPath) => {
  if (initialPath) {
    return initialPath
  }

  if (typeof window !== 'undefined') {
    return window.location.pathname
  }

  return '/'
}

function App({ initialPath = null }) {
  const [pathname, setPathname] = useState(() => getInitialPathname(initialPath))

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

  const page = getRouteForPath(pathname)

  if (page.toolType === 'ip') {
    return <IpPage page={page} />
  }

  if (page.toolType === 'dns') {
    return <DnsPage page={page} />
  }

  if (page.toolType === 'json') {
    return <JsonPage page={page} />
  }

  if (page.toolType === 'base64') {
    return <Base64Page page={page} />
  }

  return <PingPage page={page} />
}

export default App
