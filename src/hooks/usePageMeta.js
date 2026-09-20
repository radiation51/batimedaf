import { useEffect } from 'react'

const SITE = 'Batimedaf'

/**
 * Sets the document title and meta description per route. A single-page app
 * otherwise serves the same <title> on every URL, which is poor for search
 * results and for browser history/tabs.
 *
 * `noindex` adds a robots meta tag — used for the admin panel, which robots.txt
 * alone cannot keep out of an index if someone links to it.
 */
export function usePageMeta({ title, description, noindex = false } = {}) {
  useEffect(() => {
    const previousTitle = document.title
    if (title) document.title = `${title} — ${SITE}`

    let descTag
    let previousDesc
    if (description) {
      descTag = document.querySelector('meta[name="description"]')
      if (descTag) {
        previousDesc = descTag.getAttribute('content')
        descTag.setAttribute('content', description)
      }
    }

    let robotsTag
    if (noindex) {
      robotsTag = document.createElement('meta')
      robotsTag.name = 'robots'
      robotsTag.content = 'noindex, nofollow'
      document.head.appendChild(robotsTag)
    }

    return () => {
      document.title = previousTitle
      if (descTag && previousDesc != null) {
        descTag.setAttribute('content', previousDesc)
      }
      robotsTag?.remove()
    }
  }, [title, description, noindex])
}
