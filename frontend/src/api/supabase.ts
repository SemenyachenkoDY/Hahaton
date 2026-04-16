
// --- Пример инициализации Supabase ---
// import { createClient } from '@supabase/supabase-js'

// const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_URL'
// const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY'

// export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const databaseConfig = {
  status: "pending_setup",
  provider: "supabase | vercel_postgres",
  message: "Добавьте ваши ключи в файл .env и раскомментируйте код для прямого доступа к БД."
}
