import { z } from "zod";
import { insertDepartmentDataSchema, updateDepartmentDataSchema } from "./data_validation";

/**
 * API validation schemas untuk departments
 * 
 * Domain: User Management - Department Management
 * Responsibility: Validasi data untuk API endpoints departemen
 * 
 * Mengikuti prinsip:
 * - SRP: Hanya menangani validasi API untuk departemen
 * - DRY: Reusable validation untuk berbagai endpoints
 * - KISS: Validasi API yang sederhana dan konsisten
 * - SOLID: Type safety untuk API input/output
 */

/**
 * Schema untuk validasi create departemen di API
 * Menggunakan insertDepartmentDataSchema sebagai base
 * Menghilangkan field yang auto-generated
 */
export const createDepartmentSchema = insertDepartmentDataSchema.omit({
  sortOrder: true, // Auto-generated
});

/**
 * Schema untuk validasi update departemen di API
 * Menggunakan updateDepartmentDataSchema sebagai base
 */
export const updateDepartmentApiSchema = updateDepartmentDataSchema;

/**
 * Schema untuk validasi ID departemen di API
 * Digunakan untuk parameter path
 */
export const departmentIdSchema = z.object({
  id: z.string().regex(/^\d+$/, "ID harus berupa angka").transform(Number),
});

/**
 * Schema untuk validasi query parameters
 * Digunakan untuk filtering dan pagination
 */
export const departmentQuerySchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).optional(),
  limit: z.string().regex(/^\d+$/).transform(Number).optional(),
  sortBy: z.enum(['name', 'code', 'createdAt', 'updatedAt', 'sortOrder']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  isActive: z.string().transform((val) => val === 'true').optional(),
  search: z.string().optional(),
});

/**
 * Schema untuk bulk operations pada departemen
 * Digunakan untuk operasi batch seperti activate/deactivate/delete
 */
export const bulkDepartmentSchema = z.object({
  ids: z.array(z.number().int().positive()).min(1, "Minimal satu ID diperlukan"),
  action: z.enum(['activate', 'deactivate', 'delete']),
});

/**
 * Schema untuk reorder departemen
 * Digunakan untuk mengubah urutan tampilan departemen
 */
export const reorderDepartmentSchema = z.object({
  departments: z.array(z.object({
    id: z.number().int().positive(),
    sortOrder: z.number().int().min(0),
  })).min(1, "Minimal satu departemen diperlukan"),
});

/**
 * Schema untuk assign user ke departemen
 * Digunakan untuk mengubah departemen user
 */
export const assignUserToDepartmentSchema = z.object({
  userId: z.number().int().positive(),
  departmentId: z.number().int().positive(),
});

/**
 * Schema untuk bulk assign users ke departemen
 * Digunakan untuk mengubah departemen multiple users sekaligus
 */
export const bulkAssignUsersToDepartmentSchema = z.object({
  userIds: z.array(z.number().int().positive()).min(1, "Minimal satu user ID diperlukan"),
  departmentId: z.number().int().positive(),
});

// Type exports untuk TypeScript
/**
 * Type untuk input create departemen
 */
export type CreateDepartmentInput = z.infer<typeof createDepartmentSchema>;

/**
 * Type untuk input update departemen
 */
export type UpdateDepartmentInput = z.infer<typeof updateDepartmentApiSchema>;

/**
 * Type untuk input ID departemen
 */
export type DepartmentIdInput = z.infer<typeof departmentIdSchema>;

/**
 * Type untuk input query departemen
 */
export type DepartmentQueryInput = z.infer<typeof departmentQuerySchema>;

/**
 * Type untuk input bulk operations departemen
 */
export type BulkDepartmentInput = z.infer<typeof bulkDepartmentSchema>;

/**
 * Type untuk input reorder departemen
 */
export type ReorderDepartmentInput = z.infer<typeof reorderDepartmentSchema>;

/**
 * Type untuk input assign user ke departemen
 */
export type AssignUserToDepartmentInput = z.infer<typeof assignUserToDepartmentSchema>;

/**
 * Type untuk input bulk assign users ke departemen
 */
export type BulkAssignUsersToDepartmentInput = z.infer<typeof bulkAssignUsersToDepartmentSchema>;