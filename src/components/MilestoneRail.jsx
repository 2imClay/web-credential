import { motion, useReducedMotion } from 'framer-motion'

export default function MilestoneRail({ items }) {
  const reduceMotion = useReducedMotion()

  const reveal = (index) => reduceMotion ? {} : {
    initial: { opacity: 0, y: 44 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.32 },
    transition: {
      duration: 0.68,
      delay: Math.min(index * 0.055, 0.32),
      ease: [0.2, 0.78, 0.25, 1]
    }
  }

  return (
    <div className="agency-timeline">
      <div className="agency-timeline__list">
        <div className="agency-timeline__rail" aria-hidden="true">
          <motion.i
            initial={reduceMotion ? false : { scaleY: 0 }}
            whileInView={reduceMotion ? undefined : { scaleY: 1 }}
            viewport={{ once: true, amount: 0.08 }}
            transition={{ duration: 1.7, ease: [0.16, 0.75, 0.2, 1] }}
          />
        </div>

        {items.map((item, index) => (
          <motion.article
            className="agency-timeline__item"
            key={`${item.year}-${item.title}`}
            {...reveal(index)}
          >
            <div className="agency-timeline__meta">
              <span>{String(index + 1).padStart(2, '0')}</span>
              <strong>{item.year}</strong>
            </div>

            <div className="agency-timeline__marker" aria-hidden="true">
              <i />
            </div>

            <div className="agency-timeline__card">
              <div className="agency-timeline__cardTop">
                <small>Chapter {String(index + 1).padStart(2, '0')}</small>
                <span>DGM / Growth journey</span>
              </div>
              <h3>{item.title}</h3>
              <div className="agency-timeline__details">
                {item.text.split('\n').map((line) => <p key={line}>{line}</p>)}
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  )
}
