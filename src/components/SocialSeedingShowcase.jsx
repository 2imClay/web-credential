import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Maximize2, X } from 'lucide-react'

export default function SocialSeedingShowcase({ theory = [], cases = [], copy = {} }) {
  const slides = useMemo(() => theory.filter((item) => item?.image), [theory])
  const caseImages = useMemo(() => cases.filter((item) => item?.image), [cases])
  const [activeSlide, setActiveSlide] = useState(0)
  const [lightbox, setLightbox] = useState(null)
  const lastWheelAt = useRef(0)
  const caseStripRef = useRef(null)

  useEffect(() => {
    if (activeSlide >= slides.length) setActiveSlide(Math.max(0, slides.length - 1))
  }, [activeSlide, slides.length])

  const lightboxItems = lightbox?.type === 'case' ? caseImages : slides
  const lightboxItem = lightbox ? lightboxItems[lightbox.index] : null

  useEffect(() => {
    if (!lightboxItem) return undefined
    const previousOverflow = document.body.style.overflow
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setLightbox(null)
      if (event.key === 'ArrowRight') setLightbox((current) => ({ ...current, index: (current.index + 1) % lightboxItems.length }))
      if (event.key === 'ArrowLeft') setLightbox((current) => ({ ...current, index: (current.index - 1 + lightboxItems.length) % lightboxItems.length }))
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [lightboxItem, lightboxItems.length])

  if (!slides.length && !caseImages.length) return null

  const getCircularOffset = (index) => {
    let offset = index - activeSlide
    const half = Math.floor(slides.length / 2)
    if (offset > half) offset -= slides.length
    if (offset < -half) offset += slides.length
    return offset
  }
  const handleOrbitWheel = (event) => {
    if (slides.length < 2 || Math.abs(event.deltaY) < 8) return
    event.preventDefault()
    const now = Date.now()
    if (now - lastWheelAt.current < 220) return
    lastWheelAt.current = now
    setActiveSlide((current) => (current + (event.deltaY > 0 ? 1 : -1) + slides.length) % slides.length)
  }
  const moveLightbox = (direction) => setLightbox((current) => ({
    ...current,
    index: (current.index + direction + lightboxItems.length) % lightboxItems.length
  }))

  return (
    <div className="social-seeding-showcase">
      {slides.length > 0 && (
        <div className="seeding-theory">
          <div className="seeding-theory__stage">
            <div className="seeding-theory__viewer">
              <div className="seeding-theory__deck" aria-label="Methodology slide stack">
                {slides.map((item, index) => {
                  const offset = getCircularOffset(index)
                  const depth = Math.abs(offset)
                  const isActive = index === activeSlide

                  return (
                    <motion.button
                      type="button"
                      className={`seeding-theory__deck-card ${item.title ? 'has-caption' : ''} ${isActive ? 'is-active' : ''}`}
                      onClick={() => isActive ? setLightbox({ type: 'theory', index }) : setActiveSlide(index)}
                      initial={false}
                      animate={{
                        x: offset * 24,
                        y: depth * 19,
                        rotate: offset * 3.6,
                        scale: Math.max(.9, 1 - depth * .04),
                        opacity: depth > 1 ? 0 : 1
                      }}
                      transition={{
                        type: 'spring',
                        stiffness: isActive ? 118 : 145,
                        damping: isActive ? 18 : 21,
                        mass: .86,
                        opacity: { duration: .3, ease: 'easeOut' }
                      }}
                      style={{ zIndex: 30 - depth, pointerEvents: depth > 1 ? 'none' : 'auto' }}
                      tabIndex={depth > 1 ? -1 : 0}
                      aria-hidden={depth > 1}
                      aria-label={isActive ? `Open ${item.title || copy.slideLabel || 'methodology slide'}` : `Bring ${item.title || `slide ${index + 1}`} to front`}
                      key={item.id || item.image}
                    >
                      <img src={item.image} alt={isActive ? (item.alt || item.title || '') : ''} />
                      {item.title && <strong className="seeding-theory__card-title">{item.title}</strong>}
                    </motion.button>
                  )
                })}
              </div>

            </div>

            {slides.length > 1 && (
              <div className="seeding-theory__orbit" aria-label="Methodology 3D slide carousel" onWheel={handleOrbitWheel}>
                <div className="seeding-theory__orbit-axis" aria-hidden="true" />
                {slides.map((item, index) => {
                  const offset = getCircularOffset(index)
                  const depth = Math.abs(offset)
                  return (
                    <button
                      type="button"
                      className={`${index === activeSlide ? 'is-active' : ''} ${depth > 3 ? 'is-hidden' : ''}`}
                      style={{
                        '--orbit-y': `${offset * 74}px`,
                        '--orbit-x': `${depth * 18}px`,
                        '--orbit-rotate': `${offset * -5}deg`,
                        '--orbit-scale': Math.max(.76, 1 - depth * .075),
                        '--orbit-opacity': Math.max(.24, 1 - depth * .24),
                        '--orbit-mobile-x': `${offset * 138}px`,
                        '--orbit-mobile-x-small': `${offset * 112}px`,
                        '--orbit-mobile-y': `${depth * 12}px`,
                        '--orbit-mobile-rotate': `${offset * -7}deg`
                      }}
                      onClick={() => setActiveSlide(index)}
                      key={item.id || item.image}
                      tabIndex={depth > 3 ? -1 : 0}
                      aria-hidden={depth > 3}
                      aria-label={`Select ${item.title || `slide ${index + 1}`}`}
                    >
                      <img src={item.image} alt="" />
                      <span>{String(index + 1).padStart(2, '0')}</span>
                      <strong>{item.title || `Slide ${index + 1}`}</strong>
                      <i aria-hidden="true" />
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {caseImages.length > 0 && (
        <div className="seeding-cases">
          <div className="seeding-subhead seeding-subhead--cases">
            <h3>{copy.casesLabel || 'Selected seeding cases'}</h3>
          </div>

          <motion.div
            className="seeding-case-carousel"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: .55, ease: [0.2, 0.8, 0.2, 1] }}
            viewport={{ once: true, amount: .15 }}
          >
            <div className="seeding-case-strip" ref={caseStripRef}>
              {caseImages.map((item, index) => (
                <button
                  type="button"
                  className="seeding-case-card"
                  onClick={() => setLightbox({ type: 'case', index })}
                  aria-label={item.alt || `Open ${copy.caseLabel || 'case image'} ${index + 1}`}
                  key={item.id || item.image}
                >
                  <img src={item.image} alt={item.alt || ''} loading="lazy" />
                  <span aria-hidden="true"><Maximize2 /></span>
                </button>
              ))}
            </div>

            {caseImages.length > 3 && (
              <button
                type="button"
                className="seeding-case-carousel__next"
                onClick={() => caseStripRef.current?.scrollBy({ left: caseStripRef.current.clientWidth * .72, behavior: 'smooth' })}
                aria-label="Show more Social Seeding cases"
              >
                <ArrowRight />
              </button>
            )}
          </motion.div>
        </div>
      )}

      {lightboxItem && createPortal(
        <motion.div
          className="seeding-lightbox"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onMouseDown={(event) => { if (event.target === event.currentTarget) setLightbox(null) }}
        >
          <button className="seeding-lightbox__close" type="button" onClick={() => setLightbox(null)} aria-label="Close image"><X /></button>
          {lightboxItems.length > 1 && <button className="seeding-lightbox__nav seeding-lightbox__nav--prev" type="button" onClick={() => moveLightbox(-1)} aria-label="Previous image"><ArrowLeft /></button>}
          <motion.img
            src={lightboxItem.image}
            alt={lightboxItem.alt || lightboxItem.title || ''}
            initial={{ opacity: 0, scale: .94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: .3 }}
            key={lightboxItem.id || lightboxItem.image}
          />
          {lightboxItems.length > 1 && <button className="seeding-lightbox__nav seeding-lightbox__nav--next" type="button" onClick={() => moveLightbox(1)} aria-label="Next image"><ArrowRight /></button>}
          <div className="seeding-lightbox__caption">
            {lightboxItem.title && <strong>{lightboxItem.title}</strong>}
            <span>{String(lightbox.index + 1).padStart(2, '0')} / {String(lightboxItems.length).padStart(2, '0')}</span>
          </div>
        </motion.div>,
        document.body
      )}
    </div>
  )
}
