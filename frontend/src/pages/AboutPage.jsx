import { useEffect } from 'react'

const supportEmail = import.meta.env.VITE_SUPPORT_EMAIL || 'support@roswag.com'
const buyMeACoffeeUrl = import.meta.env.VITE_BUY_ME_A_COFFEE_URL || ''

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

function AboutPage({ page }) {
  useEffect(() => {
    updateMetadata(page.title, page.description)
  }, [page.description, page.title])

  return (
    <main className="app">
      <header className="site-header">
        <AppLink href="/" className="brand-lockup">
          <span className="brand">Roswag</span>
          <span className="brand-subtitle">Developer &amp; Network Tools</span>
        </AppLink>
        <nav className="top-nav" aria-label="Roswag navigation">
          <AppLink href="/tools" className="nav-link">All Tools</AppLink>
          <AppLink href="/blog" className="nav-link">Blog</AppLink>
          <AppLink href="/about" className="nav-link active">About</AppLink>
        </nav>
      </header>

      <article className="card about-page">
        <div className="learn-header">
          <p className="eyebrow">{page.eyebrow}</p>
          <h1>{page.h1}</h1>
          <p>{page.subtitle}</p>
        </div>

        <section className="about-section">
          <h2>Why I built Roswag</h2>
          <p>
            Roswag brings practical network checks and everyday developer utilities into one
            focused place. I built it to make tasks such as checking latency, inspecting DNS,
            formatting JSON, and decoding developer data quick and straightforward.
          </p>
        </section>

        <section className="about-section">
          <h2>About the creator</h2>
          <p>
            Hi, I&apos;m Roshan. I&apos;m a developer who enjoys building useful products and learning
            through real projects. Roswag is an independently developed project that I continue
            to improve through testing, new ideas, and feedback from the people who use it.
          </p>
        </section>

        <div className="about-grid">
          <section className="about-card">
            <p className="eyebrow">Support and feedback</p>
            <h2>Found a problem or have an idea?</h2>
            <p>
              Bug reports and tool suggestions are welcome. Send an email and include the page
              you were using, what you expected, and what happened.
            </p>
            <a className="primary-button about-action" href={`mailto:${supportEmail}`}>
              Email {supportEmail}
            </a>
          </section>

          <section className="about-card">
            <p className="eyebrow">Support Roswag</p>
            <h2>Help keep the tools growing</h2>
            <p>
              Roswag is free to use. If it saved you time, you can support ongoing development
              and help fund hosting and future tools.
            </p>
            {buyMeACoffeeUrl ? (
              <a
                className="secondary-button about-action"
                href={buyMeACoffeeUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Buy Me a Coffee
              </a>
            ) : (
              <p className="support-note">The Buy Me a Coffee link will be available soon.</p>
            )}
          </section>
        </div>

        <section className="about-section about-footer-cta">
          <h2>Explore Roswag</h2>
          <p>Browse the full tool directory or read a guide explaining the concepts behind the tools.</p>
          <div className="about-actions">
            <AppLink href="/tools" className="primary-button">Browse All Tools</AppLink>
            <AppLink href="/blog" className="secondary-button">Read Developer Guides</AppLink>
          </div>
        </section>
      </article>
    </main>
  )
}

export default AboutPage
