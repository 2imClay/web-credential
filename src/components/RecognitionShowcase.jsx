import { useMemo, useState } from 'react'
import { Award, ArrowUpRight } from 'lucide-react'

function RecognitionVisual({ item }) {
  if (item.image) return <img src={item.image} alt={item.title} />

  return (
    <div className="recognition-poster" aria-label={`${item.title} visual placeholder`}>
      <div className="recognition-poster-top"><span>DGM</span><span>{item.year}</span></div>
      <Award />
      <p>{item.subtitle}</p>
      <strong>{item.title}</strong>
      <div className="recognition-poster-lines"><i /><i /><i /></div>
    </div>
  )
}

export default function RecognitionShowcase({ items }) {
  const firstId = items[0]?.id
  const [activeId, setActiveId] = useState(firstId)
  const active = useMemo(() => items.find((item) => item.id === activeId) ?? items[0], [activeId, items])

  if (!active) return null

  return (
    <div className="recognition-showcase">
      <div className="recognition-stage">
        <div className="recognition-media"><RecognitionVisual item={active} /></div>
        <div className="recognition-copy">
          <span>{active.year}</span>
          <h3>{active.title}</h3>
          <strong>{active.subtitle}</strong>
          <p>{active.description}</p>
          <a href="#contact">Discuss our capabilities <ArrowUpRight size={17} /></a>
        </div>
      </div>
      <div className="recognition-selector" role="tablist" aria-label="Recognition list">
        {items.map((item, index) => (
          <button
            type="button"
            role="tab"
            aria-selected={active.id === item.id}
            className={active.id === item.id ? 'is-active' : ''}
            key={item.id}
            onClick={() => setActiveId(item.id)}
          >
            <span>{String(index + 1).padStart(2, '0')}</span>
            <div><strong>{item.title}</strong><small>{item.subtitle}</small></div>
          </button>
        ))}
      </div>
    </div>
  )
}
