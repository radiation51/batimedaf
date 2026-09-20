/**
 * Location pieces shared by the residence and apartment pages: the embedded
 * map with its address plate, and the transport / nearby lists.
 */
import { Bus, CarSimple, Subway, Tram } from '@phosphor-icons/react'
import { useUI } from '../i18n/useLocalizedContent'
import './Place.css'

const Arrow = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path
      d="M3.5 8h9M8.5 3.5 13 8l-4.5 4.5"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

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

/* A generic mode of transport rather than a numbered line — e.g. Algiers'
   bus/tramway/car/metro network, which has no line colours to look up.
   Each gets its own icon and a soft, muted tint (in the site's warm
   palette rather than a generic transit app's primary colours). */
const MODES = {
  bus: { Icon: Bus, color: '#9c9457' },
  tramway: { Icon: Tram, color: '#6f9483' },
  tram: { Icon: Tram, color: '#6f9483' },
  voiture: { Icon: CarSimple, color: '#c79a49' },
  car: { Icon: CarSimple, color: '#c79a49' },
  métro: { Icon: Subway, color: '#b1798a' },
  metro: { Icon: Subway, color: '#b1798a' },
}

/** Renders 'Ligne 9' or 'RER C' as a coloured badge plus its network. */
export function LineBadge({ line }) {
  const mode = MODES[String(line).trim().toLowerCase()]
  if (mode) {
    const { Icon, color } = mode
    return (
      <span className="pl-line" title={line}>
        <span className="pl-mode-badge" style={{ background: color }}>
          <Icon size={18} weight="fill" color="#fff7f0" />
        </span>
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

export function TransportList({ transports }) {
  return (
    <ul className="pl-list pl-transports">
      {transports.map((transport) => {
        const [stop, time] = splitDetail(transport.detail)
        return (
          <li key={transport.line}>
            <LineBadge line={transport.line} />
            <span className="pl-stop">{stop}</span>
            {time && <span className="pl-time">{time}</span>}
          </li>
        )
      })}
    </ul>
  )
}

export function NearbyList({ items }) {
  return (
    <ul className="pl-list pl-nearby">
      {items.map((item) => {
        const [name, time] = splitDetail(item)
        return (
          <li key={item}>
            <span className="pl-stop">{name}</span>
            {time && <span className="pl-time">{time}</span>}
          </li>
        )
      })}
    </ul>
  )
}

/** Embedded map plus the address plate that sits under it. */
export function PlaceMap({ address, title }) {
  const t = useUI()
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
          <p className="pl-map-address">{address}</p>
        </div>
        <a
          className="pl-map-link"
          href={`https://www.google.com/maps/search/?api=1&query=${query}`}
          target="_blank"
          rel="noreferrer"
        >
          <span>{t.directions}</span>
          <Arrow size={15} />
        </a>
      </div>
    </div>
  )
}
