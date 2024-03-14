import 'react-native-url-polyfill/auto'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://yksbvdkpcrrszwkjmnee.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlrc2J2ZGtwY3Jyc3p3a2ptbmVlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDk5MjE5NzMsImV4cCI6MjAyNTQ5Nzk3M30.Tj5JraIsoB8Fp5GsnExtFedaZHojxJ_ie_Y6G71tqyU"

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})