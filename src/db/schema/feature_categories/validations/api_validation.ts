import { z } from "zod";
import { insertFeatureCategorySchema, updateFeatureCategorySchema } from "./data_validation";

/**
 * API validation schemas untuk feature categories
 * 
 * Domain: RBAC - Feature Management
 * Responsibility: Validasi data untuk API endpoints kategori fitur
 * 
 * Mengikuti prinsip:
 * - SRP: Hanya menangani validasi API untuk kategori fitur
 * - DRY: Reusable validation untuk berbagai endpoints
 * - KISS: Validasi API yang sederhana dan konsisten
 * - SOLID: Type safety untuk API input/output
 */

/**
 * Schema untuk validasi create kategori fitur di API
 * Menggunakan insertFeatureCategorySchema sebagai base
 * Menghilangkan field yang auto-generated
 */
export const createFeatureCategorySchema = insertFeatureCategorySchema.omit({
  sortOrder: true, // Auto-generated
});

/**
 * Schema untuk validasi update kategori fitur di API
 * Menggunakan updateFeatureCategorySchema sebagai base
 */
export const updateFeatureCategoryApiSchema = updateFeatureCategorySchema;

/**
 * Schema untuk validasi ID kategori fitur di API
 * Digunakan untuk parameter path
 */
export const featureCategoryIdSchema = z.object({
  id: z.string().regex(/^\d+$/, "ID harus berupa angka").transform(Number),
});

/**
 * Schema untuk validasi query parameters
 * Digunakan untuk filtering dan pagination
 */
export const featureCategoryQuerySchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).optional(),
  limit: z.string().regex(/^\d+$/).transform(Number).optional(),
  sortBy: z.enum(['name', 'createdAt', 'updatedAt', 'sortOrder']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  isActive: z.string().transform((val) => val === 'true').optional(),
  search: z.string().optional(),
});

/**
 * Schema untuk validasi bulk operations
 * Digunakan untuk operasi batch pada kategori fitur
 */
export const bulkFeatureCategorySchema = z.object({
  ids: z.array(z.number().int().positive()).min(1, "Minimal satu ID diperlukan"),
  action: z.enum(['activate', 'deactivate', 'delete']),
});

/**
 * Schema untuk validasi reorder kategori fitur
 * Digunakan untuk mengubah urutan kategori
 */
export const reorderFeatureCategorySchema = z.object({
  categories: z.array(z.object({
    id: z.number().int().positive(),
    sortOrder: z.number().int().min(0),
  })).min(1, "Minimal satu kategori diperlukan"),
});

/**
 * Type untuk input create kategori fitur di API
 * Digunakan untuk type safety di request handlers
 */
export type CreateFeatureCategoryInput = z.infer<typeof createFeatureCategorySchema>;

/**
 * Type untuk input update kategori fitur di API
 * Digunakan untuk type safety di request handlers
 */
export type UpdateFeatureCategoryInput = z.infer<typeof updateFeatureCategoryApiSchema>;

/**
 * Type untuk parameter ID kategori fitur di API
 * Digunakan untuk type safety di path parameters
 */
export type FeatureCategoryIdInput = z.infer<typeof featureCategoryIdSchema>;

/**
 * Type untuk query parameters kategori fitur di API
 * Digunakan untuk type safety di query parameters
 */
export type FeatureCategoryQueryInput = z.infer<typeof featureCategoryQuerySchema>;

/**
 * Type untuk bulk operations kategori fitur di API
 * Digunakan untuk type safety di bulk operations
 */
export type BulkFeatureCategoryInput = z.infer<typeof bulkFeatureCategorySchema>;

/**
 * Type untuk reorder kategori fitur di API
 * Digunakan untuk type safety di reorder operations
 */
export type ReorderFeatureCategoryInput = z.infer<typeof reorderFeatureCategorySchema>;