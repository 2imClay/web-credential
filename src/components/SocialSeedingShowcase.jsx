import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Maximize2, X } from 'lucide-react'

export default function SocialSeedingShowcase({ theory = [], cases = [], copy = {} }) {
  const slides = useMemo(() => theory.filter((item) => item?.image), [theory])
  const caseImages = useMemo(() => cases.filter((item) => item?.image), [cases])
  const [activeSlide, setActiveSlide] = useState(0)
  const [activeCase, setActiveCase] = useState(0)
  const [casePaused, setCasePaused] = useState(false)
  const [lightbox, setLightbox] = useState(null)
  const lastWheelAt = useRef(0)
  const lastCaseWheelAt = useRef(0)

  useEffect(() => {
    if (activeSlide >= slides.length) setActiveSlide(Math.max(0, slides.length - 1))
  }, [activeSlide, slides.length])

  useEffect(() => {
    if (activeCase >= caseImages.length) setActiveCase(Math.max(0, caseImages.length - 1))
  }, [activeCase, caseImages.length])

  useEffect(() => {
    if (casePaused || caseImages.length < 2) return undefined
    const timer = window.setInterval(() => {
      setActiveCase((current) => (current + 1) % caseImages.length)
    }, 7200)
    return () => window.clearInterval(timer)
  }, [caseImages.length, casePaused])

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
  const moveCase = (direction) => {
    if (caseImages.length < 2) return
    setActiveCase((current) => (current + direction + caseImages.length) % caseImages.length)
  }
  const getCaseCircularOffset = (index) => {
    let offset = index - activeCase
    const half = Math.floor(caseImages.length / 2)
    if (offset > half) offset -= caseImages.length
    if (offset < -half) offset += caseImages.length
    return offset
  }
  const handleCaseWheel = (event) => {
    const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : (event.shiftKey ? event.deltaY : 0)
    if (caseImages.length < 2 || Math.abs(delta) < 8) return
    event.preventDefault()
    const now = Date.now()
    if (now - lastCaseWheelAt.current < 520) return
    lastCaseWheelAt.current = now
    moveCase(delta > 0 ? 1 : -1)
  }

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
            className="seeding-case-carousel seeding-case-carousel--sphere"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: .55, ease: [0.2, 0.8, 0.2, 1] }}
            viewport={{ once: true, amount: .15 }}
            onMouseEnter={() => setCasePaused(true)}
            onMouseLeave={() => setCasePaused(false)}
            onFocusCapture={() => setCasePaused(true)}
            onBlurCapture={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget)) setCasePaused(false)
            }}
            onWheel={handleCaseWheel}
            onPanEnd={(_, info) => {
              if (Math.abs(info.offset.x) > 42 || Math.abs(info.velocity.x) > 420) moveCase(info.offset.x < 0 ? 1 : -1)
            }}
          >
            <div className="seeding-case-sphere">
              {caseImages.map((item, index) => {
                const offset = getCaseCircularOffset(index)
                const depth = Math.abs(offset)
                const isActive = index === activeCase

                return (
                  <button
                    type="button"
                    className={`seeding-case-card ${isActive ? 'is-active' : ''} ${depth > 2 ? 'is-hidden' : ''}`}
                    onClick={() => isActive ? setLightbox({ type: 'case', index }) : setActiveCase(index)}
                    aria-label={isActive ? (item.alt || `Open ${copy.caseLabel || 'case image'} ${index + 1}`) : `Bring ${item.alt || `case image ${index + 1}`} to center`}
                    aria-hidden={depth > 2}
                    tabIndex={depth > 2 ? -1 : 0}
                    style={{
                      '--case-x': `${offset * 330}px`,
                      '--case-x-tablet': `${offset * 238}px`,
                      '--case-x-mobile': `${offset * 68}vw`,
                      '--case-y': `${isActive ? -10 : 12 + depth * 8}px`,
                      '--case-scale': Math.max(.7, 1.03 - depth * .15),
                      '--case-rotate-y': `${offset * -11}deg`,
                      '--case-opacity': Math.max(.16, 1 - depth * .43),
                      '--case-blur': `${depth * 1.35}px`,
                      zIndex: 10 - depth
                    }}
                    key={item.id || item.image}
                  >
                    <img src={item.image} alt={isActive ? (item.alt || '') : ''} loading="lazy" />
                    <span aria-hidden="true"><Maximize2 /></span>
                  </button>
                )
              })}
            </div>

            {caseImages.length > 1 && <>
              <button
                type="button"
                className="seeding-case-carousel__nav seeding-case-carousel__nav--prev"
                onClick={() => moveCase(-1)}
                aria-label="Previous Social Seeding case"
              >
                <ArrowLeft />
              </button>
              <button
                type="button"
                className="seeding-case-carousel__nav seeding-case-carousel__nav--next"
                onClick={() => moveCase(1)}
                aria-label="Next Social Seeding case"
              >
                <ArrowRight />
              </button>
            </>}

            {caseImages.length > 1 && (
              <div className="seeding-case-carousel__status" aria-label={`Case ${activeCase + 1} of ${caseImages.length}`}>
                <span>{String(activeCase + 1).padStart(2, '0')} / {String(caseImages.length).padStart(2, '0')}</span>
                <div>
                  {caseImages.map((item, index) => (
                    <button
                      type="button"
                      className={index === activeCase ? 'is-active' : ''}
                      onClick={() => setActiveCase(index)}
                      aria-label={`Show Social Seeding case ${index + 1}`}
                      key={`case-dot-${item.id || item.image}`}
                    />
                  ))}
                </div>
              </div>
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
