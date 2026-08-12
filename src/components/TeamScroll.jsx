import { motion, useReducedMotion } from 'framer-motion'
import {
  ArrowUpRight,
  BarChart3,
  Brush,
  CalendarDays,
  Code2,
  Handshake,
  Monitor,
  Search,
  Sparkles,
  TrendingUp,
  UsersRound
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

function TeamIcon({ role, className }) {
  const Icon = iconMap[role] || Monitor
  return <Icon className={className} strokeWidth={1.7} />
}

export default function TeamScroll({ items, copy }) {
  const reduceMotion = useReducedMotion()
  const totalMembers = items.reduce((total, item) => total + Number.parseInt(item.count, 10), 0)
  const visibleNodes = items.slice(0, 6)

  const reveal = (index = 0) => reduceMotion ? {} : {
    initial: { opacity: 0, y: 34 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.2 },
    transition: {
      duration: 0.62,
      delay: Math.min(index * 0.055, 0.3),
      ease: [0.2, 0.78, 0.25, 1]
    }
  }

  return (
    <div className="team-studio">
      <div className="team-studio__hero">
        <motion.div className="team-studio__intro" {...reveal()}>
          <div className="team-studio__eyebrow">
            <span><i /> {copy.eyebrow}</span>
            <small>{copy.kicker}</small>
          </div>
          <h2>{copy.titleBefore}<br /><em>{copy.titleHighlight}</em></h2>
          <p>{copy.intro}</p>

          <div className="team-studio__stats">
            <div><strong>{totalMembers}+</strong><span>agency talents</span></div>
            <div><strong>{String(items.length).padStart(2, '0')}</strong><span>specialist teams</span></div>
            <div><strong>01</strong><span>shared ambition</span></div>
          </div>
        </motion.div>

        <motion.div className="team-studio__visual" {...reveal(2)} aria-label="DGM integrated team network">
          <div className="team-studio__visualGrid" aria-hidden="true" />
          <span className="team-studio__orbit team-studio__orbit--outer" aria-hidden="true" />
          <span className="team-studio__orbit team-studio__orbit--inner" aria-hidden="true" />

          <div className="team-studio__nodes" aria-hidden="true">
            {visibleNodes.map((item, index) => {
              const angle = index * (360 / visibleNodes.length)
              return (
                <span
                  key={item.role}
                  className="team-studio__node"
                  style={{
                    '--orbit-angle': `${angle}deg`,
                    '--counter-angle': `${-angle}deg`,
                    '--node-delay': `${index * -0.45}s`
                  }}
                >
                  <i><TeamIcon role={item.role} /></i>
                </span>
              )
            })}
          </div>

          <div className="team-studio__core">
            <span><Sparkles /></span>
            <strong>DGM</strong>
            <small>Integrated<br />growth team</small>
          </div>
          <div className="team-studio__signal" aria-hidden="true" />
        </motion.div>
      </div>

      <div className="team-studio__departmentsHead">
        <motion.div {...reveal()}>
          <span>{copy.collectiveEyebrow}</span>
          <h3>{copy.collectiveTitle}</h3>
        </motion.div>
        <motion.p {...reveal(1)}>
          {copy.collectiveIntro}
        </motion.p>
      </div>

      <div className="team-studio__grid">
        {items.map((item, index) => (
          <motion.article
            key={item.role}
            className="team-studio__card"
            tabIndex="0"
            {...reveal(index)}
          >
            <div className="team-studio__cardTop">
              <span className="team-studio__cardIcon"><TeamIcon role={item.role} /></span>
              <small>{String(index + 1).padStart(2, '0')}</small>
            </div>
            <h4>{item.role}</h4>
            <p>{item.detail}</p>
            <div className="team-studio__cardFooter">
              <div>
                {(expertiseMap[item.role] || ['Strategy', 'Execution']).map((tag) => <span key={tag}>{tag}</span>)}
              </div>
              <strong>{item.count}<small>people</small></strong>
              <ArrowUpRight aria-hidden="true" />
            </div>
          </motion.article>
        ))}
      </div>

      <motion.div className="team-studio__footer" {...reveal()}>
        <div><UsersRound /><span>{copy.footerNote}</span></div>
        <a href="#contact">{copy.cta} <ArrowUpRight /></a>
      </motion.div>
    </div>
  )
}
