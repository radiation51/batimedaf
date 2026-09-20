import {
  Armchair,
  Barbell,
  Bell,
  Bicycle,
  CarSimple,
  CookingPot,
  Hammer,
  LockKey,
  Sparkle,
  SunHorizon,
  SwimmingPool,
  Tree,
  Warehouse,
} from '@phosphor-icons/react'
import './Amenities.css'

/**
 * Residence amenities as icons rather than a numbered list.
 *
 * Glyphs come from Phosphor at its "light" weight — hairline strokes that sit
 * with Optima rather than shouting over it. Icons are matched on keywords in
 * the label, so amenities edited in the admin panel still get a sensible
 * glyph; anything unmatched falls back to a neutral mark.
 */

/* Ordered: the first match wins, so more specific words come first. Each
   pattern covers both the French and English CMS wording. */
const MATCHERS = [
  [/parc|jardin|arbor|verdure|park|garden|wooded/i, Tree],
  [/concierg|accueil|gardien/i, Bell],
  [/sport|fitness|gym/i, Barbell],
  [/parking|voiture|stationnement/i, CarSimple],
  [/vélo|velo|cycl|bike/i, Bicycle],
  [/piscine|pool|swim/i, SwimmingPool],
  [/accès|acces|privé|prive|sécuris|securis|secure|access/i, LockKey],
  [/terrasse|toiture|toit|balcon|terrace|roof|balcony/i, SunHorizon],
  [/verrière|verriere|vitr|fenêtre|skylight|window/i, Warehouse],
  [/cuisine|kitchen/i, CookingPot],
  [/atelier|artisan|savoir-faire|sur mesure|workshop|custom/i, Hammer],
  [/cour|patio|salon|séjour|courtyard|lounge|living/i, Armchair],
]

const iconFor = (label) =>
  MATCHERS.find(([pattern]) => pattern.test(label))?.[1] ?? Sparkle

function Amenities({ items }) {
  return (
    <ul className="am">
      {items.map((item, i) => {
        const Icon = iconFor(item)
        return (
          <li key={item} data-reveal style={{ '--d': `${i * 90}ms` }}>
            <span className="am-icon" aria-hidden="true">
              {/* Decorative ring, drawn in by CSS behind the glyph. */}
              <svg className="am-ring" viewBox="0 0 52 52">
                <circle cx="26" cy="26" r="25.5" pathLength="1" />
              </svg>
              <Icon size={32} weight="light" />
            </span>
            <span className="am-label">{item}</span>
          </li>
        )
      })}
    </ul>
  )
}

export default Amenities
