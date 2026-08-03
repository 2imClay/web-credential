export default function PartnerLogoMarquee({ items }) {
  const repeated = [...items, ...items]
  return (
    <div className="logo-marquee" aria-label="DGM partner logos">
      <div className="logo-marquee-track">
        {repeated.map((item, index) => (
          <div className="logo-tile" key={`${item.id}-${index}`}>
            {item.logo ? <img src={item.logo} alt={item.name} /> : <strong>{item.name}</strong>}
            <span>{item.group}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
