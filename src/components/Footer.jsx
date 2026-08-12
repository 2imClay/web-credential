import { useState } from 'react'
import { ArrowUpRight, Facebook, Linkedin, Mail, MapPin, Phone, Send, Youtube } from 'lucide-react'
import TextReveal from './TextReveal'
import Reveal from './Reveal'
import SectionMotionBackground from './SectionMotionBackground'

export default function Footer({ settings, copy }) {
  const [sent, setSent] = useState(false)

  function submitContact(event) {
    event.preventDefault()
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
            <span>01 / CONTACT FORM</span>
            <p>{copy.formIntro}</p>
          </div>

          <form className="contact-form" onSubmit={submitContact}>
            <label>Họ và tên<input name="name" required placeholder="Nguyễn Văn A" /></label>
            <label>Email<input name="email" required type="email" placeholder="name@company.com" /></label>
            <label>Công ty<input name="company" placeholder="Tên công ty" /></label>
            <label>Số điện thoại<input name="phone" placeholder="090 ..." /></label>
            <label className="full">Nội dung cần tư vấn<textarea name="message" required rows="5" placeholder="Mục tiêu, thời gian và phạm vi dự án..." /></label>
            <button className="contact-submit" type="submit">{copy.submitLabel} <Send /></button>
            {sent && <p className="contact-success">Đã ghi nhận nội dung demo. Khi nối backend, form sẽ gửi email hoặc lưu vào CRM.</p>}
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
            <div className="map-overlay-label"><MapPin /><span>DGM Office</span></div>
          </div>

          <div className="footer-contact-details">
            <a href={`mailto:${settings.contactEmail}`}><Mail /><span>Email<strong>{settings.contactEmail}</strong></span></a>
            <a href={`tel:${settings.hotline.replace(/\s/g, '')}`}><Phone /><span>Hotline<strong>{settings.hotline}</strong></span></a>
            <div><MapPin /><span>Offices<strong>{settings.address}</strong></span></div>
          </div>
        </Reveal>
      </div>

      <div className="page-shell footer-lower footer-lower--soft">
        <div className="footer-brand"><strong>{settings.companyName}</strong><span>{settings.footerTagline}</span></div>
        <a className="footer-email" href={`mailto:${settings.contactEmail}`}>{settings.contactEmail}<ArrowUpRight /></a>
        <div className="social-links"><a href={settings.linkedinUrl}><Linkedin /></a><a href={settings.facebookUrl}><Facebook /></a><a href={settings.youtubeUrl}><Youtube /></a></div>
      </div>

      <div className="page-shell footer-legal"><span>© 2026 {settings.companyName}. All rights reserved.</span><a href="/admin">Admin</a></div>
    </footer>
  )
}
