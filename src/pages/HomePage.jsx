import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  BarChart3,
  BrainCircuit,
  Eye,
  Megaphone,
  Monitor,
  Palette,
  PhoneCall,
  Search,
  Smartphone,
  Sparkles,
  Target,
  Users
} from 'lucide-react'
import Header from '../components/Header'
import Hero from '../components/Hero'
import Reveal from '../components/Reveal'
import TextReveal from '../components/TextReveal'
import SectionHeading from '../components/SectionHeading'
import Footer from '../components/Footer'
import MilestoneRail from '../components/MilestoneRail'
import RecognitionShowcase from '../components/RecognitionShowcase'
import PartnerLogoMarquee from '../components/PartnerLogoMarquee'
import CaseStudyGallery from '../components/CaseStudyGallery'
import TeamScroll from '../components/TeamScroll'
import AmbientBackground from '../components/AmbientBackground'
import TechGlobe from '../components/TechGlobe'
import SectionMotionBackground from '../components/SectionMotionBackground'
import SiteExperience from '../components/SiteExperience'
import { useContent } from '../hooks/useContent'

const serviceIcons = [Monitor, Search, Megaphone, Palette, Smartphone, BarChart3]

export default function HomePage() {
  const {
    caseStudies,
    settings,
    recognitions,
    partners,
    pageContent,
    milestones,
    services,
    teamMembers,
    processSteps
  } = useContent()
  const aboutFeatures = [
    [Sparkles, pageContent.about.featureOne],
    [Target, pageContent.about.featureTwo],
    [Users, pageContent.about.featureThree],
    [BadgeCheck, pageContent.about.featureFour]
  ]

  return (
    <main className="public-site">
      <AmbientBackground />
      <SiteExperience />
      <Header settings={settings} />
      <Hero settings={settings} />

      <div className="agency-signal" aria-label="DGM capabilities">
        <div>
          {[...services, ...services].map((service, index) => (
            <span key={`${service.id}-${index}`}>{service.title}<i>✦</i></span>
          ))}
        </div>
      </div>

      <section id="about" className="section about-showcase credential-section" data-chapter="01 / About">
        <SectionMotionBackground variant="about" />
        <div className="page-shell about-showcase-layout">
          <Reveal className="about-visual-composition">
            <div className="about-visual-card about-visual-card--primary">
              <div className="about-visual-header">
                <span>DGM / STRATEGY ROOM</span>
                <i />
              </div>
              <div className="about-dashboard">
                <div className="about-dashboard-sidebar">
                  <b>01</b><b>02</b><b>03</b><b>04</b>
                </div>
                <div className="about-dashboard-main">
                  <div className="about-dashboard-title"><span>Campaign intelligence</span><strong>84.2</strong></div>
                  <div className="about-dashboard-chart">
                    {[46, 72, 58, 88, 64, 92, 75, 100].map((height, index) => <i key={index} style={{ height: `${height}%` }} />)}
                  </div>
                  <div className="about-dashboard-metrics"><span>Audience</span><span>Creative</span><span>Media</span></div>
                </div>
              </div>
            </div>

            <div className="about-visual-card about-visual-card--secondary">
              <div className="about-project-label"><span>LIVE PROJECT</span><strong>Integrated launch system</strong></div>
              <div className="about-project-board">
                <div><i /><span>Research</span></div>
                <div><i /><span>Strategy</span></div>
                <div><i /><span>Creative</span></div>
                <div><i /><span>Measure</span></div>
              </div>
              <div className="about-project-footer"><span>One connected team</span><b>48</b></div>
            </div>

            <div className="about-cross-grid" aria-hidden="true">
              {Array.from({ length: 18 }).map((_, index) => <i key={index}>×</i>)}
            </div>
          </Reveal>

          <div className="about-showcase-copy">
            <Reveal>
              <p className="eyebrow about-eyebrow">{pageContent.about.eyebrow}</p>
            </Reveal>
            <TextReveal
              className="about-showcase-title"
              segments={[
                { text: pageContent.about.titleBefore },
                { text: pageContent.about.titleHighlight, highlight: true },
                { text: pageContent.about.titleAfter }
              ]}
            />
            <Reveal delay={0.08}>
              <p className="about-showcase-intro">
                {pageContent.about.intro}
              </p>
            </Reveal>

            <Reveal className="about-feature-panel" delay={0.12}>
              {aboutFeatures.map(([Icon, title]) => (
                <div className="about-feature-item" key={title}>
                  <Icon />
                  <strong>{title}</strong>
                </div>
              ))}
            </Reveal>

            <Reveal className="about-actions" delay={0.16}>
              <a className="about-more-button" href="#services">
                {pageContent.about.primaryCta} <span><ArrowUpRight /></span>
              </a>
              <a className="about-phone" href={`tel:${settings.hotline.replace(/\s/g, '')}`}>
                <span><PhoneCall /></span>
                <div><small>{pageContent.about.helpLabel}</small><strong>{settings.hotline}</strong></div>
              </a>
            </Reveal>
          </div>
        </div>
      </section>

      <section id="recognition" className="section dark-section milestone-section credential-section" data-chapter="02 / Journey">
        <SectionMotionBackground variant="timeline" />
        <div className="page-shell">
          <Reveal><SectionHeading light eyebrow={pageContent.milestones.eyebrow} title={pageContent.milestones.title} intro={pageContent.milestones.intro} /></Reveal>
          <Reveal delay={0.08}><MilestoneRail items={milestones} /></Reveal>
        </div>
      </section>

      <section className="section recognition-section credential-section" data-chapter="03 / Recognition">
        <SectionMotionBackground variant="recognition" />
        <div className="page-shell">
          <Reveal><SectionHeading light eyebrow={pageContent.recognition.eyebrow} title={pageContent.recognition.title} intro={pageContent.recognition.intro} /></Reveal>
          <RecognitionShowcase items={recognitions} />
        </div>
      </section>

      <section id="services" className="section services-showcase credential-section" data-chapter="04 / Capabilities">
        <SectionMotionBackground variant="services" />
        <div className="services-title-band">
          <div className="page-shell services-title-inner">
            <Reveal><p className="eyebrow text-cyan-300">{pageContent.services.eyebrow}</p></Reveal>
            <TextReveal
              className="services-showcase-title"
              segments={[{ text: pageContent.services.titleBefore }, { text: pageContent.services.titleHighlight, highlight: true }]}
            />
            <Reveal delay={0.08}>
              <p>{pageContent.services.intro}</p>
            </Reveal>
          </div>
        </div>

        <div className="page-shell services-card-grid">
          {services.map((service, index) => {
            const Icon = serviceIcons[index % serviceIcons.length]
            return (
              <Reveal className="service-card" key={service.id || service.no} delay={index * 0.055}>
                <div className="service-card-top">
                  <span className="service-icon"><Icon /></span>
                  <small>[{service.no}]</small>
                </div>
                <h3>{service.title}</h3>
                <p>{service.text}</p>
                <div className="service-card-footer">
                  <div>{(service.tags || []).map((tag) => <span key={tag}>{tag}</span>)}</div>
                  <ArrowUpRight />
                </div>
              </Reveal>
            )
          })}
        </div>
      </section>

      <section id="data-hub" className="section data-section data-section--tech credential-section" data-chapter="05 / Intelligence">
        <SectionMotionBackground variant="data" />
        <TechGlobe />
        <div className="page-shell data-layout data-layout--tech">
          <div className="data-copy">
            <Reveal><p className="eyebrow text-cyan-300">{pageContent.data.eyebrow}</p></Reveal>
            <TextReveal
              className="data-tech-title"
              segments={[
                { text: pageContent.data.titleBefore },
                { text: pageContent.data.titleHighlight, highlight: true }
              ]}
            />
            <Reveal delay={0.08}>
              <p>{pageContent.data.intro}</p>
            </Reveal>
            <Reveal delay={0.12}>
              <div className="data-stats">{settings.stats.map((stat) => <div key={stat.label}><strong>{stat.value}</strong><span>{stat.label}</span></div>)}</div>
            </Reveal>
          </div>
          <Reveal className="data-console data-console--glass" delay={0.16}>
            <div className="console-header"><span>{pageContent.data.consoleLabel}</span><i /></div>
            <div className="console-chart">
              {[48, 74, 42, 88, 62, 94, 56, 78, 68, 100, 71, 86].map((height, index) => <i key={index} style={{ height: `${height}%` }} />)}
            </div>
            <div className="console-grid">
              <div><span>Affinity</span><strong>84.2</strong></div>
              <div><span>Intent</span><strong>71.8</strong></div>
              <div><span>Reach quality</span><strong>92%</strong></div>
              <div><span>Segments</span><strong>128</strong></div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section partners-section credential-section" data-chapter="06 / Network">
        <SectionMotionBackground variant="partners" />
        <div className="page-shell partners-heading">
          <Reveal><SectionHeading eyebrow={pageContent.partners.eyebrow} title={pageContent.partners.title} intro={pageContent.partners.intro} /></Reveal>
        </div>
        <PartnerLogoMarquee items={partners} />
      </section>

      <section id="case-studies" className="section cases-section credential-section" data-chapter="07 / Selected work">
        <SectionMotionBackground variant="cases" />
        <div className="page-shell cases-heading-row">
          <div>
            <Reveal><p className="eyebrow text-cyan-300">{pageContent.cases.eyebrow}</p></Reveal>
            <TextReveal
              className="cases-showcase-title"
              segments={[
                { text: pageContent.cases.titleBefore },
                { text: pageContent.cases.titleHighlight, highlight: true }
              ]}
            />
          </div>
          <Reveal delay={0.1}>
            <a className="cases-heading-action" href="#case-studies">
              {pageContent.cases.cta} <span><ArrowRight /></span>
            </a>
          </Reveal>
        </div>
        <div className="page-shell">
          <Reveal delay={0.08}><CaseStudyGallery items={caseStudies} /></Reveal>
        </div>
      </section>

      <section id="team" className="section team-section credential-section" data-chapter="08 / Collective">
        <SectionMotionBackground variant="team" />
        <div className="page-shell team-fullwidth">
          <TeamScroll items={teamMembers} copy={pageContent.team} />
        </div>
      </section>

      <section id="process" className="section process-section credential-section" data-chapter="09 / How we work">
        <SectionMotionBackground variant="process" />
        <div className="page-shell">
          <Reveal><SectionHeading light eyebrow={pageContent.process.eyebrow} title={pageContent.process.title} /></Reveal>
          <div className="process-grid">
            {processSteps.map((step, index) => (
              <Reveal className="process-step" key={step.id || step.no} delay={index * 0.06}><span>{step.no}</span><h3>{step.title}</h3><p>{step.text}</p></Reveal>
            ))}
          </div>
          <div className="process-note"><BrainCircuit /><p>{pageContent.process.note}</p><Eye /></div>
        </div>
      </section>

      <Footer settings={settings} copy={pageContent.contact} />
    </main>
  )
}
