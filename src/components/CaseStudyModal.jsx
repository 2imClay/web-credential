import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { CaseVisual } from './CaseStudyCard'

const detailSections = [
  ['01', 'Objective', 'objective'],
  ['02', 'Challenge', 'challenge'],
  ['03', 'Solution / Key work', 'solution'],
  ['04', 'Results / Impact', 'result']
]

export default function CaseStudyModal({ item, onClose }) {
  const dialogRef = useRef(null)

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    const previousActiveElement = document.activeElement
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)
    window.requestAnimationFrame(() => dialogRef.current?.focus())

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
      previousActiveElement?.focus?.()
    }
  }, [onClose])

  return createPortal(
    <div
      className="case-study-modal"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <section
        ref={dialogRef}
        className="case-study-modal__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="case-study-modal-title"
        tabIndex="-1"
      >
        <button className="case-study-modal__close" type="button" onClick={onClose} aria-label="Close case study">
          <X />
        </button>

        <div className="case-study-modal__hero">
          <div className="case-study-modal__visual"><CaseVisual item={item} /></div>
          <div className="case-study-modal__intro">
            <p className="case-study-modal__meta"><span>{item.category}</span><span>{item.year}</span></p>
            <h2 id="case-study-modal-title">{item.title}</h2>
            {item.summary && <p className="case-study-modal__summary">{item.summary}</p>}
          </div>
        </div>

        <div className="case-study-modal__details">
          {detailSections.map(([no, title, field]) => (
            <article key={field}>
              <span>{no}</span>
              <h3>{title}</h3>
              <p>{item[field]?.trim() || 'Content is being updated.'}</p>
            </article>
          ))}
        </div>
      </section>
    </div>,
    document.body
  )
}
