// rockman-api/src/config/environment.ts
import { z } from 'zod'


/**
 * Schema validasi untuk environment variables
 * Menggunakan Zod untuk type safety dan validasi
 */
export const environmentSchema = z.object({
  // Database Configuration
  DATABASE_URL: z.string().url('DATABASE_URL harus berupa URL yang valid'),
  
  // Users Service Configuration
  USERS_SERVICE_ENABLE_LOGGING: z.string().default('true').transform(val => val === 'true'),
  USERS_SERVICE_ENABLE_VALIDATION: z.string().default('false').transform(val => val === 'true'),
  USERS_SERVICE_ENABLE_CACHING: z.string().default('false').transform(val => val === 'true'),
  
  // Service Configuration (Global)
  SERVICE_ENABLE_LOGGING: z.string().default('true').transform(val => val === 'true'),
  SERVICE_ENABLE_VALIDATION: z.string().default('true').transform(val => val === 'true'),
  SERVICE_ENABLE_CACHING: z.string().default('false').transform(val => val === 'true'),
  
  // Application Environment
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('3000').transform(val => parseInt(val, 10)),
  
  // Security
  JWT_SECRET: z.string().min(32, 'JWT_SECRET harus minimal 32 karakter').optional(),
  SESSION_SECRET: z.string().min(32, 'SESSION_SECRET harus minimal 32 karakter').optional(),
  
  // Cache Configuration (Redis)
  REDIS_URL: z.string().url('REDIS_URL harus berupa URL yang valid').optional(),
  CACHE_TTL: z.string().default('3600').transform(val => parseInt(val, 10)),
  
  // Logging Configuration
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
  LOG_FORMAT: z.enum(['json', 'text']).default('json'),
})

/**
 * Type untuk environment variables yang sudah divalidasi
 */
export type Environment = z.infer<typeof environmentSchema>
