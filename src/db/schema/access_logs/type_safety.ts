
import { accessLogs } from "./table";

/**
 * TypeScript types untuk type safety access logs
 * 
 * Domain: Access Monitoring
 * Responsibility: Menyediakan type definitions untuk compile-time safety
 * 
 * @description Types untuk:
 * - Inferred types dari Drizzle schema
 * - Type safety untuk operasi database
 * - Konsistensi type antar layer aplikasi
 */

/**
 * Type untuk data access log yang diambil dari database
 * Includes semua field termasuk yang auto-generated
 */
export type AccessLog = typeof accessLogs.$inferSelect;

/**
 * Type untuk data access log yang akan diinsert ke database
 * Excludes auto-generated fields seperti id dan createdAt
 */
export type NewAccessLog = typeof accessLogs.$inferInsert;
