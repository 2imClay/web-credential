import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'

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

export default function CaseStudyCard({ item }) {
  return (
    <Link to={`/case-studies/${item.slug}`} className="case-card">
      <div className="case-card-image"><CaseVisual item={item} /></div>
      <div className="case-card-meta"><span>{item.category}</span><span>{item.year}</span></div>
      <div className="case-card-copy">
        <h3>{item.title}</h3>
        <p>{item.summary}</p>
      </div>
      <span className="case-card-link">Read case study <ArrowUpRight /></span>
    </Link>
  )
}
