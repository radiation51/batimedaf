/**
 * Location pieces shared by the residence and apartment pages: the embedded
 * map with its address plate, and the transport / nearby lists.
 */
import { Bus, CarSimple, Subway, Tram } from '@phosphor-icons/react'
import Arrow from './Arrow'
import { useUI } from '../i18n/useLocalizedContent'
import { useEdit } from '../content/editable'
import './Place.css'

/* Paris line colours, so a badge reads at a glance. Anything unlisted falls
   back to ink on cream rather than guessing a colour. */
const LINE_COLORS = {
  1: '#ffcd00',
  2: '#003ca6',
  3: '#837902',
  4: '#cf009e',
  5: '#ff7e2e',
  6: '#6eca97',
  7: '#fa9aba',
  8: '#e19bdf',
  9: '#b6bd00',
  10: '#c9910d',
  11: '#704b1c',
  12: '#007852',
  13: '#6ec4e8',
  14: '#62259d',
  A: '#e3051c',
  B: '#5291ce',
  C: '#f3d311',
  D: '#00814f',
  E: '#c0006e',
}

/** 'Jasmin — 4 min à pied' → ['Jasmin', '4 min à pied'] */
export function splitDetail(text) {
  const parts = String(text).split('—')
  if (parts.length < 2) return [text, null]
  return [parts[0].trim(), parts.slice(1).join('—').trim()]
}

/** Dark type on light badges, light type on dark ones (WCAG luminance). */
function readableInk(hex) {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
  const channel = (c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)
  const luminance =
    0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b)
  return luminance > 0.45 ? '#0a0a0a' : '#fff'
}

/* A generic mode of transport rather than a numbered line, e.g. Algiers'
   bus, tramway, car and metro, which have no line colours to look up. Each
   gets its own hairline glyph, in ink like the rest of the page. */
const MODES = {
  bus: Bus,
  tramway: Tram,
  tram: Tram,
  voiture: CarSimple,
  car: CarSimple,
  métro: Subway,
  metro: Subway,
}

/** Renders 'Ligne 9' or 'RER C' as a coloured badge plus its network. */
export function LineBadge({ line }) {
  const Icon = MODES[String(line).trim().toLowerCase()]
  if (Icon) {
    return (
      <span className="pl-line" title={line}>
        <span className="pl-mode">
          <Icon size={22} weight="light" />
        </span>
        <span className="pl-mode-name">{line}</span>
      </span>
    )
  }

  const token = String(line).replace(/ligne|rer|tram(way)?|bus/gi, '').trim()
  const network = /rer/i.test(line)
    ? 'RER'
    : /tram/i.test(line)
      ? 'T'
      : /bus/i.test(line)
        ? 'Bus'
        : 'M'
  const color = LINE_COLORS[token]

  return (
    <span className="pl-line" title={line}>
      <span className="pl-line-network">{network}</span>
      <span
        className="pl-line-badge"
        style={
          color ? { background: color, color: readableInk(color) } : undefined
        }
      >
        {token}
      </span>
    </span>
  )
}

/* `editPath` on the lists and the map: where their text lives in the
   content, for the admin editor. */

export function TransportList({ transports, editPath = null }) {
  const edit = useEdit(editPath)
  return (
    <ul className="pl-list pl-transports">
      {transports.map((transport, i) => {
        const [stop, time] = splitDetail(transport.detail)
        return (
          <li key={i}>
            <span {...edit(i, 'line')}>
              <LineBadge line={transport.line} />
            </span>
            <span className="pl-stop" {...edit(i, 'detail')}>
              {stop}
            </span>
            {time && (
              <span className="pl-time" {...edit(i, 'detail')}>
                {time}
              </span>
            )}
          </li>
        )
      })}
    </ul>
  )
}

export function NearbyList({ items, editPath = null }) {
  const edit = useEdit(editPath)
  return (
    <ul className="pl-list pl-nearby">
      {items.map((item, i) => {
        const [name, time] = splitDetail(item)
        return (
          <li key={i}>
            <span className="pl-stop" {...edit(i)}>
              {name}
            </span>
            {time && (
              <span className="pl-time" {...edit(i)}>
                {time}
              </span>
            )}
          </li>
        )
      })}
    </ul>
  )
}

/** Embedded map plus the address plate that sits under it. */
export function PlaceMap({ address, title, editPath = null }) {
  const t = useUI()
  const edit = useEdit(editPath)
  const query = encodeURIComponent(address)

  return (
    <div className="pl-map">
      <div className="pl-map-frame">
        <iframe
          title={`${t.mapLabel} — ${title}`}
          src={`https://www.google.com/maps?q=${query}&z=15&hl=fr&output=embed`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>

      <div className="pl-map-card">
        <div>
          <span className="pl-map-label">{t.address}</span>
          <p className="pl-map-address" {...edit()}>
            {address}
          </p>
        </div>
        <a
          className="pl-map-link"
          href={`https://www.google.com/maps/search/?api=1&query=${query}`}
          target="_blank"
          rel="noreferrer"
        >
          {t.directions}
          <Arrow />
        </a>
      </div>
    </div>
  )
}
