import './PageTransition.css'

/**
 * Presentational overlay for route changes. The parent drives the phase:
 *  - "cover"  : columns unfurl downwards and hide the page
 *  - "reveal" : columns retract downwards, uncovering the new page
 *  - "idle"   : nothing on screen
 */
function PageTransition({ phase }) {
  return (
    <div className={`page-transition is-${phase}`} aria-hidden="true">
      {[0, 1, 2, 3, 4].map((i) => (
        <span key={i} className={`pt-col pt-col--${i}`} />
      ))}
    </div>
  )
}

export default PageTransition
