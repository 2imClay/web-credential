import { useEffect, useState } from 'react'
import { ChevronDown, Menu, X } from 'lucide-react'

export default function Header({ settings, copy = {}, showPortfolio = false, showSeeding = false }) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const navItems = [
    {
      label: copy.navAbout || 'About',
      href: '#about',
      children: [
        [copy.navJourney || 'Our Journey', '#milestones'],
        [copy.navRecognition || 'Recognition', '#recognition']
      ]
    },
    { label: copy.navServices || 'Services', href: '#services' },
    ...(showPortfolio ? [{
      label: copy.navWork || 'Work',
      href: '#creative-portfolio',
      children: [
        [copy.navPortfolio || 'Creative Portfolio', '#creative-portfolio'],
        [copy.navCases || 'Case Studies', '#case-studies']
      ]
    }] : [{ label: copy.navCases || 'Case Studies', href: '#case-studies' }]),
    ...(showSeeding ? [{ label: copy.navSeeding || 'Social Seeding', href: '#social-seeding' }] : []),
    {
      label: copy.navAgency || 'Agency',
      href: '#team',
      children: [
        [copy.navTeam || 'Our Team', '#team'],
        [copy.navPartners || 'Partners', '#partners']
      ]
    },
    { label: copy.navContact || 'Contact', href: '#contact', contact: true }
  ]

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 70)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`site-header site-header--reference ${scrolled ? 'site-header--scrolled' : ''}`}>
        <a
          href="https://digimind.asia"
          className="brand-mark brand-mark--reference"
          aria-label="Visit DGM company website"
          target="_blank"
          rel="noreferrer"
        >
        {settings?.companyLogo
          ? <img src={settings.companyLogo} alt={settings.companyName || 'DGM'} />
          : <span>{settings?.companyName || 'DGM'}</span>}
      </a>

      <nav className={`desktop-nav reference-nav ${open ? 'desktop-nav--open' : ''}`} aria-label="Main navigation">
        {navItems.map((item) => item.children ? (
          <div className="header-nav__group" key={item.href}>
            <a
              className="header-nav__main"
              href={item.href}
              onClick={() => setOpen(false)}
              aria-haspopup="true"
            >
              {item.label}<ChevronDown aria-hidden="true" />
            </a>
            <div className="header-nav__submenu">
              {item.children.map(([label, href]) => (
                <a href={href} onClick={() => setOpen(false)} key={href}>{label}</a>
              ))}
            </div>
          </div>
        ) : (
          <a
            className={`header-nav__link ${item.contact ? 'header-nav__link--contact' : ''}`}
            key={item.href}
            href={item.href}
            onClick={() => setOpen(false)}
          >
            {item.label}
          </a>
        ))}
      </nav>

      <button
        className="menu-button"
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label={open ? 'Đóng menu' : 'Mở menu'}
        aria-expanded={open}
      >
        {open ? <X /> : <Menu />}
      </button>
    </header>
  )
}
