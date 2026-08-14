import { Award } from 'lucide-react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

function RecognitionCardVisual({ item }) {
  if (item.image) {
    return <img src={item.image} alt={item.title || 'DGM press coverage'} className="recognition-paper__image" />
  }

  return (
    <div className="recognition-paper__placeholder" aria-label={item.title}>
      <div className="recognition-paper__placeholderCore">
        <Award />
      </div>
      <div className="recognition-paper__placeholderLines"><i /><i /><i /></div>
    </div>
  )
}

function MobileRecognitionCard({ item, index, count, progress }) {
  const cardAngles = [-3.2, 2.4, -1.8, 3]
  const entryStart = index === 0 ? 0 : Math.max(0, index / count - .08)
  const entryEnd = index === 0 ? .01 : Math.min(1, index / count + .06)
  const nextStart = index === count - 1 ? .99 : Math.max(entryEnd, (index + 1) / count - .08)
  const nextEnd = index === count - 1 ? 1 : Math.min(1, (index + 1) / count + .06)
  const y = useTransform(progress, [entryStart, entryEnd], index === 0 ? ['0%', '0%'] : ['175%', '0%'])
  const scale = useTransform(progress, [nextStart, nextEnd], index === count - 1 ? [1, 1] : [1, .965])

  return (
    <motion.figure
      className="recognition-paper recognition-paper--mobile"
      style={{ y, scale, rotate: cardAngles[index % cardAngles.length], zIndex: 10 + index }}
    >
      <div className="recognition-paper__media">
        <RecognitionCardVisual item={item} />
      </div>
      <figcaption>
        {item.title && <h3>{item.title}</h3>}
        {(item.description || item.subtitle) && <p>{item.description || item.subtitle}</p>}
      </figcaption>
    </motion.figure>
  )
}

export default function RecognitionShowcase({ items }) {
  const mobileStackRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: mobileStackRef,
    offset: ['start start', 'end end']
  })

  if (!items?.length) return null

  return (
    <div className="recognition-paper-wall">
      <div className="recognition-paper-wall__grid recognition-paper-wall__grid--desktop">
        {items.map((item, index) => (
          <figure
            className="recognition-paper"
            key={item.id}
            style={{
              '--paper-index': index,
              '--paper-offset': `${index * 7}px`,
              '--paper-z': 10 + index
            }}
          >
            <div className="recognition-paper__media">
              <RecognitionCardVisual item={item} />
            </div>
            <figcaption>
              {item.title && <h3>{item.title}</h3>}
              {(item.description || item.subtitle) && <p>{item.description || item.subtitle}</p>}
            </figcaption>
          </figure>
        ))}
      </div>

      <div
        className="recognition-mobile-stack"
        ref={mobileStackRef}
        style={{ '--recognition-count': items.length }}
      >
        <div className="recognition-mobile-stack__stage">
          {items.map((item, index) => (
            <MobileRecognitionCard
              item={item}
              index={index}
              count={items.length}
              progress={scrollYProgress}
              key={`mobile-${item.id}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
