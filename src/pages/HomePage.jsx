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
import { milestones, processSteps, services, teamMembers } from '../data/siteData'
import { useContent } from '../hooks/useContent'

const aboutFeatures = [
  [Sparkles, 'Creative Excellence'],
  [Target, 'Tailored Solutions'],
  [Users, 'Client Approach'],
  [BadgeCheck, 'Proven Track Record']
]

const serviceIcons = [Monitor, Search, Megaphone, Palette, Smartphone, BarChart3]

export default function HomePage() {
  const { caseStudies, settings, recognitions, partners } = useContent()

  return (
    <main className="public-site">
      <AmbientBackground />
      <Header />
      <Hero settings={settings} />

      <section id="about" className="section about-showcase">
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
              <p className="eyebrow about-eyebrow">About us</p>
            </Reveal>
            <TextReveal
              className="about-showcase-title"
              segments={[
                { text: 'Empowering brands with' },
                { text: 'innovative', highlight: true },
                { text: 'digital solutions' }
              ]}
            />
            <Reveal delay={0.08}>
              <p className="about-showcase-intro">
                DGM kết nối chiến lược, sáng tạo, dữ liệu và công nghệ để tạo ra những giải pháp digital có khả năng nâng tầm thương hiệu, thu hút đúng khách hàng và tạo kết quả đo lường được.
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
                More about DGM <span><ArrowUpRight /></span>
              </a>
              <a className="about-phone" href={`tel:${settings.hotline.replace(/\s/g, '')}`}>
                <span><PhoneCall /></span>
                <div><small>Need help?</small><strong>{settings.hotline}</strong></div>
              </a>
            </Reveal>
          </div>
        </div>
      </section>

      <section id="recognition" className="section dark-section milestone-section">
        <SectionMotionBackground variant="timeline" />
        <div className="page-shell">
          <Reveal><SectionHeading light eyebrow="Our milestones" title="A journey built through trusted partnerships." intro="Toàn bộ nội dung được dựng bằng HTML và có thể kéo ngang để xem theo từng giai đoạn." /></Reveal>
          <Reveal delay={0.08}><MilestoneRail items={milestones} /></Reveal>
        </div>
      </section>

      <section className="section recognition-section">
        <SectionMotionBackground variant="recognition" />
        <div className="page-shell">
          <Reveal><SectionHeading eyebrow="Our recognition" title="Select a milestone. See the full story." intro="Danh sách bên phải có thể cuộn; mỗi mục mở nội dung và hình ảnh lớn ở bên trái." /></Reveal>
          <Reveal delay={0.08}><RecognitionShowcase items={recognitions} /></Reveal>
        </div>
      </section>

      <section id="services" className="section services-showcase">
        <SectionMotionBackground variant="services" />
        <div className="services-title-band">
          <div className="page-shell services-title-inner">
            <Reveal><p className="eyebrow text-cyan-300">What we do</p></Reveal>
            <TextReveal
              className="services-showcase-title"
              segments={[{ text: 'Our' }, { text: 'Services', highlight: true }]}
            />
            <Reveal delay={0.08}>
              <p>Strategy, creative, technology and performance—connected in one practical delivery system.</p>
            </Reveal>
          </div>
        </div>

        <div className="page-shell services-card-grid">
          {services.map((service, index) => {
            const Icon = serviceIcons[index % serviceIcons.length]
            return (
              <Reveal className="service-card" key={service.no} delay={index * 0.055}>
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

      <section id="data-hub" className="section data-section data-section--tech">
        <SectionMotionBackground variant="data" />
        <TechGlobe />
        <div className="page-shell data-layout data-layout--tech">
          <div className="data-copy">
            <Reveal><p className="eyebrow text-cyan-300">D-AI Sense / Data Hub</p></Reveal>
            <TextReveal
              className="data-tech-title"
              segments={[
                { text: 'Intelligence that turns' },
                { text: 'audiences into action', highlight: true }
              ]}
            />
            <Reveal delay={0.08}>
              <p>Hệ sinh thái dữ liệu người dùng và phương tiện hỗ trợ market research, audience profiling, media planning và campaign measurement.</p>
            </Reveal>
            <Reveal delay={0.12}>
              <div className="data-stats">{settings.stats.map((stat) => <div key={stat.label}><strong>{stat.value}</strong><span>{stat.label}</span></div>)}</div>
            </Reveal>
          </div>
          <Reveal className="data-console data-console--glass" delay={0.16}>
            <div className="console-header"><span>LIVE AUDIENCE SIGNALS</span><i /></div>
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

      <section className="section partners-section">
        <SectionMotionBackground variant="partners" />
        <div className="page-shell partners-heading">
          <Reveal><SectionHeading eyebrow="Partners & clients" title="Connected to the platforms. Trusted by ambitious brands." intro="Logo tự chạy ngang và có thể thêm, sửa hoặc thay logo trong trang Admin." /></Reveal>
        </div>
        <PartnerLogoMarquee items={partners} />
      </section>

      <section id="case-studies" className="section cases-section">
        <SectionMotionBackground variant="cases" />
        <div className="page-shell cases-heading-row">
          <div>
            <Reveal><p className="eyebrow text-cyan-300">Selected work</p></Reveal>
            <TextReveal
              className="cases-showcase-title"
              segments={[
                { text: 'Our latest' },
                { text: 'case studies', highlight: true }
              ]}
            />
          </div>
          <Reveal delay={0.1}>
            <a className="cases-heading-action" href="#case-studies">
              Explore the work <span><ArrowRight /></span>
            </a>
          </Reveal>
        </div>
        <div className="page-shell">
          <Reveal delay={0.08}><CaseStudyGallery items={caseStudies} /></Reveal>
        </div>
      </section>

      <section id="team" className="section team-section">
        <SectionMotionBackground variant="team" />
        <div className="page-shell team-layout">
          <div className="team-heading">
            <Reveal><p className="eyebrow text-cyan-300">Our team</p></Reveal>
            <TextReveal
              segments={[
                { text: 'Specialists connected by one' },
                { text: 'growth mindset', highlight: true }
              ]}
            />
            <Reveal delay={0.08}><p>Cuộn trong bảng hoặc dùng thanh điều hướng bo tròn bên phải để khám phá các nhóm năng lực.</p></Reveal>
          </div>
          <Reveal delay={0.1}><TeamScroll items={teamMembers} /></Reveal>
        </div>
      </section>

      <section id="process" className="section process-section">
        <SectionMotionBackground variant="process" />
        <div className="page-shell">
          <Reveal><SectionHeading light eyebrow="Our process" title="Clear thinking. Fast collaboration. Measurable delivery." /></Reveal>
          <div className="process-grid">
            {processSteps.map(([no, title, text], index) => (
              <Reveal className="process-step" key={no} delay={index * 0.06}><span>{no}</span><h3>{title}</h3><p>{text}</p></Reveal>
            ))}
          </div>
          <div className="process-note"><BrainCircuit /><p>Quy trình có thể thay đổi theo quy mô brief, nhưng luôn giữ một đầu mối, mục tiêu rõ và dữ liệu xuyên suốt.</p><Eye /></div>
        </div>
      </section>

      <Footer settings={settings} />
    </main>
  )
}
