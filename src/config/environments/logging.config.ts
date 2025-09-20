import { env } from '../environment'
/**
 * Konfigurasi logging
 */
export const loggingConfig = {
  level: env.LOG_LEVEL,
  format: env.LOG_FORMAT,
}
