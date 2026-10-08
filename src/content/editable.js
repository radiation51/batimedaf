import { createContext, useContext } from 'react'
import { useContent } from './ContentContext'

/**
 * Click-to-edit plumbing for the admin's visual editor.
 *
 * Components tag each element that shows a piece of content with that
 * content's path (`data-edit="home.hero.title"`). The editor renders the real
 * pages inside an EditModeProvider and turns a click on a tagged element into
 * an edit of that path. Everywhere else the tags are not rendered at all.
 */
const EditModeContext = createContext(false)

export const EditModeProvider = EditModeContext.Provider

const NONE = {}

/**
 * Returns `edit(...rest)`, giving the attributes that tag an element with the
 * path `[...base, ...rest]`:
 *
 *   const edit = useEdit(['home', 'hero'])
 *   <h1 {...edit('title')}>{hero.title}</h1>
 *
 * A `null` base never tags anything: for a shared component rendered in a
 * place whose text is not stored content.
 */
export function useEdit(base = []) {
  const on = useContext(EditModeContext)
  return (...rest) =>
    on && base ? { 'data-edit': [...base, ...rest].join('.') } : NONE
}

/** Content path of the residence with this slug: `['residences', index]`. */
export function useResidencePath(slug) {
  const { content } = useContent()
  return ['residences', content.residences.findIndex((r) => r.slug === slug)]
}

/** 'about.figures.2.value' → ['about', 'figures', 2, 'value'] */
export const parsePath = (key) =>
  key.split('.').map((part) => (/^\d+$/.test(part) ? Number(part) : part))

export const valueAt = (root, path) =>
  path.reduce((node, key) => (node == null ? undefined : node[key]), root)
