
import { z } from "zod";
import { insertAccessLogSchema } from "./data_validation";

/**
 * API validation schemas untuk access logs
 * 
 * Domain: Access Monitoring
 * Responsibility: Validasi data untuk API endpoints
 * 
 * @description Schemas untuk:
 * - Validasi request body di API endpoints
 * - Type safety untuk API input/output
 * - Konsistensi validasi antar layer
 */

/**
 * Schema untuk validasi create access log di API
 * Menggunakan insertAccessLogSchema sebagai base
 */
export const createAccessLogSchema = insertAccessLogSchema;

/**
 * Type untuk input create access log di API
 * Digunakan untuk type safety di request handlers
 */
export type CreateAccessLogInput = z.infer<typeof createAccessLogSchema>;