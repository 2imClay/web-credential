import { ArrowUpRight, Facebook, Linkedin, Mail, MapPin, Phone, Youtube } from 'lucide-react'

export default function Footer({ settings, copy, sectionLabel }) {
  const siteYear = String(settings.siteYear || '').trim() || String(new Date().getFullYear())
  const savedCopyright = String(copy?.copyrightText || '').trim()
  const copyrightText = savedCopyright
    ? (savedCopyright.includes('{year}')
        ? savedCopyright.replaceAll('{year}', siteYear)
        : savedCopyright.replace(/\b(?:19|20)\d{2}\b/, siteYear))
    : `© ${siteYear} ${settings.companyName || 'DGM'}. All rights reserved.`
  const socials = [
    [settings.linkedinUrl, 'LinkedIn', Linkedin],
    [settings.facebookUrl, 'Facebook', Facebook],
    [settings.youtubeUrl, 'YouTube', Youtube]
  ].filter(([url]) => url && url !== '#')

  return (
    <footer id="contact" className="site-footer site-footer--compact">
      <div className="page-shell section-corner-label section-corner-label--dark"><span>{sectionLabel}</span></div>
      <div className="page-shell compact-footer-grid">
        <div className="compact-footer-brand">
          {settings.companyLogo
            ? <img src={settings.companyLogo} alt={settings.companyName} />
            : <strong>{settings.companyName}</strong>}
          <p>{settings.footerTagline}</p>
        </div>

        <div className="compact-footer-contact">
          <a href={`mailto:${settings.contactEmail}`}><Mail /><span>{settings.contactEmail}</span><ArrowUpRight /></a>
          {settings.hotline && <a href={`tel:${settings.hotline.replace(/\s/g, '')}`}><Phone /><span>{settings.hotline}</span></a>}
          <div><MapPin /><span>{settings.address}</span></div>
        </div>

        {socials.length > 0 && (
          <div className="compact-footer-socials">
            {socials.map(([url, label, Icon]) => <a href={url} aria-label={label} key={label}><Icon /></a>)}
          </div>
        )}
      </div>

      <div className="page-shell compact-footer-legal">
        <span>{copyrightText}</span>
      </div>
    </footer>
  )
}
