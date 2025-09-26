import 'dotenv/config'
import { environmentSchema } from './validations/environment_validation'
import { Environment } from './validations/environment_validation'

/**
 * Fungsi untuk memvalidasi dan memuat environment variables
 * @returns Environment variables yang sudah divalidasi
 * @throws Error jika validasi gagal
 */
function loadEnvironment(): Environment {
  try {
    // Di client-side, hanya validasi variabel yang diperlukan untuk client
    const isClientSide = typeof window !== 'undefined'
    
    if (isClientSide) {
      // Untuk client-side, gunakan subset environment variables yang aman
      const clientEnv = {
        NODE_ENV: process.env.NODE_ENV || 'development',
        PORT: process.env.PORT || '3000',
        
        // Service Configuration (Global) - gunakan default values
        SERVICE_ENABLE_LOGGING: process.env.SERVICE_ENABLE_LOGGING || 'true',
        SERVICE_ENABLE_VALIDATION: process.env.SERVICE_ENABLE_VALIDATION || 'true', 
        SERVICE_ENABLE_CACHING: process.env.SERVICE_ENABLE_CACHING || 'false',
        
        // Users Service Configuration - gunakan default values
        USERS_SERVICE_ENABLE_LOGGING: process.env.USERS_SERVICE_ENABLE_LOGGING || 'true',
        USERS_SERVICE_ENABLE_VALIDATION: process.env.USERS_SERVICE_ENABLE_VALIDATION || 'false',
        USERS_SERVICE_ENABLE_CACHING: process.env.USERS_SERVICE_ENABLE_CACHING || 'false',
        
        // Cache Configuration
        CACHE_TTL: process.env.CACHE_TTL || '3600',
        
        // Logging Configuration
        LOG_LEVEL: process.env.LOG_LEVEL || 'info',
        LOG_FORMAT: process.env.LOG_FORMAT || 'json',
        
        // Database URL - tidak diperlukan di client-side, gunakan placeholder
        DATABASE_URL: 'postgresql://placeholder:placeholder@localhost:5432/placeholder',
      }
      
      return environmentSchema.parse(clientEnv)
    }
    
    // Di server-side, validasi semua environment variables
    return environmentSchema.parse(process.env)
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error'
    const issues = (err as { issues?: unknown }).issues
    console.error('Environment validation failed:', issues || errorMessage)
    
    // Hanya gunakan process.exit di server-side environment
    if (typeof window === 'undefined' && typeof process !== 'undefined' && process.exit) {
      process.exit(1)
    } else {
      // Di client-side, throw error untuk ditangani oleh error boundary
      throw new Error(`Environment validation failed: ${errorMessage}`)
    }
  }
}

/**
 * Environment variables yang sudah divalidasi dan siap digunakan
 */
export const env = loadEnvironment()


/**
 * Utility function untuk mengecek apakah environment adalah development
 */
export const isDevelopment = () => env.NODE_ENV === 'development'

/**
 * Utility function untuk mengecek apakah environment adalah production
 */
export const isProduction = () => env.NODE_ENV === 'production'

/**
 * Utility function untuk mengecek apakah environment adalah test
 */
export const isTest = () => env.NODE_ENV === 'test'