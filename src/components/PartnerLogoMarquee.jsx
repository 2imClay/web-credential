import { groupPartnersByRow } from '../utils/partnerRows'

const MIN_LOGOS_PER_SEQUENCE = 20

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
      {items.map((item, index) => (
        <div aria-hidden={!duplicate && index >= item.sourceCount ? true : undefined} key={`${row}-${item.id || item.name}-${index}`}>
          <PartnerLogo item={item} />
        </div>
      ))}
    </div>
  )
}

function createSeamlessSequence(items) {
  if (!items.length) return []
  const repetitions = Math.ceil(MIN_LOGOS_PER_SEQUENCE / items.length)
  return Array.from({ length: repetitions }, () => items)
    .flat()
    .map((item) => ({ ...item, sourceCount: items.length }))
}

export default function PartnerLogoMarquee({ items = [] }) {
  if (!items.length) return null

  const rows = groupPartnersByRow(items)

  return (
    <div className="partner-streams" aria-label="DGM partner logos">
      {rows.map((rowItems, row) => {
        const sequence = createSeamlessSequence(rowItems)
        if (!sequence.length) return null
        const duration = sequence.length * (5 + row * .45)

        return (
          <div className={`partner-stream partner-stream--${row + 1}`} key={row}>
            <div className="partner-stream__track" style={{ '--partner-duration': `${duration}s` }}>
              <StreamGroup items={sequence} row={row} />
              <StreamGroup items={sequence} row={row} duplicate />
            </div>
          </div>
        )
      })}
    </div>
  )
}
