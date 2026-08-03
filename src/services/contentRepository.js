import {
  defaultCaseStudies,
  defaultPartners,
  defaultRecognitions,
  defaultSiteSettings
} from '../data/siteData'

const CASES_KEY = 'dgm_case_studies_v2'
const SETTINGS_KEY = 'dgm_site_settings_v2'
const RECOGNITIONS_KEY = 'dgm_recognitions_v2'
const PARTNERS_KEY = 'dgm_partners_v2'

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

export const contentRepository = {
  getCaseStudies: () => read(CASES_KEY, defaultCaseStudies),
  saveCaseStudies: (items) => write(CASES_KEY, items),
  getSiteSettings: () => ({ ...defaultSiteSettings, ...read(SETTINGS_KEY, defaultSiteSettings) }),
  saveSiteSettings: (settings) => write(SETTINGS_KEY, settings),
  getRecognitions: () => read(RECOGNITIONS_KEY, defaultRecognitions),
  saveRecognitions: (items) => write(RECOGNITIONS_KEY, items),
  getPartners: () => read(PARTNERS_KEY, defaultPartners),
  savePartners: (items) => write(PARTNERS_KEY, items),
  reset: () => {
    localStorage.removeItem(CASES_KEY)
    localStorage.removeItem(SETTINGS_KEY)
    localStorage.removeItem(RECOGNITIONS_KEY)
    localStorage.removeItem(PARTNERS_KEY)
    window.dispatchEvent(new CustomEvent('dgm-content-updated'))
  }
}
