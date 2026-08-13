import { useEffect, useState } from 'react'
import { contentRepository } from '../services/contentRepository'

export function useContent() {
  const [caseStudies, setCaseStudies] = useState(contentRepository.getCaseStudies())
  const [settings, setSettings] = useState(contentRepository.getSiteSettings())
  const [recognitions, setRecognitions] = useState(contentRepository.getRecognitions())
  const [pressArticles, setPressArticles] = useState(contentRepository.getPressArticles())
  const [partners, setPartners] = useState(contentRepository.getPartners())
  const [pageContent, setPageContent] = useState(contentRepository.getPageContent())
  const [milestones, setMilestones] = useState(contentRepository.getMilestones())
  const [services, setServices] = useState(contentRepository.getServices())
  const [teamMembers, setTeamMembers] = useState(contentRepository.getTeamMembers())
  const [processSteps, setProcessSteps] = useState(contentRepository.getProcessSteps())

  useEffect(() => {
    const refresh = () => {
      setCaseStudies(contentRepository.getCaseStudies())
      setSettings(contentRepository.getSiteSettings())
      setRecognitions(contentRepository.getRecognitions())
      setPressArticles(contentRepository.getPressArticles())
      setPartners(contentRepository.getPartners())
      setPageContent(contentRepository.getPageContent())
      setMilestones(contentRepository.getMilestones())
      setServices(contentRepository.getServices())
      setTeamMembers(contentRepository.getTeamMembers())
      setProcessSteps(contentRepository.getProcessSteps())
    }
    window.addEventListener('storage', refresh)
    window.addEventListener('dgm-content-updated', refresh)
    return () => {
      window.removeEventListener('storage', refresh)
      window.removeEventListener('dgm-content-updated', refresh)
    }
  }, [])

  return {
    caseStudies,
    settings,
    recognitions,
    pressArticles,
    partners,
    pageContent,
    milestones,
    services,
    teamMembers,
    processSteps
  }
}
