import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { contentRepository } from '../services/contentRepository'

const currentYear = String(new Date().getFullYear())

function readSiteYear() {
  return String(contentRepository.getSiteSettings().siteYear || '').trim() || currentYear
}

export default function Preloader() {
  const reduceMotion = useReducedMotion()
  const [siteYear, setSiteYear] = useState(readSiteYear)
  const [visible, setVisible] = useState(() => (
    !window.location.pathname.startsWith('/admin')
    && !new URLSearchParams(window.location.search).has('skipPreloader')
  ))

  useEffect(() => {
    const refreshYear = () => setSiteYear(readSiteYear())
    window.addEventListener('dgm-content-updated', refreshYear)
    return () => window.removeEventListener('dgm-content-updated', refreshYear)
  }, [])

  useEffect(() => {
    if (!visible) return undefined
    const previousBodyOverflow = document.body.style.overflow
    const previousRootOverflow = document.documentElement.style.overflow
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'
    const timer = window.setTimeout(() => setVisible(false), reduceMotion ? 650 : 1900)
    return () => {
      window.clearTimeout(timer)
      document.body.style.overflow = previousBodyOverflow
      document.documentElement.style.overflow = previousRootOverflow
    }
  }, [reduceMotion, visible])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="page-preloader"
          initial={{ opacity: 1 }}
          exit={reduceMotion
            ? { opacity: 0, transition: { duration: .2 } }
            : { clipPath: 'inset(0 0 100% 0)', transition: { duration: .72, ease: [0.76, 0, 0.24, 1] } }}
        >
          <div className="page-preloader__grid" aria-hidden="true" />
          <div className="page-preloader__scan" aria-hidden="true" />
          <motion.div
            className="page-preloader__inner"
            initial={reduceMotion ? false : { opacity: 0, scale: .9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: .65, ease: [0.2, .8, .2, 1] }}
          >
            <div className="page-preloader__signal" aria-hidden="true">
              <i /><i /><i />
              <span /><span /><span /><span />
            </div>
            <div className="page-preloader__brand">
              <span>DGM</span>
              <small>Digimind</small>
            </div>
            <div className="page-preloader__meta"><span>IMC CREDENTIAL</span><b>{siteYear}</b></div>
            <div className="page-preloader__loader"><i /></div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
