import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

export default function Preloader() {
  const [visible, setVisible] = useState(() => (
    window.location.pathname === '/'
    && !new URLSearchParams(window.location.search).has('skipPreloader')
    && sessionStorage.getItem('dgm_preloader_seen') !== '1'
  ))

  useEffect(() => {
    if (!visible) return undefined
    sessionStorage.setItem('dgm_preloader_seen', '1')
    const timer = window.setTimeout(() => setVisible(false), 1700)
    return () => window.clearTimeout(timer)
  }, [visible])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="page-preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.65, ease: [0.4, 0, 0.2, 1] } }}
        >
          <div className="page-preloader__bg" />
          <div className="page-preloader__grid" />
          <motion.div
            className="page-preloader__inner"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
          >
            <div className="page-preloader__brand">
              <span>DGM</span>
              <i />
              <small>Marketing Accelerator Partner</small>
            </div>
            <div className="page-preloader__loader">
              <b />
              <b />
              <b />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
