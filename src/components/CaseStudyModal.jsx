import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { CaseVisual } from './CaseStudyCard'

export default function CaseStudyModal({ item, onClose }) {
  const dialogRef = useRef(null)
  const gallery = [item.image, ...(Array.isArray(item.gallery) ? item.gallery : [])]
    .filter((source, index, sources) => source && sources.indexOf(source) === index)

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
          <div className="case-study-modal__intro">
            <p className="case-study-modal__meta"><span>{item.category}</span><span>{item.year}</span></p>
            <h2 id="case-study-modal-title">{item.title}</h2>
            {item.summary && <p className="case-study-modal__summary">{item.summary}</p>}
          </div>
        </div>

        <div className="case-study-modal__body case-study-modal__body--media-only">
          <div className="case-study-modal__gallery">
            {gallery.length ? gallery.map((source, index) => (
              <figure className={index === 0 ? 'is-cover' : ''} key={`${source}-${index}`}>
                <img src={source} alt={`${item.title} — image ${index + 1}`} />
              </figure>
            )) : (
              <figure className="is-cover case-study-modal__fallback"><CaseVisual item={item} /></figure>
            )}
          </div>
        </div>
      </section>
    </div>,
    document.body
  )
}
