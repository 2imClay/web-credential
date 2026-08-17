import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Reveal from '../components/Reveal'
import { CaseVisual } from '../components/CaseStudyCard'
import { useContent } from '../hooks/useContent'

export default function CaseStudyDetailPage() {
  const { slug } = useParams()
  const { caseStudies, settings, pageContent } = useContent()
  const item = caseStudies.find((entry) => entry.slug === slug)

  if (!item) return <div className="not-found"><h1>Case study not found.</h1><Link to="/">Back home</Link></div>

  return (
    <main className="detail-page">
      <Header settings={settings} />
      <section className="detail-hero page-shell">
        <Link className="back-link" to="/"><ArrowLeft size={17} /> Back to selected work</Link>
        <p className="eyebrow">{item.category} / {item.year}</p>
        <h1>{item.title}</h1>
        <p>{item.summary}</p>
      </section>
      <div className="detail-image"><CaseVisual item={item} /></div>
      <section className="section page-shell detail-content">
        {[
          ['01', 'Objective', item.objective],
          ['02', 'Challenge', item.challenge],
          ['03', 'Solution / Key work', item.solution],
          ['04', 'Results / Impact', item.result]
        ].map(([no, title, text], index) => (
          <Reveal className="detail-row" key={title} delay={index * 0.05}><span>{no}</span><h2>{title}</h2><p>{text}</p></Reveal>
        ))}
        <a className="button button-dark" href={`mailto:${settings.contactEmail}`}>Discuss a similar project <ArrowUpRight size={18} /></a>
      </section>
      <Footer settings={settings} copy={pageContent.contact} sectionLabel={pageContent.sectionLabels?.footer} />
    </main>
  )
}
