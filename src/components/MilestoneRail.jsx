import { useEffect, useRef, useState } from 'react'
import { motion, useInView, useReducedMotion, useScroll, useTransform } from 'framer-motion'

function MilestoneItem({ item, index, activeIndex, setActiveIndex }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { margin: '-42% 0px -42% 0px' })

  useEffect(() => {
    if (isInView) setActiveIndex(index)
  }, [index, isInView, setActiveIndex])

  const distance = Math.abs(activeIndex - index)

  return (
    <motion.article
      ref={ref}
      className={`journey-stop ${activeIndex === index ? 'is-active' : ''}`}
      animate={{ opacity: activeIndex === index ? 1 : Math.max(.22, .58 - distance * .11), scale: activeIndex === index ? 1 : .96 }}
      transition={{ duration: .42, ease: [0.2, .75, .25, 1] }}
      onMouseEnter={() => setActiveIndex(index)}
    >
      <div className="journey-stop__year"><span>{String(index + 1).padStart(2, '0')}</span><strong>{item.year}</strong></div>
      <div className="journey-stop__card">
        <h3>{item.title}</h3>
        <div>{item.text.split('\n').map((line) => <p key={line}>{line}</p>)}</div>
      </div>
    </motion.article>
  )
}

export default function MilestoneRail({ items = [], copy = {} }) {
  const timelineRef = useRef(null)
  const reduceMotion = useReducedMotion()
  const [activeIndex, setActiveIndex] = useState(0)
  const { scrollYProgress } = useScroll({ target: timelineRef, offset: ['start 70%', 'end 35%'] })
  const badgeTop = useTransform(scrollYProgress, [0, 1], ['2%', '94%'])
  const badgeX = useTransform(scrollYProgress, (value) => Math.sin(value * Math.PI * 7) * 50)

  if (!items.length) return null

  return (
    <div className="journey" ref={timelineRef} style={{ '--journey-count': items.length }}>
      <div className="journey-path" aria-hidden="true">
        <svg viewBox="0 0 180 1000" preserveAspectRatio="none">
          <path d="M90 0 C18 65 18 155 90 210 S162 360 90 430 S18 575 90 640 S162 790 90 855 S18 950 90 1000" />
        </svg>
        <motion.div className="journey-badge" style={reduceMotion ? { top: '50%' } : { top: badgeTop, x: badgeX }}>
          <span>DGM</span><i />
        </motion.div>
      </div>

      <div className="journey-list">
        {items.map((item, index) => (
          <MilestoneItem
            item={item}
            index={index}
            activeIndex={activeIndex}
            setActiveIndex={setActiveIndex}
            key={item.id || `${item.year}-${item.title}`}
          />
        ))}
      </div>
    </div>
  )
}
