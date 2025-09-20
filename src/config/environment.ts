import { environmentSchema } from './validations/environment_validation'
import { Environment } from './validations/environment_validation'

/**
 * Fungsi untuk memvalidasi dan memuat environment variables
 * @returns Environment variables yang sudah divalidasi
 * @throws Error jika validasi gagal
 */
function loadEnvironment(): Environment {
  try {
    return environmentSchema.parse(process.env)
  } catch (err: any) {
    console.error('Environment validation failed:', err.issues || err.message)
    process.exit(1)
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