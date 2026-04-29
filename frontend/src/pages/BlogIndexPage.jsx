import { useEffect } from 'react'
import { blogPages } from '../seoContent'

const updateMetadata = (title, description) => {
  document.title = title

  let descriptionMeta = document.querySelector('meta[name="description"]')
  if (!descriptionMeta) {
    descriptionMeta = document.createElement('meta')
    descriptionMeta.setAttribute('name', 'description')
    document.head.appendChild(descriptionMeta)
  }
  descriptionMeta.setAttribute('content', description)
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

function BlogIndexPage({ page }) {
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
      </header>

      <section className="card home-hub" aria-label="Roswag blog posts">
        <div className="learn-header home-hub-header">
          <p className="eyebrow">{page.eyebrow}</p>
          <h1>{page.h1}</h1>
          <p>{page.subtitle}</p>
        </div>
        <div className="tool-grid">
          {blogPages.map((blog) => (
            <AppLink key={blog.path} href={blog.path} className="tool-card">
              <span className="tool-card-title">{blog.h1}</span>
              <span className="tool-card-copy">{blog.description}</span>
            </AppLink>
          ))}
        </div>
      </section>
    </main>
  )
}

export default BlogIndexPage
