import {
  Armchair,
  Barbell,
  Bell,
  Bicycle,
  CarSimple,
  CookingPot,
  Hammer,
  HouseLine,
  LockKey,
  SunHorizon,
  SwimmingPool,
  Tree,
  Warehouse,
} from '@phosphor-icons/react'
import { useEdit } from '../content/editable'
import './Amenities.css'

/**
 * Residence amenities, each with a hairline Phosphor glyph. Icons are
 * matched on keywords in the label, so amenities edited in the admin panel
 * still get a sensible glyph; anything unmatched falls back to a neutral
 * mark.
 */

/* Ordered: the first match wins, so more specific words come first. Each
   pattern covers both the French and English CMS wording. */
const MATCHERS = [
  // Before the garden line: "parking" would otherwise match "park".
  [/parking|voiture|stationnement/i, CarSimple],
  [/parc|jardin|arbor|verdure|park|garden|wooded/i, Tree],
  [/concierg|accueil|gardien/i, Bell],
  [/sport|fitness|gym/i, Barbell],
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
  MATCHERS.find(([pattern]) => pattern.test(label))?.[1] ?? HouseLine

function Amenities({ items, editPath = null }) {
  const edit = useEdit(editPath)
  return (
    <ul className="am">
      {items.map((item, i) => {
        const Icon = iconFor(item)
        return (
          <li key={i} data-reveal style={{ '--d': `${i * 60}ms` }}>
            <Icon className="am-icon" size={30} weight="light" aria-hidden="true" />
            <span className="am-label" {...edit(i)}>
              {item}
            </span>
          </li>
        )
      })}
    </ul>
  )
}

export default Amenities
