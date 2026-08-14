import { groupPartnersByRow } from '../utils/partnerRows'

function PartnerLogo({ item }) {
  const name = item.name?.trim()
  const group = item.group?.trim()

  return (
    <div className="partner-stream__logo">
      {item.logo ? <img src={item.logo} alt={name || 'Partner logo'} /> : name ? <strong>{name}</strong> : null}
      {group && <span>{group}</span>}
    </div>
  )
}

function StreamGroup({ items, row, duplicate = false }) {
  return (
    <div className="partner-stream__group" aria-hidden={duplicate || undefined}>
      {items.map((item, index) => <PartnerLogo item={item} key={`${row}-${item.id || item.name}-${index}`} />)}
    </div>
  )
}

export default function PartnerLogoMarquee({ items = [] }) {
  if (!items.length) return null

  const rows = groupPartnersByRow(items)

  return (
    <div className="partner-streams" aria-label="DGM partner logos">
      {rows.map((rowItems, row) => (
        <div className={`partner-stream partner-stream--${row + 1}`} key={row}>
          <div className="partner-stream__track">
            <StreamGroup items={rowItems} row={row} />
            <StreamGroup items={rowItems} row={row} duplicate />
          </div>
        </div>
      ))}
    </div>
  )
}
