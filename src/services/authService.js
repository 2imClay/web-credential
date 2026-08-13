import { isSupabaseConfigured, supabase } from '../lib/supabase'

export const companyEmailDomain = (import.meta.env.VITE_COMPANY_EMAIL_DOMAIN || 'digimind.asia')
  .trim()
  .toLowerCase()
  .replace(/^@/, '')

export function isCompanyEmail(email = '') {
  const normalizedEmail = email.trim().toLowerCase()
  return normalizedEmail.endsWith(`@${companyEmailDomain}`)
    && normalizedEmail.split('@').length === 2
}

function requireSupabase() {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Supabase chưa được cấu hình. Hãy thêm Project URL và Publishable Key vào file .env.local.')
  }
  return supabase
}

export const authService = {
  isConfigured: isSupabaseConfigured,

  async getCompanySession() {
    if (!supabase) return null
    const { data, error } = await supabase.auth.getSession()
    if (error) throw error
    if (!data.session || !isCompanyEmail(data.session.user.email)) return null
    return data.session
  },

  onAuthStateChange(callback) {
    if (!supabase) return () => {}
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      callback(session && isCompanyEmail(session.user.email) ? session : null)
    })
    return () => data.subscription.unsubscribe()
  },

  async sendMagicLink(email) {
    const normalizedEmail = email.trim().toLowerCase()
    if (!isCompanyEmail(normalizedEmail)) {
      throw new Error(`Chỉ email @${companyEmailDomain} được phép đăng nhập.`)
    }

    const client = requireSupabase()
    const allowSignup = import.meta.env.VITE_SUPABASE_ALLOW_SIGNUP !== 'false'
    const { error } = await client.auth.signInWithOtp({
      email: normalizedEmail,
      options: {
        emailRedirectTo: `${window.location.origin}/admin`,
        shouldCreateUser: allowSignup
      }
    })
    if (error) throw error
  },

  async signOut() {
    if (!supabase) return
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }
}

