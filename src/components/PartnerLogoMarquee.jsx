function PartnerLogo({ item }) {
  return (
    <div className="partner-stream__logo">
      {item.logo ? <img src={item.logo} alt={item.name} /> : <strong>{item.name}</strong>}
      <span>{item.group}</span>
    </div>
  )
}

function StreamGroup({ items, row }) {
  return (
    <div className="partner-stream__group" aria-hidden={row > 0}>
      {items.map((item, index) => <PartnerLogo item={item} key={`${row}-${item.id || item.name}-${index}`} />)}
    </div>
  )
}

export default function PartnerLogoMarquee({ items = [] }) {
  if (!items.length) return null

  const rows = [0, 1, 2].map((row) => {
    const offset = Math.floor((items.length / 3) * row)
    return [...items.slice(offset), ...items.slice(0, offset)]
  })

  return (
    <div className="partner-streams" aria-label="DGM partner logos">
      {rows.map((rowItems, row) => (
        <div className={`partner-stream partner-stream--${row + 1}`} key={row}>
          <div className="partner-stream__track">
            <StreamGroup items={rowItems} row={row} />
            <StreamGroup items={rowItems} row={row + 3} />
          </div>
        </div>
      ))}
    </div>
  )
}
