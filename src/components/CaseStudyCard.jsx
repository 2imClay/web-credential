import { ArrowUpRight } from 'lucide-react'

export function CaseVisual({ item, compact = false }) {
  if (item.image) return <img src={item.image} alt={item.title} />
  return (
    <div className={`case-visual-fallback ${compact ? 'case-visual-fallback--compact' : ''}`}>
      <span>{item.category}</span>
      <strong>{item.title.split('—')[0].trim()}</strong>
      <div><i /><i /><i /></div>
    </div>
  )
}

export default function CaseStudyCard({ item, onView }) {
  const cardSummary = Object.hasOwn(item, 'cardSummary') ? item.cardSummary : item.summary

  return (
    <article className="case-card">
      <div className="case-card-image"><CaseVisual item={item} /></div>
      <div className="case-card-meta"><span>{item.category}</span><span>{item.year}</span></div>
      <div className="case-card-copy">
        <h3>{item.title}</h3>
        {cardSummary && <p>{cardSummary}</p>}
      </div>
      <div className="case-card-footerbar">
        <button className="case-card-link" type="button" onClick={() => onView(item)}>View case <ArrowUpRight /></button>
      </div>
    </article>
  )
}
