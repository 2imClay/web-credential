import {
  defaultCaseStudies,
  defaultPageContent,
  defaultPartners,
  defaultRecognitions,
  defaultSiteSettings,
  milestones,
  processSteps,
  services,
  teamMembers
} from '../data/siteData'

const CASES_KEY = 'dgm_case_studies_v2'
const SETTINGS_KEY = 'dgm_site_settings_v2'
const RECOGNITIONS_KEY = 'dgm_recognitions_v2'
const PARTNERS_KEY = 'dgm_partners_v2'
const PAGE_CONTENT_KEY = 'dgm_page_content_v1'
const MILESTONES_KEY = 'dgm_milestones_v1'
const SERVICES_KEY = 'dgm_services_v1'
const TEAM_KEY = 'dgm_team_v1'
const PROCESS_KEY = 'dgm_process_v1'

function read(key, fallback) {
  try {
    const value = localStorage.getItem(key)
    return value ? JSON.parse(value) : fallback
  } catch {
    return fallback
  }
}

function write(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
  window.dispatchEvent(new CustomEvent('dgm-content-updated'))
  return value
}

function mergePageContent(saved = {}) {
  return Object.fromEntries(
    Object.entries(defaultPageContent).map(([section, defaults]) => [
      section,
      { ...defaults, ...(saved[section] || {}) }
    ])
  )
}

export const contentRepository = {
  getCaseStudies: () => read(CASES_KEY, defaultCaseStudies),
  saveCaseStudies: (items) => write(CASES_KEY, items),
  getSiteSettings: () => ({ ...defaultSiteSettings, ...read(SETTINGS_KEY, defaultSiteSettings) }),
  saveSiteSettings: (settings) => write(SETTINGS_KEY, settings),
  getRecognitions: () => read(RECOGNITIONS_KEY, defaultRecognitions),
  saveRecognitions: (items) => write(RECOGNITIONS_KEY, items),
  getPartners: () => read(PARTNERS_KEY, defaultPartners),
  savePartners: (items) => write(PARTNERS_KEY, items),
  getPageContent: () => mergePageContent(read(PAGE_CONTENT_KEY, defaultPageContent)),
  savePageContent: (content) => write(PAGE_CONTENT_KEY, content),
  getMilestones: () => read(MILESTONES_KEY, milestones),
  saveMilestones: (items) => write(MILESTONES_KEY, items),
  getServices: () => read(SERVICES_KEY, services),
  saveServices: (items) => write(SERVICES_KEY, items),
  getTeamMembers: () => read(TEAM_KEY, teamMembers),
  saveTeamMembers: (items) => write(TEAM_KEY, items),
  getProcessSteps: () => read(PROCESS_KEY, processSteps),
  saveProcessSteps: (items) => write(PROCESS_KEY, items),
  reset: () => {
    localStorage.removeItem(CASES_KEY)
    localStorage.removeItem(SETTINGS_KEY)
    localStorage.removeItem(RECOGNITIONS_KEY)
    localStorage.removeItem(PARTNERS_KEY)
    localStorage.removeItem(PAGE_CONTENT_KEY)
    localStorage.removeItem(MILESTONES_KEY)
    localStorage.removeItem(SERVICES_KEY)
    localStorage.removeItem(TEAM_KEY)
    localStorage.removeItem(PROCESS_KEY)
    window.dispatchEvent(new CustomEvent('dgm-content-updated'))
  }
}
