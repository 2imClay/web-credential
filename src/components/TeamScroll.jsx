import { useEffect, useRef, useState } from 'react'
import { ArrowDown, ArrowUp } from 'lucide-react'

export default function TeamScroll({ items }) {
  const viewportRef = useRef(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const viewport = viewportRef.current
    if (!viewport) return undefined
    const update = () => {
      const max = Math.max(1, viewport.scrollHeight - viewport.clientHeight)
      setProgress(viewport.scrollTop / max)
    }
    update()
    viewport.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      viewport.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  function scroll(direction) {
    viewportRef.current?.scrollBy({ top: direction * 210, behavior: 'smooth' })
  }

  return (
    <div className="team-panel">
      <div ref={viewportRef} className="team-viewport">
        <div className="team-list">
          {items.map((item, index) => (
            <article key={item.role} className="team-role">
              <span>{String(index + 1).padStart(2, '0')}</span>
              <div><h3>{item.role}</h3><p>{item.detail}</p></div>
              <strong>{item.count}<small>members</small></strong>
            </article>
          ))}
        </div>
      </div>
      <div className="team-scroll-control" aria-label="Team section scroll controls">
        <button type="button" onClick={() => scroll(-1)} aria-label="Cuộn lên"><ArrowUp /></button>
        <div className="team-scroll-track"><span style={{ top: `calc(${progress * 100}% - ${progress * 42}px)` }} /></div>
        <button type="button" onClick={() => scroll(1)} aria-label="Cuộn xuống"><ArrowDown /></button>
      </div>
    </div>
  )
}
