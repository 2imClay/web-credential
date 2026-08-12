import { useState } from 'react'
import { ArrowUpRight, Facebook, Linkedin, Mail, MapPin, Phone, Send, Youtube } from 'lucide-react'
import TextReveal from './TextReveal'
import Reveal from './Reveal'
import SectionMotionBackground from './SectionMotionBackground'

export default function Footer({ settings, copy }) {
  const [sent, setSent] = useState(false)

  function submitContact(event) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const subject = `${copy.mailSubject}: ${data.get('name') || ''}`
    const body = [
      `${copy.nameLabel}: ${data.get('name') || ''}`,
      `${copy.emailLabel}: ${data.get('email') || ''}`,
      `${copy.companyLabel}: ${data.get('company') || ''}`,
      `${copy.phoneLabel}: ${data.get('phone') || ''}`,
      '',
      String(data.get('message') || '')
    ].join('\n')
    window.location.href = `mailto:${settings.contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    setSent(true)
    event.currentTarget.reset()
  }

  return (
    <footer id="contact" className="site-footer site-footer--contact">
      <SectionMotionBackground variant="footer" />
      <div className="page-shell footer-contact-heading">
        <Reveal><p className="eyebrow text-cyan-300">{copy.eyebrow}</p></Reveal>
        <TextReveal
          className="footer-contact-title"
          segments={[
            { text: copy.titleBefore },
            { text: copy.titleHighlight, highlight: true }
          ]}
        />
      </div>

      <div className="page-shell footer-contact-grid">
        <Reveal className="footer-contact-card">
          <div className="footer-contact-card-head">
            <span>{copy.formLabel}</span>
            <p>{copy.formIntro}</p>
          </div>

          <form className="contact-form" onSubmit={submitContact}>
            <label>{copy.nameLabel}<input name="name" required placeholder={copy.namePlaceholder} /></label>
            <label>{copy.emailLabel}<input name="email" required type="email" placeholder={copy.emailPlaceholder} /></label>
            <label>{copy.companyLabel}<input name="company" placeholder={copy.companyPlaceholder} /></label>
            <label>{copy.phoneLabel}<input name="phone" placeholder={copy.phonePlaceholder} /></label>
            <label className="full">{copy.messageLabel}<textarea name="message" required rows="5" placeholder={copy.messagePlaceholder} /></label>
            <button className="contact-submit" type="submit">{copy.submitLabel} <Send /></button>
            {sent && <p className="contact-success">{copy.successMessage}</p>}
          </form>
        </Reveal>

        <Reveal className="footer-map-card" delay={.08}>
          <div className="footer-map-frame">
            <iframe
              title="DGM office map"
              src={settings.mapEmbedUrl}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <div className="map-overlay-label"><MapPin /><span>{copy.mapLabel}</span></div>
          </div>

          <div className="footer-contact-details">
            <a href={`mailto:${settings.contactEmail}`}><Mail /><span>{copy.emailDetailLabel}<strong>{settings.contactEmail}</strong></span></a>
            <a href={`tel:${settings.hotline.replace(/\s/g, '')}`}><Phone /><span>{copy.hotlineDetailLabel}<strong>{settings.hotline}</strong></span></a>
            <div><MapPin /><span>{copy.officeDetailLabel}<strong>{settings.address}</strong></span></div>
          </div>
        </Reveal>
      </div>

      <div className="page-shell footer-lower footer-lower--soft">
        <div className="footer-brand"><strong>{settings.companyName}</strong><span>{settings.footerTagline}</span></div>
        <a className="footer-email" href={`mailto:${settings.contactEmail}`}>{settings.contactEmail}<ArrowUpRight /></a>
        <div className="social-links"><a href={settings.linkedinUrl}><Linkedin /></a><a href={settings.facebookUrl}><Facebook /></a><a href={settings.youtubeUrl}><Youtube /></a></div>
      </div>

      <div className="page-shell footer-legal"><span>{copy.copyrightText}</span><a href="/admin">{copy.adminLinkLabel}</a></div>
    </footer>
  )
}
