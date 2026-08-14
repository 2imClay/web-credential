import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'

export default function Header({ settings, copy = {}, showPortfolio = false }) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const links = [
    [copy.navAbout || 'About Us', '#about'],
    [copy.navJourney || 'Our Journey', '#milestones'],
    [copy.navRecognition || 'Recognition', '#recognition'],
    [copy.navServices || 'Services', '#services'],
    ...(showPortfolio ? [[copy.navPortfolio || 'Portfolio', '#creative-portfolio']] : []),
    [copy.navCases || 'Case Studies', '#case-studies'],
    [copy.navTeam || 'Our Team', '#team'],
    [copy.navPartners || 'Partners', '#partners'],
    [copy.navContact || 'Contact', '#contact']
  ]

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 70)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`site-header site-header--reference ${scrolled ? 'site-header--scrolled' : ''}`}>
      <a href="#top" className="brand-mark brand-mark--reference" aria-label="DGM Home">
        {settings?.companyLogo
          ? <img src={settings.companyLogo} alt={settings.companyName || 'DGM'} />
          : <span>{settings?.companyName || 'DGM'}</span>}
      </a>

      <nav className={`desktop-nav reference-nav ${open ? 'desktop-nav--open' : ''}`} aria-label="Main navigation">
        {links.map(([label, href]) => (
          <a key={href} href={href} onClick={() => setOpen(false)}>{label}</a>
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
