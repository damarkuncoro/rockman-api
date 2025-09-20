import { z } from "zod";
import { idSchema } from "../../common/schemas";

/**
 * Fungsi untuk membuat schema validasi dengan custom error message
 */
export const createRequiredStringSchema = (fieldName: string, maxLength = 255) => {
  return z
    .string()
    .min(1, `${fieldName} diperlukan`)
    .max(maxLength, `${fieldName} maksimal ${maxLength} karakter`);
};

/**
 * Fungsi untuk membuat schema string optional
 */
export const createOptionalStringSchema = (maxLength = 255) => {
  return z
    .string()
    .max(maxLength, `String maksimal ${maxLength} karakter`)
    .optional();
};

/**
 * Zod schemas untuk validasi data change history
 * 
 * Domain: Change Tracking
 * Responsibility: Validasi data input dan output untuk change history
 * 
 * @description Schemas untuk:
 * - Validasi data saat insert ke database
 * - Validasi data saat select dari database
 * - Type safety untuk operasi CRUD
 * - Menggunakan shared schemas untuk konsistensi (DRY principle)
 */

/**
 * Schema untuk validasi data insert change history
 * Digunakan saat membuat record baru
 * Menggunakan shared schemas dari validation.ts untuk konsistensi
 */
export const insertChangeHistorySchema = z.object({
  id: idSchema.optional(),
  userId: idSchema,
  tableName: createRequiredStringSchema("Table name", 100),
  recordId: idSchema,
  action: z.enum(["create", "update", "delete"], {
    message: "Action harus salah satu dari: create, update, delete",
  }),
  oldValues: z.string().optional(),
  newValues: z.string().optional(),
  changedAt: z.string().datetime("Format tanggal tidak valid").optional(),
});

/**
 * Schema untuk validasi data select change history
 * Digunakan saat mengambil data dari database
 * Menggunakan shared schemas untuk konsistensi
 */
export const selectChangeHistorySchema = z.object({
  id: idSchema.optional(),
  userId: idSchema.optional(),
  tableName: createOptionalStringSchema(100),
  recordId: idSchema.optional(),
  action: z.enum(["create", "update", "delete"]).optional(),
  oldValues: z.string().optional(),
  newValues: z.string().optional(),
  changedAt: z.string().datetime().optional(),
});

// Export types untuk TypeScript
export type InsertChangeHistoryInput = z.infer<typeof insertChangeHistorySchema>;
export type SelectChangeHistoryInput = z.infer<typeof selectChangeHistorySchema>;