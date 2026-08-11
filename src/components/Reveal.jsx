import { motion } from 'framer-motion'

export default function Reveal({ children, className = '', delay = 0, amount = 0.16 }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 30, filter: 'blur(3px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: false, amount, margin: '-4% 0px -4% 0px' }}
      transition={{ duration: 0.85, delay, ease: [0.16, 0.85, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}
