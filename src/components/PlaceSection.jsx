import { useUI } from '../i18n/useLocalizedContent'
import { useEdit } from '../content/editable'
import { PlaceMap, TransportList, NearbyList } from './Place'
import './PlaceSection.css'

/**
 * A residence's location, shared by the residence and apartment pages: the
 * summary across the page, then the map beside the transports and what is
 * nearby, the map growing to the height of the lists.
 */
function PlaceSection({ residence, residencePath, label, id, deep = false, titleTag: Title = 'h3' }) {
  const t = useUI()
  const edit = useEdit(residencePath)
  const place = residence.place

  return (
    <section
      className={`sec ps${deep ? ' sec--deep' : ''}`}
      id={id}
      data-nav-tone="light"
    >
      <div className="wrap">
        <span className="label ps-label">{label}</span>
        <p className="lead ps-lead" data-reveal {...edit('place', 'summary')}>
          {place.summary}
        </p>

        <div className="ps-grid">
          <div className="ps-map" data-reveal>
            <PlaceMap
              address={place.address}
              title={residence.name}
              editPath={[...residencePath, 'place', 'address']}
            />
          </div>

          <div className="ps-lists">
            <div data-reveal>
              <Title className="pl-mini-title">{t.transports}</Title>
              <TransportList
                transports={place.transports}
                editPath={[...residencePath, 'place', 'transports']}
              />
            </div>
            <div data-reveal>
              <Title className="pl-mini-title">{t.nearby}</Title>
              <NearbyList
                items={place.nearby}
                editPath={[...residencePath, 'place', 'nearby']}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default PlaceSection
