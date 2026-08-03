const nodes = Array.from({ length: 9 })
const ticks = Array.from({ length: 18 })
const cards = Array.from({ length: 6 })

export default function SectionMotionBackground({ variant = 'default' }) {
  return (
    <div className={`section-motion section-motion--${variant}`} aria-hidden="true">
      <span className="section-motion__wash" />
      <span className="section-motion__grid" />
      <span className="section-motion__orbit section-motion__orbit--one" />
      <span className="section-motion__orbit section-motion__orbit--two" />
      <span className="section-motion__beam section-motion__beam--one" />
      <span className="section-motion__beam section-motion__beam--two" />

      {variant === 'about' && (
        <div className="motion-about-map">
          {nodes.map((_, index) => <i key={index} style={{ '--node-index': index, '--node-delay': `${index * -0.37}s`, '--node-angle': `${index * 45}deg` }} />)}
          <b className="motion-about-map__route" />
        </div>
      )}

      {variant === 'timeline' && (
        <div className="motion-time-field">
          <span className="motion-time-field__tunnel" />
          <span className="motion-time-field__scanner" />
          <div className="motion-time-field__ticks">
            {ticks.map((_, index) => <i key={index} style={{ '--tick-index': index, '--tick-left': `${index * 6 - 3}%`, '--tick-height': `${16 + (index % 4) * 9}px`, '--tick-delay': `${index * -0.13}s` }} />)}
          </div>
        </div>
      )}

      {variant === 'recognition' && (
        <div className="motion-award-field">
          <span className="motion-award-field__laurel motion-award-field__laurel--one" />
          <span className="motion-award-field__laurel motion-award-field__laurel--two" />
          <span className="motion-award-field__spotlight" />
          <b>01</b><b>02</b><b>03</b>
        </div>
      )}

      {variant === 'services' && (
        <div className="motion-service-system">
          {cards.map((_, index) => (
            <span className="motion-service-system__card" key={index} style={{ '--card-index': index, '--card-delay': `${index * -1.35}s` }}>
              <i /><i /><i />
            </span>
          ))}
          <b className="motion-service-system__cursor" />
        </div>
      )}

      {variant === 'partners' && (
        <div className="motion-network-field">
          {nodes.map((_, index) => <i key={index} style={{ '--node-index': index, '--node-delay': `${index * -0.37}s`, '--node-angle': `${index * 45}deg` }} />)}
          <span className="motion-network-field__signal motion-network-field__signal--one" />
          <span className="motion-network-field__signal motion-network-field__signal--two" />
        </div>
      )}

      {variant === 'cases' && (
        <div className="motion-film-field">
          <span className="motion-film-field__strip motion-film-field__strip--one" />
          <span className="motion-film-field__strip motion-film-field__strip--two" />
          <span className="motion-film-field__focus" />
          <b>CASE / 01</b>
        </div>
      )}

      {variant === 'team' && (
        <div className="motion-team-field">
          <span className="motion-team-field__core">DGM</span>
          {nodes.slice(0, 8).map((_, index) => (
            <i key={index} style={{ '--node-index': index, '--node-delay': `${index * -0.37}s`, '--node-angle': `${index * 45}deg` }}><b /></i>
          ))}
        </div>
      )}

      {variant === 'process' && (
        <div className="motion-process-field">
          <span className="motion-process-field__path" />
          {Array.from({ length: 5 }).map((_, index) => <i key={index} style={{ '--step-index': index, '--step-left': `${12 + index * 19}%`, '--step-delay': `${index * -0.43}s` }} />)}
          <b className="motion-process-field__runner" />
        </div>
      )}

      {variant === 'footer' && (
        <div className="motion-contact-field">
          <span className="motion-contact-field__radar" />
          <span className="motion-contact-field__pulse motion-contact-field__pulse--one" />
          <span className="motion-contact-field__pulse motion-contact-field__pulse--two" />
          <i />
        </div>
      )}
    </div>
  )
}
