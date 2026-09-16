import { useEffect } from 'react'
import { navPages, toolGroups } from '../seoContent'

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

function ToolsIndexPage({ page }) {
  useEffect(() => {
    updateMetadata(page.title, page.description)
  }, [page.description, page.title])

  return (
    <main className="app">
      <header className="site-header">
        <AppLink href="/" className="brand-lockup" aria-label="Roswag home">
          <span className="brand">Roswag</span>
          <span className="brand-subtitle">Developer &amp; Network Tools</span>
        </AppLink>
        <nav className="top-nav" aria-label="Roswag navigation">
          <AppLink href="/tools" className="nav-link active">All Tools</AppLink>
          <AppLink href="/blog" className="nav-link">Blog</AppLink>
          {navPages.map((toolPage) => (
            <AppLink key={toolPage.path} href={toolPage.path} className="nav-link">
              {toolPage.navLabel}
            </AppLink>
          ))}
        </nav>
      </header>

      <section className="card tools-directory" aria-label="All Roswag tools">
        <div className="learn-header home-hub-header">
          <p className="eyebrow">{page.eyebrow}</p>
          <h1>{page.h1}</h1>
          <p>{page.subtitle}</p>
        </div>

        {toolGroups.map((group) => (
          <section key={group.toolType} className="tool-directory-section">
            <h2>{group.label}</h2>
            <div className="tool-grid">
              {group.pages.map((toolPage) => (
                <AppLink key={toolPage.path} href={toolPage.path} className="tool-card">
                  <span className="tool-card-title">{toolPage.navLabel}</span>
                  <span className="tool-card-copy">{toolPage.description}</span>
                </AppLink>
              ))}
            </div>
          </section>
        ))}

        <div className="blog-cta">
          <h2>Learn how the tools work</h2>
          <p>Read practical guides for the networking and developer concepts behind each utility.</p>
          <AppLink href="/blog" className="primary-button blog-cta-link">
            Browse the Roswag Blog
          </AppLink>
        </div>
      </section>
    </main>
  )
}

export default ToolsIndexPage
