import TextReveal from './TextReveal'

export default function SectionHeading({ eyebrow, title, intro, light = false }) {
  return (
    <div className="section-heading">
      <p className={`eyebrow ${light ? 'text-cyan-300' : ''}`}>{eyebrow}</p>
      <TextReveal
        className={light ? 'text-white' : ''}
        segments={[{ text: title }]}
      />
      {intro && <p className={light ? 'text-slate-300' : 'text-slate-600'}>{intro}</p>}
    </div>
  )
}
