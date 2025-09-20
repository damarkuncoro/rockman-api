import { env } from '../../environment'
/**
 * Konfigurasi khusus untuk Users Service
 * Mengambil dari environment variables dengan fallback ke global config
 */
export const usersServiceConfig = {
  enableLogging: env.USERS_SERVICE_ENABLE_LOGGING ?? env.SERVICE_ENABLE_LOGGING,
  enableValidation: env.USERS_SERVICE_ENABLE_VALIDATION ?? env.SERVICE_ENABLE_VALIDATION,
  enableCaching: env.USERS_SERVICE_ENABLE_CACHING ?? env.SERVICE_ENABLE_CACHING,
}