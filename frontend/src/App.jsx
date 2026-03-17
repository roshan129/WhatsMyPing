import { useEffect, useState } from 'react'
import './App.css'
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

  return <PingPage page={page} />
}

export default App
