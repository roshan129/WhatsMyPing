import { useEffect } from 'react'

const updateMetadata = (title, description, keywords) => {
  document.title = title

  let descriptionMeta = document.querySelector('meta[name="description"]')
  if (!descriptionMeta) {
    descriptionMeta = document.createElement('meta')
    descriptionMeta.setAttribute('name', 'description')
    document.head.appendChild(descriptionMeta)
  }
  descriptionMeta.setAttribute('content', description)

  if (keywords) {
    let keywordsMeta = document.querySelector('meta[name="keywords"]')
    if (!keywordsMeta) {
      keywordsMeta = document.createElement('meta')
      keywordsMeta.setAttribute('name', 'keywords')
      document.head.appendChild(keywordsMeta)
    }
    keywordsMeta.setAttribute('content', keywords)
  }
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

function BlogPage({ page }) {
  useEffect(() => {
    updateMetadata(page.title, page.description, page.keywords)
  }, [page.description, page.keywords, page.title])

  return (
    <main className="app">
      <header className="site-header">
        <AppLink href="/" className="brand-lockup" aria-label="Roswag home">
          <span className="brand">Roswag</span>
          <span className="brand-subtitle">Developer &amp; Network Tools</span>
        </AppLink>
      </header>

      <article className="card blog-article">
        <p className="eyebrow">{page.eyebrow}</p>
        <h1 className="blog-title">{page.h1}</h1>
        <p className="subtitle">{page.subtitle}</p>

        {page.intro?.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}

        <hr className="blog-divider" />

        {page.sections.map((section) => (
          <section key={section.heading} className="blog-section">
            <h2>{section.heading}</h2>
            {section.paragraphs?.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            {section.listItems?.length > 0 && (
              <ul>
                {section.listItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}
            {section.orderedItems?.length > 0 && (
              <ol>
                {section.orderedItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ol>
            )}
            {section.codeBlocks?.length > 0 && (
              <div className="blog-code-group">
                {section.codeBlocks.map((block) => (
                  <figure key={`${section.heading}-${block.title || block.code}`} className="blog-code-block">
                    {block.title && <figcaption>{block.title}</figcaption>}
                    <pre>
                      <code>{block.code}</code>
                    </pre>
                  </figure>
                ))}
              </div>
            )}
            <hr className="blog-divider" />
          </section>
        ))}

        <section className="blog-cta">
          <h2>{page.cta.heading}</h2>
          <p>{page.cta.body}</p>
          <a className="primary-button blog-cta-link" href={toTrailingSlashPath(page.cta.href)}>
            {page.cta.label}
          </a>
        </section>
      </article>
    </main>
  )
}

export default BlogPage
