import { useEffect, useState } from 'react'
import './App.css'
import PingPage from './pages/PingPage'
import { getRouteForPath } from './routes'

function App() {
  const [pathname, setPathname] = useState(window.location.pathname)

  useEffect(() => {
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
