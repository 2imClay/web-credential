import { motion, useScroll, useSpring } from 'framer-motion'

export default function SiteExperience() {
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, {
    stiffness: 115,
    damping: 28,
    mass: 0.22
  })

  return (
    <div className="site-progress" aria-hidden="true">
      <motion.i style={{ scaleX: progress }} />
    </div>
  )
}
