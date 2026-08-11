import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowDown, ArrowUp } from 'lucide-react'

export default function TeamScroll({ items }) {
  const cardRefs = useRef([])
  const [activeIndex, setActiveIndex] = useState(0)
  const active = useMemo(() => items[activeIndex] ?? items[0], [activeIndex, items])
  const rotation = activeIndex * (360 / Math.max(items.length, 1))

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
        threshold: [0.3, 0.5, 0.7],
        rootMargin: '-20% 0px -20% 0px'
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

  return (
    <div className="team-orbit-layout">
      <div className="team-orbit-stage">
        <div className="team-orbit-core">
          <div className="team-orbit-glow" />
          <div className="team-orbit-disc" style={{ transform: `rotate(${rotation}deg)` }}>
            <div className="team-orbit-ring team-orbit-ring--outer" />
            <div className="team-orbit-ring team-orbit-ring--inner" />
            {items.map((item, index) => {
              const angle = (index / items.length) * Math.PI * 2 - Math.PI / 2
              const x = Math.cos(angle) * 182
              const y = Math.sin(angle) * 182
              const activeDot = index === activeIndex
              return (
                <span
                  key={item.role}
                  className={`team-orbit-node ${activeDot ? 'is-active' : ''}`}
                  style={{ transform: `translate(${x}px, ${y}px) rotate(${-rotation}deg)` }}
                >
                  {String(index + 1).padStart(2, '0')}
                </span>
              )
            })}
            <div className="team-orbit-content" style={{ transform: `rotate(${-rotation}deg)` }}>
              <small>Current team</small>
              <strong>{String(activeIndex + 1).padStart(2, '0')}</strong>
              <h3>{active?.role}</h3>
              <p>{active?.count} members</p>
            </div>
          </div>
        </div>
      </div>

      <div className="team-orbit-listWrap">
        <div className="team-orbit-controls">
          <button type="button" onClick={() => step(-1)} aria-label="Team previous"><ArrowUp size={18} /></button>
          <button type="button" onClick={() => step(1)} aria-label="Team next"><ArrowDown size={18} /></button>
        </div>
        <div className="team-orbit-list">
          {items.map((item, index) => {
            const isActive = index === activeIndex
            return (
              <article
                key={item.role}
                data-index={index}
                ref={(node) => { cardRefs.current[index] = node }}
                className={`team-orbit-card ${isActive ? 'is-active' : ''}`}
                onClick={() => scrollToCard(index)}
              >
                <div className="team-orbit-card__count">{item.count}</div>
                <div className="team-orbit-card__copy">
                  <div className="team-orbit-card__head">
                    <span>{String(index + 1).padStart(2, '0')}</span>
                    <small>DGM Team</small>
                  </div>
                  <h4>{item.role}</h4>
                  <p>{item.detail}</p>
                  <div className="team-orbit-card__tags">
                    <b>Strategy</b><b>Execution</b><b>Growth</b>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </div>
  )
}
