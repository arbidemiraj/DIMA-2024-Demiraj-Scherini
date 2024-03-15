import 'react-native-url-polyfill/auto'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/schema'


const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_API_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_API_KEY;

// The exclamation mark (!) is a TypeScript feature -> non-null assertion operator. 
// Compiler trusts that the value of the expression it's not null or undefined.
export const supabase = createClient<Database>(supabaseUrl!, supabaseAnonKey!, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})