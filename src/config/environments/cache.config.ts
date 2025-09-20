import { env } from '../environment'
/**
 * Konfigurasi cache (Redis)
 */
export const cacheConfig = {
  url: env.REDIS_URL,
  ttl: env.CACHE_TTL,
}