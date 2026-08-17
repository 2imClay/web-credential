import { motion } from 'framer-motion'

export default function Hero({ settings, services = [] }) {
  const customBackground = Boolean(settings.heroBackground)
  const tickerLabels = services.map((service) => service.title?.trim()).filter(Boolean)
  const tickerRepeatCount = tickerLabels.length ? Math.max(1, Math.ceil(12 / tickerLabels.length)) : 0
  const tickerSequence = Array.from({ length: tickerRepeatCount }, () => tickerLabels).flat()
  const heroStyle = customBackground
    ? {
        backgroundImage: `url("${settings.heroBackground}")`,
        backgroundPosition: settings.heroBackgroundPosition || 'center center'
      }
    : undefined

  return (
    <>
      <section
        id="top"
        className={`hero-section hero-section--reference ${customBackground ? 'has-custom-background' : ''}`}
        style={heroStyle}
      >
        {customBackground && (
          <h1 className="visually-hidden">
            {[settings.heroTitle, settings.heroSecondTitle].filter(Boolean).join(' — ') || settings.companyName || 'DGM'}
          </h1>
        )}

        {!customBackground && (
          <div className="hero-reference-ambient" aria-hidden="true">
            <span /><span /><span />
          </div>
        )}

        <div className="page-shell hero-reference-frame">
          {!customBackground && <div className="hero-reference-content">
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
          </div>}
        </div>
      </section>

      {tickerSequence.length > 0 && (
        <div
          className="hero-capability-ticker"
          aria-label="DGM capabilities"
          style={{ '--hero-ticker-duration': `${Math.max(30, tickerSequence.length * 3.2)}s` }}
        >
          <div className="hero-capability-ticker__track">
            {[0, 1].map((groupIndex) => (
              <div
                className="hero-capability-ticker__group"
                aria-hidden={groupIndex === 1 ? 'true' : undefined}
                key={groupIndex}
              >
                {tickerSequence.map((label, index) => (
                  <span className="hero-capability-ticker__item" key={`${groupIndex}-${index}-${label}`}>
                    <strong>{label}</strong><i />
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  )
}
