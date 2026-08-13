import { isSupabaseConfigured, supabase } from '../lib/supabase'

function requireSupabase() {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Supabase chưa được cấu hình. Hãy thêm Project URL và Publishable Key vào file .env.local.')
  }
  return supabase
}

export const authService = {
  isConfigured: isSupabaseConfigured,

  async getSession() {
    if (!supabase) return null
    const { data, error } = await supabase.auth.getSession()
    if (error) throw error
    return data.session
  },

  onAuthStateChange(callback) {
    if (!supabase) return () => {}
    const { data } = supabase.auth.onAuthStateChange((_event, session) => callback(session))
    return () => data.subscription.unsubscribe()
  },

  async signIn(email, password) {
    const client = requireSupabase()
    const normalizedEmail = email.trim().toLowerCase()
    if (!normalizedEmail || !password) throw new Error('Vui lòng nhập đầy đủ email và mật khẩu.')

    const { data, error } = await client.auth.signInWithPassword({
      email: normalizedEmail,
      password
    })
    if (error) {
      const message = error.message === 'Invalid login credentials'
        ? 'Email hoặc mật khẩu không đúng.'
        : error.message
      throw new Error(message)
    }
    return data.session
  },

  async signOut() {
    if (!supabase) return
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }
}

