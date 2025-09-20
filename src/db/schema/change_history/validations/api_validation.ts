import { z } from "zod";
import { insertChangeHistorySchema } from "./data_validation";

/**
 * API validation schemas untuk change history
 * 
 * Domain: Change Tracking
 * Responsibility: Validasi data untuk API endpoints
 * 
 * @description Schemas untuk:
 * - Validasi request body di API endpoints
 * - Type safety untuk API input/output
 * - Konsistensi validasi antar layer
 */

/**
 * Schema untuk validasi create change history di API
 * Menggunakan insertChangeHistorySchema sebagai base
 * Menghilangkan field yang auto-generated (id, changedAt)
 */
export const createChangeHistorySchema = insertChangeHistorySchema.omit({
  id: true,
  changedAt: true,
});

/**
 * Type untuk input create change history di API
 * Digunakan untuk type safety di request handlers
 */
export type CreateChangeHistoryInput = z.infer<typeof createChangeHistorySchema>;