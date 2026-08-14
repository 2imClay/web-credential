import {
  defaultCaseStudies,
  defaultCreativePortfolio,
  defaultSocialSeedingCases,
  defaultSocialSeedingTheory,
  defaultPageContent,
  defaultPartners,
  defaultPressArticles,
  defaultRecognitions,
  defaultSiteSettings,
  milestones,
  processSteps,
  services,
  teamMembers
} from '../data/siteData'
import { isSupabaseConfigured, supabase } from '../lib/supabase'

const CONTENT_EVENT = 'dgm-content-updated'
const CONTENT_TABLE = 'site_content'
const ASSET_BUCKET = 'site-assets'

const defaults = {
  case_studies: defaultCaseStudies,
  creative_portfolio: defaultCreativePortfolio,
  social_seeding_theory: defaultSocialSeedingTheory,
  social_seeding_cases: defaultSocialSeedingCases,
  site_settings: defaultSiteSettings,
  recognitions: defaultRecognitions,
  press_articles: defaultPressArticles,
  partners: defaultPartners,
  page_content: defaultPageContent,
  milestones,
  services,
  team_members: teamMembers,
  process_steps: processSteps
}

const cache = structuredClone(defaults)

function notify() {
  window.dispatchEvent(new CustomEvent(CONTENT_EVENT))
}

function mergePageContent(saved = {}) {
  return Object.fromEntries(
    Object.entries(defaultPageContent).map(([section, sectionDefaults]) => [
      section,
      { ...sectionDefaults, ...(saved[section] || {}) }
    ])
  )
}

function setCache(key, value) {
  cache[key] = value
  notify()
  return value
}

async function save(key, value) {
  if (!supabase) throw new Error('Supabase chưa được cấu hình.')
  const { error } = await supabase
    .from(CONTENT_TABLE)
    .upsert({ key, value }, { onConflict: 'key' })
  if (error) throw error
  return setCache(key, value)
}

async function uploadImage(file) {
  if (!supabase) throw new Error('Supabase chưa được cấu hình.')
  const extension = file.type === 'image/webp' ? 'webp' : (file.name.split('.').pop() || 'bin').toLowerCase()
  const path = `homepage/${new Date().toISOString().slice(0, 10)}/${crypto.randomUUID()}.${extension}`
  const { error } = await supabase.storage
    .from(ASSET_BUCKET)
    .upload(path, file, { cacheControl: '31536000', contentType: file.type, upsert: false })
  if (error) throw error
  const { data } = supabase.storage.from(ASSET_BUCKET).getPublicUrl(path)
  return data.publicUrl
}

export const contentRepository = {
  isConfigured: isSupabaseConfigured,

  async loadAll() {
    if (!supabase) return cache
    const { data, error } = await supabase.from(CONTENT_TABLE).select('key,value')
    if (error) throw error
    Object.assign(cache, structuredClone(defaults))
    data.forEach((row) => {
      if (Object.hasOwn(defaults, row.key)) cache[row.key] = row.value
    })
    notify()
    return cache
  },

  subscribeToChanges() {
    if (!supabase) return () => {}
    const channel = supabase
      .channel('site-content-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: CONTENT_TABLE }, () => {
        contentRepository.loadAll().catch(() => {})
      })
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  },

  getCaseStudies: () => cache.case_studies,
  saveCaseStudies: (items) => save('case_studies', items),
  getCreativePortfolio: () => cache.creative_portfolio,
  saveCreativePortfolio: (items) => save('creative_portfolio', items),
  getSocialSeedingTheory: () => cache.social_seeding_theory,
  saveSocialSeedingTheory: (items) => save('social_seeding_theory', items),
  getSocialSeedingCases: () => cache.social_seeding_cases,
  saveSocialSeedingCases: (items) => save('social_seeding_cases', items),
  getSiteSettings: () => ({ ...defaultSiteSettings, ...cache.site_settings }),
  saveSiteSettings: (settings) => save('site_settings', settings),
  getRecognitions: () => cache.recognitions,
  saveRecognitions: (items) => save('recognitions', items),
  getPressArticles: () => cache.press_articles,
  savePressArticles: (items) => save('press_articles', items),
  getPartners: () => cache.partners,
  savePartners: (items) => save('partners', items),
  getPageContent: () => mergePageContent(cache.page_content),
  savePageContent: (content) => save('page_content', content),
  getMilestones: () => cache.milestones,
  saveMilestones: (items) => save('milestones', items),
  getServices: () => cache.services,
  saveServices: (items) => save('services', items),
  getTeamMembers: () => cache.team_members,
  saveTeamMembers: (items) => save('team_members', items),
  getProcessSteps: () => cache.process_steps,
  saveProcessSteps: (items) => save('process_steps', items),
  uploadImage,

  async reset() {
    if (!supabase) throw new Error('Supabase chưa được cấu hình.')
    const rows = Object.entries(defaults).map(([key, value]) => ({ key, value }))
    const { error } = await supabase.from(CONTENT_TABLE).upsert(rows, { onConflict: 'key' })
    if (error) throw error
    Object.assign(cache, structuredClone(defaults))
    notify()
  }
}
