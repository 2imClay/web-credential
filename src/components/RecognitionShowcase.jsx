import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowDown, ArrowUp, ArrowUpRight, Award } from 'lucide-react'

function RecognitionCardVisual({ item }) {
  if (item.image) {
    return <img src={item.image} alt={item.title} className="recognition-article-card__image" />
  }

  return (
    <div className="recognition-article-card__placeholder" aria-label={`${item.title} placeholder`}>
      <div className="recognition-article-card__placeholderTop"><span>DGM</span><span>{item.year}</span></div>
      <div className="recognition-article-card__placeholderCore">
        <Award />
        <strong>{item.title}</strong>
        <p>{item.subtitle}</p>
      </div>
      <div className="recognition-article-card__placeholderLines"><i /><i /><i /></div>
    </div>
  )
}

export default function RecognitionShowcase({ items }) {
  const cardRefs = useRef([])
  const [activeIndex, setActiveIndex] = useState(0)
  const active = useMemo(() => items[activeIndex] ?? items[0], [activeIndex, items])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (!visible.length) return
        const index = Number(visible[0].target.getAttribute('data-index') || 0)
        setActiveIndex(index)
      },
      {
        root: null,
        threshold: [0.25, 0.45, 0.65],
        rootMargin: '-18% 0px -18% 0px'
      }
    )

    cardRefs.current.forEach((card) => card && observer.observe(card))
    return () => observer.disconnect()
  }, [items])

  function scrollToCard(index) {
    const target = cardRefs.current[index]
    target?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  function step(direction) {
    const next = Math.max(0, Math.min(items.length - 1, activeIndex + direction))
    scrollToCard(next)
  }

  if (!active) return null

  return (
    <div className="recognition-flow">
      <aside className="recognition-flow__aside">
        <div className="recognition-flow__asideInner">
          <p className="eyebrow text-cyan-300">Featured recognitions</p>
          <h3>Our latest recognition &amp; industry mentions</h3>
          <p>
            Selected awards, agency rankings and press mentions. Each card is highlighted
            as it comes into view while you scroll.
          </p>
          <div className="recognition-flow__meta">
            <span>{String(activeIndex + 1).padStart(2, '0')}</span>
            <i />
            <small>{active.year}</small>
          </div>
          <a href="#contact" className="recognition-flow__cta">
            Talk with DGM <ArrowUpRight size={16} />
          </a>
        </div>
      </aside>

      <div className="recognition-flow__content">
        <div className="recognition-flow__nav">
          <button type="button" onClick={() => step(-1)} aria-label="Recognition previous"><ArrowUp size={18} /></button>
          <button type="button" onClick={() => step(1)} aria-label="Recognition next"><ArrowDown size={18} /></button>
        </div>

        <div className="recognition-flow__stack">
          {items.map((item, index) => {
            const isActive = index === activeIndex
            return (
              <article
                className={`recognition-article-card ${isActive ? 'is-active' : ''}`}
                key={item.id}
                data-index={index}
                ref={(node) => { cardRefs.current[index] = node }}
                onClick={() => scrollToCard(index)}
              >
                <div className="recognition-article-card__copy">
                  <div className="recognition-article-card__eyebrow">
                    <span>{item.year}</span>
                    <i />
                    <small>{item.subtitle}</small>
                  </div>
                  <h4>{item.title}</h4>
                  <p>{item.description}</p>
                  <div className="recognition-article-card__footer">
                    <strong>{String(index + 1).padStart(2, '0')}</strong>
                    <span>Recognition</span>
                  </div>
                </div>
                <div className="recognition-article-card__media">
                  <RecognitionCardVisual item={item} />
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </div>
  )
}
