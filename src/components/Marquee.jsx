export default function Marquee({ items, dark = false }) {
  const repeated = [...items, ...items]
  return (
    <div className={`marquee ${dark ? 'marquee--dark' : ''}`}>
      <div className="marquee-track">
        {repeated.map((item, index) => <span key={`${item}-${index}`}>{item}<i /></span>)}
      </div>
    </div>
  )
}
