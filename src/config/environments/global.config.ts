import { env } from '../environment'
/**
 * Konfigurasi global untuk semua services
 */
export const globalServiceConfig = {
  enableLogging: env.SERVICE_ENABLE_LOGGING,
  enableValidation: env.SERVICE_ENABLE_VALIDATION,
  enableCaching: env.SERVICE_ENABLE_CACHING,
}
