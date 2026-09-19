import { useEffect, useRef, useState } from 'react'
import './App.css'
import AboutPage from './pages/AboutPage'
import Base64Page from './pages/Base64Page'
import BlogIndexPage from './pages/BlogIndexPage'
import BlogPage from './pages/BlogPage'
import DnsPage from './pages/DnsPage'
import IpPage from './pages/IpPage'
import JsonPage from './pages/JsonPage'
import JwtPage from './pages/JwtPage'
import PingPage from './pages/PingPage'
import TimestampPage from './pages/TimestampPage'
import ToolsIndexPage from './pages/ToolsIndexPage'
import UuidPage from './pages/UuidPage'
import UrlPage from './pages/UrlPage'
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
  const previousPathname = useRef(pathname)

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
    if (typeof window === 'undefined' || previousPathname.current === pathname) {
      return
    }

    previousPathname.current = pathname
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [pathname])

  const page = getRouteForPath(pathname)

  if (page.toolType === 'about') {
    return <AboutPage page={page} />
  }

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

  if (page.toolType === 'url') {
    return <UrlPage page={page} />
  }

  if (page.toolType === 'uuid') {
    return <UuidPage page={page} />
  }

  if (page.toolType === 'jwt') {
    return <JwtPage page={page} />
  }

  if (page.toolType === 'timestamp') {
    return <TimestampPage page={page} />
  }

  if (page.toolType === 'blog') {
    return <BlogPage page={page} />
  }

  if (page.toolType === 'blog-index') {
    return <BlogIndexPage page={page} />
  }

  if (page.toolType === 'tools-index') {
    return <ToolsIndexPage page={page} />
  }

  return <PingPage page={page} />
}

export default App
