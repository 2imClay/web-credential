import { useEffect, useState } from 'react'
import { ArrowUpRight, FileText, X } from 'lucide-react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'

function ArticleVisual({ item, large = false }) {
  if (item.image) return <img src={item.image} alt={item.title} />

  return (
    <div className={`press-placeholder ${large ? 'press-placeholder--large' : ''}`}>
      <div><strong>{item.source || 'DGM PRESS'}</strong><span>{item.year || 'NEWS'}</span></div>
      <FileText />
      <h3>{item.title}</h3>
      <p>{item.description || item.subtitle}</p>
      <i /><i /><i /><i />
    </div>
  )
}

function SourceLogo({ item }) {
  if (item.logo) return <img src={item.logo} alt={`${item.source || item.title} logo`} />
  return <span>{item.source || item.title}</span>
}

export default function PressRoom({ items = [], copy = {} }) {
  const [activeIndex, setActiveIndex] = useState(null)
  const [touchMode, setTouchMode] = useState(false)
  const reduceMotion = useReducedMotion()
  const activeItem = activeIndex === null ? null : items[activeIndex]

  useEffect(() => {
    const query = window.matchMedia('(hover: none), (pointer: coarse)')
    const update = () => setTouchMode(query.matches)
    update()
    query.addEventListener?.('change', update)
    return () => query.removeEventListener?.('change', update)
  }, [])

  useEffect(() => {
    if (!activeItem) return undefined
    const close = (event) => event.key === 'Escape' && setActiveIndex(null)
    window.addEventListener('keydown', close)
    return () => window.removeEventListener('keydown', close)
  }, [activeItem])

  if (!items.length) return null

  const activate = (index) => setActiveIndex(index)

  return (
    <div className={`press-room ${touchMode ? 'is-touch-mode' : ''}`} onMouseLeave={() => !touchMode && setActiveIndex(null)}>
      <div className="press-room__papers" aria-label="DGM press articles">
        {items.map((item, index) => (
          <motion.button
            type="button"
            className="press-paper"
            key={item.id}
            onMouseEnter={() => !touchMode && activate(index)}
            onFocus={() => activate(index)}
            onClick={() => activate(index)}
            initial={reduceMotion ? false : { opacity: 0, y: 35, rotate: 0 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: .25 }}
            transition={{ duration: .55, delay: index * .06 }}
            style={{
              '--paper-r': `${[-7, 3.5, -2.5, 5.5, -4.5, 2, -6, 4][index % 8]}deg`,
              '--paper-y': `${[34, 0, 82, 22, 104, 12, 66, 38][index % 8]}px`,
              '--paper-y-mobile': `${[12, 0, 24, 8, 28, 4, 18, 10][index % 8]}px`,
              '--paper-z': 2 + (index % 5)
            }}
          >
            <ArticleVisual item={item} />
            <span className="press-paper__caption"><small>{item.year || 'Press'}</small><strong>{item.title}</strong></span>
          </motion.button>
        ))}
      </div>

      <div className="press-room__sources">
        <p>{copy.pressSourcesLabel || 'Featured by'}</p>
        <div>
          {items.map((item, index) => (
            <motion.button
              type="button"
              className={activeIndex === index ? 'is-active' : ''}
              key={`source-${item.id}`}
              onMouseEnter={() => !touchMode && activate(index)}
              onFocus={() => activate(index)}
              onClick={() => activeIndex === index && touchMode ? setActiveIndex(null) : activate(index)}
              animate={reduceMotion ? undefined : { y: [0, -5, 0], rotate: [0, index % 2 ? 1.4 : -1.4, 0] }}
              transition={{ duration: 4 + index * .4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <SourceLogo item={item} />
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {activeItem && (
          <motion.div
            className="press-focus-layer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => touchMode && setActiveIndex(null)}
          >
            <motion.article
              className="press-focus-card"
              initial={reduceMotion ? false : { opacity: 0, scale: .86, y: 25, rotate: -2 }}
              animate={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, scale: .9, y: 18 }}
              transition={{ type: 'spring', stiffness: 260, damping: 25 }}
              onClick={(event) => event.stopPropagation()}
              onMouseLeave={() => !touchMode && setActiveIndex(null)}
            >
              <button className="press-focus-close" type="button" onClick={() => setActiveIndex(null)} aria-label="Close article preview"><X /></button>
              <div className="press-focus-card__visual"><ArticleVisual item={activeItem} large /></div>
              <div className="press-focus-card__copy">
                <div className="press-focus-source"><SourceLogo item={activeItem} /></div>
                <span>{activeItem.year}</span>
                <h3>{activeItem.title}</h3>
                <p>{activeItem.description || activeItem.subtitle}</p>
                {activeItem.url && activeItem.url !== '#' && (
                  <a href={activeItem.url} target="_blank" rel="noreferrer">{copy.pressReadMore || 'Read full article'} <ArrowUpRight /></a>
                )}
              </div>
            </motion.article>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
