import 'react-native-url-polyfill/auto'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/schema'

// If the variable is not undefined assign the correct value,  
// otherwise an empty string since the createClient function accepts string only

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_API_URL ?? '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_API_KEY ?? '';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})