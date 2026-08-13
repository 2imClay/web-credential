import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { BarChart3, Megaphone, Monitor, Palette, Search, Smartphone } from 'lucide-react'

const serviceIcons = [Monitor, Search, Megaphone, Palette, Smartphone, BarChart3]

export default function ServicesShowcase({ items = [] }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const reduceMotion = useReducedMotion()
  const activeItem = items[activeIndex] || items[0]
  const ActiveIcon = serviceIcons[activeIndex % serviceIcons.length]

  useEffect(() => {
    if (activeIndex >= items.length) setActiveIndex(0)
  }, [activeIndex, items.length])

  if (!activeItem) return null

  return (
    <div className="service-console">
      <div className="service-console__nav" role="tablist" aria-label="DGM services">
        {items.map((item, index) => {
          const Icon = serviceIcons[index % serviceIcons.length]
          const active = index === activeIndex
          return (
            <button
              type="button"
              role="tab"
              aria-selected={active}
              className={active ? 'is-active' : ''}
              onMouseEnter={() => setActiveIndex(index)}
              onFocus={() => setActiveIndex(index)}
              onClick={() => setActiveIndex(index)}
              key={item.id || item.no || item.title}
            >
              <small>{item.no || String(index + 1).padStart(2, '0')}</small>
              <span><Icon />{item.title}</span>
              <i />
            </button>
          )
        })}
      </div>

      <div className="service-console__stage">
        <AnimatePresence mode="wait">
          <motion.article
            className="service-console__panel"
            key={activeItem.id || activeIndex}
            initial={reduceMotion ? false : { opacity: 0, y: 18, filter: 'blur(7px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -12, filter: 'blur(5px)' }}
            transition={{ duration: .34, ease: [0.2, .75, .25, 1] }}
          >
            <div className="service-console__panelTop">
              <span><ActiveIcon /></span>
              <small>{activeItem.no || String(activeIndex + 1).padStart(2, '0')}</small>
            </div>
            <div className="service-console__copy">
              <h3>{activeItem.title}</h3>
              {activeItem.text && <p>{activeItem.text}</p>}
            </div>
            <div className="service-console__capabilities">
              {(activeItem.tags || []).map((tag, index) => (
                <span key={tag}><small>{String(index + 1).padStart(2, '0')}</small><strong>{tag}</strong></span>
              ))}
            </div>
          </motion.article>
        </AnimatePresence>
        <div className="service-console__signal" aria-hidden="true"><i /><i /><i /><i /></div>
      </div>
    </div>
  )
}
