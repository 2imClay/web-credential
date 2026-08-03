import { useEffect, useState } from 'react'
import { contentRepository } from '../services/contentRepository'

export function useContent() {
  const [caseStudies, setCaseStudies] = useState(contentRepository.getCaseStudies())
  const [settings, setSettings] = useState(contentRepository.getSiteSettings())
  const [recognitions, setRecognitions] = useState(contentRepository.getRecognitions())
  const [partners, setPartners] = useState(contentRepository.getPartners())

  useEffect(() => {
    const refresh = () => {
      setCaseStudies(contentRepository.getCaseStudies())
      setSettings(contentRepository.getSiteSettings())
      setRecognitions(contentRepository.getRecognitions())
      setPartners(contentRepository.getPartners())
    }
    window.addEventListener('storage', refresh)
    window.addEventListener('dgm-content-updated', refresh)
    return () => {
      window.removeEventListener('storage', refresh)
      window.removeEventListener('dgm-content-updated', refresh)
    }
  }, [])

  return { caseStudies, settings, recognitions, partners }
}
