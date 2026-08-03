import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, MoveHorizontal, MousePointer2 } from 'lucide-react'

export default function MilestoneRail({ items }) {
  const railRef = useRef(null)
  const cardRefs = useRef([])
  const frameRef = useRef(0)
  const drag = useRef({ active: false, moved: false, startX: 0, scrollLeft: 0 })
  const [dragging, setDragging] = useState(false)
  const [progress, setProgress] = useState(0)
  const [activeIndex, setActiveIndex] = useState(0)

  function syncVisuals() {
    const rail = railRef.current
    if (!rail) return

    const maxScroll = Math.max(1, rail.scrollWidth - rail.clientWidth)
    const nextProgress = Math.min(1, Math.max(0, rail.scrollLeft / maxScroll))
    const railRect = rail.getBoundingClientRect()
    const viewportCenter = railRect.left + railRect.width / 2
    let closestIndex = 0
    let closestDistance = Number.POSITIVE_INFINITY

    cardRefs.current.forEach((card, index) => {
      if (!card) return
      const cardRect = card.getBoundingClientRect()
      const cardCenter = cardRect.left + cardRect.width / 2
      const signedDistance = (cardCenter - viewportCenter) / Math.max(railRect.width * 0.62, 1)
      const focus = Math.max(0, 1 - Math.abs(signedDistance))
      const distance = Math.abs(cardCenter - viewportCenter)

      card.style.setProperty('--timeline-focus', focus.toFixed(3))
      card.style.setProperty('--timeline-offset', signedDistance.toFixed(3))
      card.style.setProperty('--timeline-scale', (0.86 + focus * 0.14).toFixed(3))
      card.style.setProperty('--timeline-lift', `${Math.round((1 - focus) * 26)}px`)
      card.style.setProperty('--timeline-rotate', `${(signedDistance * -7).toFixed(2)}deg`)
      card.style.setProperty('--timeline-opacity', (0.38 + focus * 0.62).toFixed(3))
      card.style.setProperty('--timeline-glow', (focus * 0.34).toFixed(3))
      card.style.setProperty('--timeline-saturation', (0.68 + focus * 0.7).toFixed(3))
      card.style.setProperty('--timeline-brightness', (0.72 + focus * 0.28).toFixed(3))

      if (distance < closestDistance) {
        closestDistance = distance
        closestIndex = index
      }
    })

    cardRefs.current.forEach((card, index) => card?.classList.toggle('is-active', index === closestIndex))
    setProgress((current) => Math.abs(current - nextProgress) > 0.002 ? nextProgress : current)
    setActiveIndex((current) => current === closestIndex ? current : closestIndex)
  }

  function requestVisualSync() {
    cancelAnimationFrame(frameRef.current)
    frameRef.current = requestAnimationFrame(syncVisuals)
  }

  useEffect(() => {
    const rail = railRef.current
    if (!rail) return undefined

    function handleWheel(event) {
      if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return
      const maxScroll = rail.scrollWidth - rail.clientWidth
      const movingForward = event.deltaY > 0
      const canMove = movingForward ? rail.scrollLeft < maxScroll - 2 : rail.scrollLeft > 2

      if (!canMove) return
      event.preventDefault()
      rail.scrollLeft += event.deltaY * 1.05
    }

    const resizeObserver = new ResizeObserver(requestVisualSync)
    resizeObserver.observe(rail)
    rail.addEventListener('scroll', requestVisualSync, { passive: true })
    rail.addEventListener('wheel', handleWheel, { passive: false })
    requestVisualSync()

    return () => {
      cancelAnimationFrame(frameRef.current)
      resizeObserver.disconnect()
      rail.removeEventListener('scroll', requestVisualSync)
      rail.removeEventListener('wheel', handleWheel)
    }
  }, [items])

  function onPointerDown(event) {
    const rail = railRef.current
    if (!rail) return
    drag.current = { active: true, moved: false, startX: event.clientX, scrollLeft: rail.scrollLeft }
    setDragging(true)
    rail.setPointerCapture?.(event.pointerId)
  }

  function onPointerMove(event) {
    const rail = railRef.current
    if (!rail || !drag.current.active) return
    const distance = event.clientX - drag.current.startX
    if (Math.abs(distance) > 5) drag.current.moved = true
    rail.scrollLeft = drag.current.scrollLeft - distance * 1.08
  }

  function stopDrag(event) {
    drag.current.active = false
    setDragging(false)
    if (event?.pointerId !== undefined) railRef.current?.releasePointerCapture?.(event.pointerId)
  }

  function scroll(direction) {
    railRef.current?.scrollBy({ left: direction * 460, behavior: 'smooth' })
  }

  function focusCard(index) {
    if (drag.current.moved) return
    const rail = railRef.current
    const card = cardRefs.current[index]
    if (!rail || !card) return
    const target = card.offsetLeft - (rail.clientWidth - card.offsetWidth) / 2
    rail.scrollTo({ left: target, behavior: 'smooth' })
  }

  const activeItem = items[activeIndex] || items[0]

  return (
    <div className="milestone-shell milestone-shell--cinematic">
      <div className="milestone-toolbar">
        <div className="milestone-instruction">
          <MoveHorizontal />
          <p>Kéo ngang hoặc lăn chuột trên timeline. Mỗi cột sẽ tự nổi lên khi đi vào tâm.</p>
        </div>
        <div>
          <button type="button" onClick={() => scroll(-1)} aria-label="Xem mốc trước"><ArrowLeft /></button>
          <button type="button" onClick={() => scroll(1)} aria-label="Xem mốc tiếp theo"><ArrowRight /></button>
        </div>
      </div>

      <div className="milestone-progress-hud" aria-live="polite">
        <div>
          <span>Active chapter</span>
          <strong>{activeItem?.year}</strong>
          <small>{activeItem?.title}</small>
        </div>
        <div className="milestone-progress-line">
          <i style={{ width: `${progress * 100}%` }} />
          <b style={{ left: `${progress * 100}%` }} />
        </div>
        <span>{String(activeIndex + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}</span>
      </div>

      <div className="milestone-portal" aria-hidden="true">
        <span /><span /><span />
      </div>

      <div
        ref={railRef}
        className={`milestone-rail milestone-rail--cinematic ${dragging ? 'is-dragging' : ''}`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={stopDrag}
        onPointerCancel={stopDrag}
      >
        <div className="milestone-track milestone-track--cinematic">
          <span className="milestone-energy-line" aria-hidden="true"><i /></span>
          {items.map((item, index) => (
            <article
              ref={(node) => { cardRefs.current[index] = node }}
              className={`milestone-card milestone-card--cinematic ${index % 2 ? 'milestone-card--bottom' : ''}`}
              key={`${item.year}-${item.title}`}
              style={{ '--timeline-index': index, '--timeline-delay': `${index * -0.55}s` }}
              onClick={() => focusCard(index)}
            >
              <div className="milestone-content">
                <span>{item.title}</span>
                {item.text.split('\n').map((line) => <p key={line}>{line}</p>)}
              </div>
              <div className="milestone-year"><span>{item.year}</span><MousePointer2 /></div>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}
