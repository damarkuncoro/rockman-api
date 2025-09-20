
import { z } from "zod";
import { 
  idSchema, 
  pathSchema, 
  httpMethodSchema, 
  decisionSchema 
} from "../../common/schemas";

/**
 * Zod schemas untuk validasi data access logs
 * 
 * Domain: Access Monitoring
 * Responsibility: Validasi data input dan output untuk access logs
 * 
 * @description Schemas untuk:
 * - Validasi data saat insert ke database
 * - Validasi data saat select dari database
 * - Type safety untuk operasi CRUD
 * - Menggunakan shared schemas untuk konsistensi (DRY principle)
 */

/**
 * Schema untuk validasi data insert access log
 * Digunakan saat membuat record baru
 * Menggunakan shared schemas dari validation.ts untuk konsistensi
 */
export const insertAccessLogSchema = z.object({
  userId: idSchema.optional(),
  roleId: idSchema.optional(),
  featureId: idSchema.optional(),
  path: pathSchema,
  method: httpMethodSchema.optional(),
  decision: decisionSchema,
  reason: z.string().optional(),
});

/**
 * Schema untuk validasi data select access log
 * Digunakan saat mengambil data dari database
 * Menggunakan shared schemas untuk konsistensi
 */
export const selectAccessLogSchema = z.object({
  id: idSchema,
  userId: idSchema.nullable(),
  roleId: idSchema.nullable(),
  featureId: idSchema.nullable(),
  path: z.string(),
  method: z.string().nullable(),
  decision: z.string(),
  reason: z.string().nullable(),
  createdAt: z.date(),
});
