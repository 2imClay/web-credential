import { useEffect, useState } from 'react'
import { ArrowUpRight, FileText, X } from 'lucide-react'
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from 'framer-motion'

function ArticleVisual({ item, large = false }) {
  if (item.image) return <img src={item.image} alt={item.title || item.source || 'Press article'} />

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

function hasArticleCopy(item) {
  return [item.title, item.source, item.year, item.description, item.subtitle]
    .some((value) => String(value || '').trim())
}

export default function PressRoom({ items = [], copy = {} }) {
  const [activeIndex, setActiveIndex] = useState(null)
  const [raisedIndex, setRaisedIndex] = useState(null)
  const [logoPreviewIndex, setLogoPreviewIndex] = useState(null)
  const [touchMode, setTouchMode] = useState(false)
  const reduceMotion = useReducedMotion()
  const activeItem = activeIndex === null ? null : items[activeIndex]
  const logoPreviewItem = logoPreviewIndex === null ? null : items[logoPreviewIndex]
  const sourceItems = items
    .map((item, index) => ({ item, index }))
    .filter(({ item }) => item.logo || item.source?.trim() || item.title?.trim())

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
    <LayoutGroup id="press-room-articles">
    <div
      className={`press-room ${touchMode ? 'is-touch-mode' : ''} ${sourceItems.length ? '' : 'press-room--papers-only'}`}
      onMouseLeave={() => {
        if (!touchMode) {
          setRaisedIndex(null)
          setLogoPreviewIndex(null)
        }
      }}
    >
      <div className="press-room__papers" aria-label="DGM press articles">
        {items.map((item, index) => {
          const imageOnly = Boolean(item.image) && !hasArticleCopy(item)
          const desktopX = [-235, -112, 98, 232, -168, 22, 162, -218, -62, 126][index % 10]
          const desktopY = [92, -12, 28, 98, 154, 112, 162, 184, 202, 218][index % 10]
          const mobileX = [-56, 0, 56, -42, 42, -58, 16, 58, -28, 44][index % 10]
          const mobileY = [48, 0, 24, 62, 88, 108, 130, 148, 166, 182][index % 10]
          const stackCycle = Math.floor(index / 10)
          return (
            <motion.button
              type="button"
              layoutId={`press-card-${item.id || index}`}
              className={`press-paper ${imageOnly ? 'press-paper--image-only' : ''} ${raisedIndex === index ? 'is-raised' : ''}`}
              key={item.id}
              onMouseEnter={() => !touchMode && setRaisedIndex(index)}
              onMouseLeave={() => !touchMode && setRaisedIndex(null)}
              onFocus={() => setRaisedIndex(index)}
              onBlur={() => setRaisedIndex(null)}
              onClick={() => activate(index)}
              initial={reduceMotion ? false : { opacity: 0, y: 35, rotate: 0 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: .25 }}
              transition={{ duration: .55, delay: index * .06 }}
              style={{
                '--paper-r': `${[-7, 3.5, -2.5, 5.5, -4.5, 2, -6, 4][index % 8]}deg`,
                '--paper-stack-x': `${desktopX + stackCycle * 4}px`,
                '--paper-stack-y': `${desktopY + stackCycle * 5}px`,
                '--paper-stack-x-mobile': `${mobileX + stackCycle * 2}px`,
                '--paper-stack-y-mobile': `${mobileY + stackCycle * 4}px`,
                '--paper-z': 2 + index
              }}
            >
              <ArticleVisual item={item} />
              {!imageOnly && <span className="press-paper__caption"><small>{item.year || 'Press'}</small><strong>{item.title}</strong></span>}
            </motion.button>
          )
        })}

        <AnimatePresence>
          {logoPreviewItem && (
            <motion.article
              layoutId={`press-card-${logoPreviewItem.id || logoPreviewIndex}`}
              className={`press-logo-preview ${!hasArticleCopy(logoPreviewItem) && logoPreviewItem.image ? 'press-logo-preview--image-only' : ''}`}
              key={`logo-preview-${logoPreviewItem.id || logoPreviewIndex}`}
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={reduceMotion ? undefined : { opacity: 0 }}
              transition={reduceMotion ? { duration: 0 } : { layout: { type: 'spring', stiffness: 285, damping: 30 }, opacity: { duration: .18 } }}
              aria-hidden="true"
            >
              <div className="press-logo-preview__visual"><ArticleVisual item={logoPreviewItem} large /></div>
              {hasArticleCopy(logoPreviewItem) && (
                <div className="press-logo-preview__copy">
                  {(logoPreviewItem.logo || logoPreviewItem.source || logoPreviewItem.title) && <div className="press-focus-source"><SourceLogo item={logoPreviewItem} /></div>}
                  {logoPreviewItem.year && <span>{logoPreviewItem.year}</span>}
                  {logoPreviewItem.title && <h3>{logoPreviewItem.title}</h3>}
                  {(logoPreviewItem.description || logoPreviewItem.subtitle) && <p>{logoPreviewItem.description || logoPreviewItem.subtitle}</p>}
                </div>
              )}
            </motion.article>
          )}
        </AnimatePresence>
      </div>

      {sourceItems.length > 0 && <div
        className="press-room__sources"
        onMouseLeave={() => {
          if (!touchMode) {
            setRaisedIndex(null)
            setLogoPreviewIndex(null)
          }
        }}
      >
        <p>{copy.pressSourcesLabel || 'Featured by'}</p>
        <div>
          {sourceItems.map(({ item, index }) => (
            <motion.button
              type="button"
              className={activeIndex === index || raisedIndex === index ? 'is-active' : ''}
              key={`source-${item.id}`}
              onMouseEnter={() => {
                if (!touchMode) {
                  setRaisedIndex(index)
                  setLogoPreviewIndex(index)
                }
              }}
              onFocus={() => {
                setRaisedIndex(index)
                setLogoPreviewIndex(index)
              }}
              onBlur={() => {
                setRaisedIndex(null)
                setLogoPreviewIndex(null)
              }}
              onClick={() => {
                setLogoPreviewIndex(null)
                activate(index)
              }}
              animate={reduceMotion ? undefined : { y: [0, -5, 0], rotate: [0, index % 2 ? 1.4 : -1.4, 0] }}
              transition={{ duration: 4 + index * .4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <SourceLogo item={item} />
            </motion.button>
          ))}
        </div>
      </div>}

      <AnimatePresence>
        {activeItem && (
          <motion.div
            className="press-focus-layer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveIndex(null)}
          >
            <motion.article
              className={`press-focus-card ${!hasArticleCopy(activeItem) && activeItem.image ? 'press-focus-card--image-only' : ''}`}
              initial={reduceMotion ? false : { opacity: 0, scale: .86, y: 25, rotate: -2 }}
              animate={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, scale: .9, y: 18 }}
              transition={{ type: 'spring', stiffness: 260, damping: 25 }}
              onClick={(event) => event.stopPropagation()}
            >
              <button className="press-focus-close" type="button" onClick={() => setActiveIndex(null)} aria-label="Close article preview"><X /></button>
              <div className="press-focus-card__visual"><ArticleVisual item={activeItem} large /></div>
              {hasArticleCopy(activeItem) && <div className="press-focus-card__copy">
                {(activeItem.logo || activeItem.source || activeItem.title) && <div className="press-focus-source"><SourceLogo item={activeItem} /></div>}
                {activeItem.year && <span>{activeItem.year}</span>}
                {activeItem.title && <h3>{activeItem.title}</h3>}
                {(activeItem.description || activeItem.subtitle) && <p>{activeItem.description || activeItem.subtitle}</p>}
                {activeItem.url && activeItem.url !== '#' && (
                  <a href={activeItem.url} target="_blank" rel="noreferrer">{copy.pressReadMore || 'Read full article'} <ArrowUpRight /></a>
                )}
              </div>}
            </motion.article>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
    </LayoutGroup>
  )
}
