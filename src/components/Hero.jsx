import { ArrowUpRight, Download } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Hero({ settings }) {
  const customBackground = Boolean(settings.heroBackground)
  const heroStyle = customBackground
    ? {
        backgroundImage: `linear-gradient(90deg, rgba(4, 7, 10, .48), rgba(4, 7, 10, .12) 48%, rgba(4, 7, 10, .46)), url("${settings.heroBackground}")`,
        backgroundPosition: settings.heroBackgroundPosition || 'center center'
      }
    : undefined

  return (
    <section
      id="top"
      className={`hero-section hero-section--reference ${customBackground ? 'has-custom-background' : ''}`}
      style={heroStyle}
    >
      <div className="hero-reference-ambient" aria-hidden="true">
        <span /><span /><span />
      </div>

      <div className="page-shell hero-reference-frame">
        <div className="hero-reference-content">
          <motion.div
            className="hero-reference-copy hero-reference-copy--left"
            initial={{ opacity: 0, y: 34 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: .8, ease: [0.2, 0.75, 0.25, 1] }}
          >
            <p>{settings.eyebrow}</p>
            <h1>{settings.heroTitle}</h1>
          </motion.div>

          {!customBackground && (
            <motion.div
              className="award-object award-object--reference"
              initial={{ opacity: 0, scale: .92, y: 22 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1.05, delay: .08, ease: [0.2, 0.75, 0.25, 1] }}
              aria-label="Abstract DGM award sculpture"
            >
              <div className="award-top"><i /><i /><i /></div>
              <div className="award-column"><span>MMA</span></div>
              <div className="award-podium"><i /><i /><i /></div>
            </motion.div>
          )}

          <motion.div
            className="hero-reference-copy hero-reference-copy--right"
            initial={{ opacity: 0, y: 34 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: .8, delay: .15, ease: [0.2, 0.75, 0.25, 1] }}
          >
            <h2>{settings.heroSecondTitle}</h2>
            <p>{settings.heroDescription}</p>
          </motion.div>
        </div>

        <motion.div
          className="hero-reference-actions"
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: .7, delay: .3 }}
        >
          <a className="hero-reference-button" href="#contact">Book a Meeting <ArrowUpRight /></a>
          <a
            className="hero-reference-button"
            href={settings.heroPdfUrl || '#case-studies'}
            target={settings.heroPdfUrl && settings.heroPdfUrl !== '#' ? '_blank' : undefined}
            rel="noreferrer"
          >
            Download PDF <Download />
          </a>
        </motion.div>
      </div>
    </section>
  )
}
