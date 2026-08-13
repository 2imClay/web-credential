import { useEffect, useRef, useState } from 'react'
import { motion, useInView, useMotionValue, useReducedMotion, useScroll } from 'framer-motion'

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
      <div className="journey-stop__year"><strong>{item.year}</strong></div>
      <div className="journey-stop__card">
        <h3>{item.title}</h3>
        <div>{item.text.split('\n').map((line) => <p key={line}>{line}</p>)}</div>
      </div>
    </motion.article>
  )
}

export default function MilestoneRail({ items = [], copy = {} }) {
  const timelineRef = useRef(null)
  const pathRef = useRef(null)
  const reduceMotion = useReducedMotion()
  const [activeIndex, setActiveIndex] = useState(0)
  const { scrollYProgress } = useScroll({ target: timelineRef, offset: ['start 70%', 'end 35%'] })
  const badgeLeft = useMotionValue('50%')
  const badgeTop = useMotionValue('0%')

  useEffect(() => {
    const updateBadgePosition = (scrollProgress) => {
      const path = pathRef.current
      if (!path) return

      const progress = reduceMotion ? .5 : Math.min(1, Math.max(0, scrollProgress))
      const point = path.getPointAtLength(path.getTotalLength() * progress)

      // The badge and SVG share the same 180 x 1000 coordinate system.
      // Percentages keep that exact point aligned when the path is stretched responsively.
      badgeLeft.set(`${(point.x / 180) * 100}%`)
      badgeTop.set(`${(point.y / 1000) * 100}%`)
    }

    updateBadgePosition(scrollYProgress.get())
    if (reduceMotion) return undefined
    return scrollYProgress.on('change', updateBadgePosition)
  }, [badgeLeft, badgeTop, reduceMotion, scrollYProgress])

  if (!items.length) return null

  return (
    <div className="journey" ref={timelineRef} style={{ '--journey-count': items.length }}>
      <div className="journey-path" aria-hidden="true">
        <svg viewBox="0 0 180 1000" preserveAspectRatio="none">
          <path ref={pathRef} d="M90 0 C18 65 18 155 90 210 S162 360 90 430 S18 575 90 640 S162 790 90 855 S18 950 90 1000" />
        </svg>
        <motion.div className="journey-badge" style={{ left: badgeLeft, top: badgeTop }}>
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
