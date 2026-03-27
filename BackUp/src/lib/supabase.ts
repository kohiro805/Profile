import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY || '';

// Safely initialize to prevent build-time crashes when env vars are missing
let supabaseInstance: any;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase env vars are missing. Supabase features will be disabled.');
  // Mock client to prevent errors during build or when unconfigured
  supabaseInstance = {
    from: () => ({
      select: () => ({
        eq: () => ({
          single: () => Promise.resolve({ data: null, error: { message: 'Supabase unconfigured' } })
        }),
        order: () => ({
           limit: () => Promise.resolve({ data: [], error: null })
        })
      }),
      upsert: () => Promise.resolve({ data: null, error: { message: 'Supabase unconfigured' } })
    })
  };
} else {
  supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
}

export const supabase = supabaseInstance;
