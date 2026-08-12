import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'

const links = [
  ['About Us', '#about'],
  ['Recognition', '#recognition'],
  ['Services', '#services'],
  ['Case Studies', '#case-studies'],
  ['Specialized Solutions', '#data-hub'],
  ['Our Team', '#team'],
  ['Contact', '#contact']
]

export default function Header({ settings }) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

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
