import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import {
  ArrowUpRight,
  BarChart3,
  Brush,
  CalendarDays,
  Code2,
  Handshake,
  Monitor,
  Search,
  TrendingUp
} from 'lucide-react'

const iconMap = {
  'Media Expert': BarChart3,
  'Creative & Art': Brush,
  'Strategic Planning': Search,
  'Client Partner (Account)': Handshake,
  'BI / CMI / Insight / Research': BarChart3,
  'Client Growth Team': TrendingUp,
  'Tech Dev': Code2,
  Event: CalendarDays
}

const expertiseMap = {
  'Media Expert': ['Media planning', 'Performance'],
  'Creative & Art': ['Creative direction', 'Content'],
  'Strategic Planning': ['Consumer insight', 'IMC planning'],
  'Client Partner (Account)': ['Partnership', 'Delivery'],
  'BI / CMI / Insight / Research': ['Research', 'Measurement'],
  'Client Growth Team': ['Conversion', 'Growth'],
  'Tech Dev': ['MarTech', 'Development'],
  Event: ['Experience', 'Activation']
}

function TeamIcon({ role }) {
  const Icon = iconMap[role] || Monitor
  return <Icon strokeWidth={1.7} />
}

export default function TeamScroll({ items = [], copy, logo, companyName = 'DGM' }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [interacting, setInteracting] = useState(false)
  const reduceMotion = useReducedMotion()
  const activeItem = items[activeIndex] || items[0]

  useEffect(() => {
    if (reduceMotion || interacting || items.length < 2) return undefined
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % items.length)
    }, 2800)
    return () => window.clearInterval(timer)
  }, [interacting, items.length, reduceMotion])

  useEffect(() => {
    if (activeIndex >= items.length) setActiveIndex(0)
  }, [activeIndex, items.length])

  if (!activeItem) return null

  const activeTags = activeItem.tags?.length ? activeItem.tags : expertiseMap[activeItem.role] || ['Strategy', 'Execution']

  return (
    <div
      className="team-compact"
      onMouseEnter={() => setInteracting(true)}
      onMouseLeave={() => setInteracting(false)}
      style={{ '--team-count': items.length }}
    >
      <div className="team-compact__network" aria-label="DGM specialist teams">
        <div className="team-compact__grid" aria-hidden="true" />
        <div className="team-compact__orbit team-compact__orbit--outer" aria-hidden="true" />
        <div className="team-compact__orbit team-compact__orbit--inner" aria-hidden="true" />
        <div className="team-compact__scanner" aria-hidden="true" />

        <motion.div
          className="team-compact__core"
          animate={reduceMotion ? undefined : { boxShadow: ['0 0 0 12px rgba(46,198,232,.07)', '0 0 0 30px rgba(46,198,232,0)', '0 0 0 12px rgba(46,198,232,.07)'] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
        >
          {logo
            ? <img src={logo} alt={`${companyName} logo`} />
            : <strong className="team-compact__core-fallback">{companyName}</strong>}
        </motion.div>

        <div className="team-compact__nodes">
          {items.map((item, index) => (
            <button
              type="button"
              className={activeIndex === index ? 'is-active' : ''}
              style={{ '--node-angle': `${index * (360 / items.length) - 90}deg`, '--node-index': index }}
              onMouseEnter={() => setActiveIndex(index)}
              onFocus={() => setActiveIndex(index)}
              onClick={() => setActiveIndex(index)}
              aria-pressed={activeIndex === index}
              key={item.id || item.role}
            >
              <i><TeamIcon role={item.role} /></i>
              <span>{item.role}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="team-compact__content">
        <div className="team-compact__status">
          <i />
          <small>{String(activeIndex + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}</small>
        </div>

        <AnimatePresence mode="wait">
          <motion.article
            key={activeItem.id || activeItem.role}
            initial={reduceMotion ? false : { opacity: 0, y: 18, filter: 'blur(7px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -12, filter: 'blur(5px)' }}
            transition={{ duration: .38, ease: [0.2, .75, .25, 1] }}
          >
            <div className="team-compact__icon"><TeamIcon role={activeItem.role} /></div>
            <h3>{activeItem.role}</h3>
            <p>{activeItem.detail}</p>
            <div className="team-compact__tags">{activeTags.map((tag) => <span key={tag}>{tag}</span>)}</div>
            <div className="team-compact__count">
              <strong>{activeItem.count}</strong>
              <span>{copy.peopleLabel || 'people'}</span>
              <ArrowUpRight />
            </div>
          </motion.article>
        </AnimatePresence>

        <div className="team-compact__progress" aria-hidden="true">
          {items.map((item, index) => <i className={activeIndex === index ? 'is-active' : ''} key={item.id || item.role} />)}
        </div>
      </div>
    </div>
  )
}
