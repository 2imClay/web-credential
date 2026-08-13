import { BarChart3, Megaphone, Monitor, Palette, Search, Smartphone } from 'lucide-react'
import Header from '../components/Header'
import Hero from '../components/Hero'
import Reveal from '../components/Reveal'
import Footer from '../components/Footer'
import MilestoneRail from '../components/MilestoneRail'
import PressRoom from '../components/PressRoom'
import RecognitionShowcase from '../components/RecognitionShowcase'
import CaseStudyGallery from '../components/CaseStudyGallery'
import TeamScroll from '../components/TeamScroll'
import PartnerLogoMarquee from '../components/PartnerLogoMarquee'
import SiteExperience from '../components/SiteExperience'
import { useContent } from '../hooks/useContent'

const serviceIcons = [Monitor, Search, Megaphone, Palette, Smartphone, BarChart3]

export default function HomePage() {
  const {
    settings,
    pressArticles,
    recognitions,
    milestones,
    services,
    caseStudies,
    teamMembers,
    partners,
    pageContent
  } = useContent()

  return (
    <main className="public-site public-site--editorial">
      <SiteExperience />
      <Header settings={settings} copy={pageContent.ui} />
      <Hero settings={settings} />

      <div className="editorial-home-flow">
        <section id="about" className="section newsroom-section">
          <div className="page-shell section-corner-label"><span>{pageContent.sectionLabels.about}</span></div>
          <div className="page-shell newsroom-heading">
            <Reveal>
              <h2>{pageContent.about.title}</h2>
              <p>{pageContent.about.intro}</p>
            </Reveal>
          </div>
          <div className="page-shell"><PressRoom items={pressArticles} copy={pageContent.ui} /></div>
        </section>

        <section id="milestones" className="section milestone-section milestone-section--compact content-only-section">
          <div className="page-shell section-corner-label"><span>{pageContent.sectionLabels.milestones}</span></div>
          <div className="page-shell"><MilestoneRail items={milestones} copy={pageContent.ui} /></div>
        </section>

        <section id="recognition" className="section recognition-section recognition-section--content-only content-only-section">
          <div className="page-shell section-corner-label"><span>{pageContent.sectionLabels.recognition}</span></div>
          <div className="page-shell"><RecognitionShowcase items={recognitions} /></div>
        </section>

        <section id="services" className="section services-showcase services-showcase--content-only content-only-section">
          <div className="page-shell section-corner-label"><span>{pageContent.sectionLabels.services}</span></div>
          <div className="page-shell service-constellation-grid">
            {services.map((service, index) => {
              const Icon = serviceIcons[index % serviceIcons.length]
              return (
                <article className="service-module-card" key={service.id || service.no}>
                  <div className="service-module-card__top"><span><Icon /></span><small>{service.no}</small></div>
                  <h3>{service.title}</h3>
                  {service.text && <p>{service.text}</p>}
                  <div className="service-module-card__list">{(service.tags || []).map((tag) => <span key={tag}><i />{tag}</span>)}</div>
                </article>
              )
            })}
          </div>
        </section>

        <section id="case-studies" className="section cases-section cases-section--content-only content-only-section">
          <div className="page-shell section-corner-label"><span>{pageContent.sectionLabels.cases}</span></div>
          <div className="page-shell"><Reveal><CaseStudyGallery items={caseStudies} copy={pageContent.ui} /></Reveal></div>
        </section>

        <section id="team" className="section team-section team-section--content-only content-only-section">
          <div className="page-shell section-corner-label"><span>{pageContent.sectionLabels.team}</span></div>
          <div className="page-shell team-fullwidth"><TeamScroll items={teamMembers} copy={pageContent.team} /></div>
        </section>

        <section id="partners" className="section partners-section partners-section--content-only content-only-section">
          <div className="page-shell section-corner-label"><span>{pageContent.sectionLabels.partners}</span></div>
          <PartnerLogoMarquee items={partners} />
        </section>
      </div>

      <Footer settings={settings} copy={pageContent.contact} sectionLabel={pageContent.sectionLabels.footer} />
    </main>
  )
}
