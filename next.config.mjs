import { defineConfig } from 'next'
import { NextAuthOptions } from 'next-auth'
import { SupabaseAdapter } from '@next-auth/supabase-adapter'

// https://nextjs.org/docs/api-reference/next.config.js/introduction
export default defineConfig({
  reactStrictMode: true,
  webpack: (config) => {
    // Custom webpack configurations can go here
    return config
  },
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  },
  images: {
    domains: ['your-image-domain.com'], // Update with your approved image domains
  }
})