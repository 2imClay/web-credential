import { motion } from 'framer-motion'

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06
    }
  }
}

const wordVariants = {
  hidden: { opacity: 0, y: '100%' },
  visible: {
    opacity: 1,
    y: '0%',
    transition: { duration: 0.8, ease: [0.16, 0.85, 0.3, 1] }
  }
}

export default function TextReveal({
  as = 'h2',
  segments = [],
  className = '',
  delay = 0
}) {
  const MotionTag = motion[as] || motion.h2

  return (
    <MotionTag
      className={`text-reveal ${className}`.trim()}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.38, margin: '-6% 0px -6% 0px' }}
      transition={{ delay }}
    >
      {segments.flatMap((segment, segmentIndex) =>
        segment.text.split(/\s+/).filter(Boolean).map((word, wordIndex) => (
          <span className="text-reveal-mask" key={`${segmentIndex}-${wordIndex}-${word}`}>
            <motion.span
              className={segment.highlight ? 'text-reveal-word is-highlighted' : 'text-reveal-word'}
              variants={wordVariants}
            >
              {word}&nbsp;
            </motion.span>
          </span>
        ))
      )}
    </MotionTag>
  )
}

