import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import CaseStudyCard from './CaseStudyCard'
import CaseStudyModal from './CaseStudyModal'

export default function CaseStudyGallery({ items, copy = {} }) {
  const allLabel = copy.allCasesLabel || 'All'
  const categories = useMemo(() => [allLabel, ...new Set(items.map((item) => item.category))], [allLabel, items])
  const [active, setActive] = useState(allLabel)
  const [isDragging, setIsDragging] = useState(false)
  const [selectedCase, setSelectedCase] = useState(null)
  const railRef = useRef(null)
  const dragState = useRef({ active: false, startX: 0, scrollLeft: 0, moved: false })
  const suppressClick = useRef(false)
  const visible = active === allLabel ? items : items.filter((item) => item.category === active)
  const closeCase = useCallback(() => setSelectedCase(null), [])

  useEffect(() => {
    if (!categories.includes(active)) setActive(allLabel)
  }, [active, allLabel, categories])

  const handlePointerDown = (event) => {
    const rail = railRef.current
    if (!rail || event.pointerType === 'mouse' && event.button !== 0) return
    if (event.target.closest('button, a, input, textarea, select, label')) return

    dragState.current = {
      active: true,
      startX: event.clientX,
      scrollLeft: rail.scrollLeft,
      moved: false
    }
    rail.setPointerCapture?.(event.pointerId)
    setIsDragging(true)
  }

  const handlePointerMove = (event) => {
    const rail = railRef.current
    if (!rail || !dragState.current.active) return

    const delta = event.clientX - dragState.current.startX
    if (Math.abs(delta) > 6) dragState.current.moved = true
    rail.scrollLeft = dragState.current.scrollLeft - delta
  }

  const finishDrag = (event) => {
    if (!dragState.current.active) return

    suppressClick.current = dragState.current.moved
    dragState.current.active = false
    railRef.current?.releasePointerCapture?.(event.pointerId)
    setIsDragging(false)
    window.setTimeout(() => { suppressClick.current = false }, 0)
  }

  const blockDraggedClick = (event) => {
    if (!suppressClick.current) return
    event.preventDefault()
    event.stopPropagation()
  }

  return (
    <>
      <div className="case-gallery">
      <div className="case-gallery-toolbar">
        <div className="case-tabs" role="tablist" aria-label="Case study categories">
          {categories.map((category) => (
            <button
              type="button"
              key={category}
              className={active === category ? 'is-active' : ''}
              onClick={() => setActive(category)}
            >
              {category}
            </button>
          ))}
        </div>

      </div>

      <div
        ref={railRef}
        className={`case-rail ${isDragging ? 'is-dragging' : ''}`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={finishDrag}
        onPointerCancel={finishDrag}
        onClickCapture={blockDraggedClick}
      >
        {visible.map((item) => <CaseStudyCard item={item} onView={setSelectedCase} key={item.id} />)}
      </div>
      </div>

      {selectedCase && <CaseStudyModal item={selectedCase} onClose={closeCase} />}
    </>
  )
}
