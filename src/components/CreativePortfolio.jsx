import { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Maximize2, X } from 'lucide-react'

const categoryKeys = ['categoryOne', 'categoryTwo', 'categoryThree', 'categoryFour']

const tileVariants = {
  hidden: (index) => ({
    opacity: 0,
    x: index % 2 === 0 ? -70 : 70,
    y: 32 + (index % 3) * 12,
    rotate: index % 2 === 0 ? -3 : 3,
    scale: .9
  }),
  visible: (index) => ({
    opacity: 1,
    x: 0,
    y: 0,
    rotate: 0,
    scale: 1,
    transition: { delay: Math.min(index, 8) * .055, duration: .52, ease: [0.2, 0.8, 0.2, 1] }
  }),
  exit: (index) => ({
    opacity: 0,
    x: index % 2 === 0 ? 55 : -55,
    y: -24,
    rotate: index % 2 === 0 ? 2 : -2,
    scale: .94,
    transition: { duration: .25 }
  })
}

export default function CreativePortfolio({ items = [], copy = {} }) {
  const [active, setActive] = useState(0)
  const [selectedId, setSelectedId] = useState(null)
  const categories = categoryKeys.map((key, index) => copy[key] || `Category ${String(index + 1).padStart(2, '0')}`)
  const publishedItems = useMemo(() => items.filter((item) => item?.image), [items])
  const visibleItems = useMemo(
    () => active === 0 ? publishedItems : publishedItems.filter((item) => Number(item.category) === active),
    [active, publishedItems]
  )
  const categoryCounts = categoryKeys.map((_, index) => publishedItems.filter((item) => Number(item.category) === index + 1).length)
  const selectedIndex = visibleItems.findIndex((item) => item.id === selectedId)
  const selectedItem = selectedIndex >= 0 ? visibleItems[selectedIndex] : null

  useEffect(() => {
    if (!selectedItem) return undefined
    const previousOverflow = document.body.style.overflow
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setSelectedId(null)
      if (event.key === 'ArrowRight') setSelectedId(visibleItems[(selectedIndex + 1) % visibleItems.length]?.id || null)
      if (event.key === 'ArrowLeft') setSelectedId(visibleItems[(selectedIndex - 1 + visibleItems.length) % visibleItems.length]?.id || null)
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [selectedIndex, selectedItem, visibleItems])

  if (!publishedItems.length) return null

  const showPrevious = () => setSelectedId(visibleItems[(selectedIndex - 1 + visibleItems.length) % visibleItems.length]?.id || null)
  const showNext = () => setSelectedId(visibleItems[(selectedIndex + 1) % visibleItems.length]?.id || null)

  return (
    <>
      <div className="creative-portfolio">
        <div className="creative-portfolio__tabs" role="tablist" aria-label="Creative portfolio categories">
          <button type="button" className={active === 0 ? 'is-active' : ''} onClick={() => setActive(0)}>
            <span>00</span>{copy.allLabel || 'All'}
          </button>
          {categories.map((category, index) => (
            <button
              type="button"
              className={active === index + 1 ? 'is-active' : ''}
              onClick={() => setActive(index + 1)}
              disabled={categoryCounts[index] === 0}
              key={index + 1}
            >
              <span>{String(index + 1).padStart(2, '0')}</span>{category}
            </button>
          ))}
        </div>

        <motion.div className="creative-portfolio__wall" layout>
          <AnimatePresence mode="popLayout">
            {visibleItems.map((item, index) => (
              <motion.button
                type="button"
                className="creative-portfolio__tile"
                custom={index}
                variants={tileVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                layout
                onClick={() => setSelectedId(item.id)}
                key={`${active}-${item.id}`}
                aria-label={item.alt || `Open creative image ${index + 1}`}
              >
                <img src={item.image} alt={item.alt || ''} loading="lazy" />
                <span aria-hidden="true"><Maximize2 /></span>
              </motion.button>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {selectedItem && createPortal(
        <motion.div
          className="creative-lightbox"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setSelectedId(null)
          }}
        >
          <button className="creative-lightbox__close" type="button" onClick={() => setSelectedId(null)} aria-label="Close image"><X /></button>
          {visibleItems.length > 1 && <button className="creative-lightbox__nav creative-lightbox__nav--prev" type="button" onClick={showPrevious} aria-label="Previous image"><ArrowLeft /></button>}
          <motion.img
            src={selectedItem.image}
            alt={selectedItem.alt || ''}
            initial={{ opacity: 0, scale: .92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: .38, ease: [0.2, 0.8, 0.2, 1] }}
            key={selectedItem.id}
          />
          {visibleItems.length > 1 && <button className="creative-lightbox__nav creative-lightbox__nav--next" type="button" onClick={showNext} aria-label="Next image"><ArrowRight /></button>}
          <span className="creative-lightbox__count">{String(selectedIndex + 1).padStart(2, '0')} / {String(visibleItems.length).padStart(2, '0')}</span>
        </motion.div>,
        document.body
      )}
    </>
  )
}
