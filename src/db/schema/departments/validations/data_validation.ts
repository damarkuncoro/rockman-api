import { z } from "zod";

/**
 * Data validation schemas untuk departments
 * 
 * Domain: User Management - Department Management
 * Responsibility: Validasi data departemen untuk konsistensi dan keamanan
 * 
 * Mengikuti prinsip:
 * - SRP: Hanya menangani validasi data departemen
 * - DRY: Reusable validation schemas
 * - KISS: Validasi yang sederhana dan jelas
 * - SOLID: Separation of concerns untuk data validation
 */

/**
 * Schema validasi untuk nama departemen
 * Nama harus unik, tidak kosong, dan memiliki panjang yang sesuai
 */
const departmentNameSchema = z
  .string()
  .min(1, "Nama departemen tidak boleh kosong")
  .max(100, "Nama departemen maksimal 100 karakter")
  .regex(/^[a-zA-Z0-9\s\-_&]+$/, "Nama departemen hanya boleh mengandung huruf, angka, spasi, tanda hubung, underscore, dan ampersand");

/**
 * Schema validasi untuk slug departemen
 * Slug harus URL-friendly dan unik
 */
const departmentSlugSchema = z
  .string()
  .min(1, "Slug departemen tidak boleh kosong")
  .max(100, "Slug departemen maksimal 100 karakter")
  .regex(/^[a-z0-9\-_]+$/, "Slug harus lowercase dan hanya mengandung huruf, angka, tanda hubung, dan underscore");

/**
 * Schema validasi untuk kode departemen
 * Kode harus singkat, unik, dan uppercase
 */
const departmentCodeSchema = z
  .string()
  .min(2, "Kode departemen minimal 2 karakter")
  .max(10, "Kode departemen maksimal 10 karakter")
  .regex(/^[A-Z0-9]+$/, "Kode departemen harus uppercase dan hanya mengandung huruf dan angka");

/**
 * Schema validasi untuk warna departemen
 * Harus berupa hex color code yang valid
 */
const departmentColorSchema = z
  .string()
  .regex(/^#[0-9A-Fa-f]{6}$/, "Warna harus berupa hex color code yang valid (contoh: #3B82F6)")
  .default("#3B82F6");

/**
 * Schema validasi untuk icon departemen
 * Nama icon dari icon library
 */
const departmentIconSchema = z
  .string()
  .min(1, "Icon departemen tidak boleh kosong")
  .max(50, "Icon departemen maksimal 50 karakter")
  .regex(/^[a-zA-Z0-9]+$/, "Icon hanya boleh mengandung huruf dan angka")
  .default("IconBuilding");

/**
 * Schema validasi untuk deskripsi departemen
 * Optional field dengan batasan panjang
 */
const departmentDescriptionSchema = z
  .string()
  .max(500, "Deskripsi departemen maksimal 500 karakter")
  .optional();

/**
 * Schema validasi untuk status aktif departemen
 * Boolean dengan default true
 */
const departmentIsActiveSchema = z
  .boolean()
  .default(true);

/**
 * Schema validasi untuk urutan departemen
 * Integer positif untuk sorting
 */
const departmentSortOrderSchema = z
  .number()
  .int("Urutan harus berupa bilangan bulat")
  .min(0, "Urutan tidak boleh negatif")
  .optional();

/**
 * Schema untuk insert departemen baru
 * Semua field yang diperlukan untuk membuat departemen
 */
export const insertDepartmentDataSchema = z.object({
  name: departmentNameSchema,
  description: departmentDescriptionSchema,
  slug: departmentSlugSchema,
  code: departmentCodeSchema,
  color: departmentColorSchema,
  icon: departmentIconSchema,
  isActive: departmentIsActiveSchema,
  sortOrder: departmentSortOrderSchema,
});

/**
 * Schema untuk update departemen
 * Semua field optional kecuali yang tidak boleh diubah
 */
export const updateDepartmentDataSchema = z.object({
  name: departmentNameSchema.optional(),
  description: departmentDescriptionSchema,
  slug: departmentSlugSchema.optional(),
  code: departmentCodeSchema.optional(),
  color: departmentColorSchema.optional(),
  icon: departmentIconSchema.optional(),
  isActive: departmentIsActiveSchema.optional(),
  sortOrder: departmentSortOrderSchema,
});

/**
 * Schema untuk select departemen
 * Include semua field termasuk yang auto-generated
 */
export const selectDepartmentDataSchema = insertDepartmentDataSchema.extend({
  id: z.number().int().positive(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

/**
 * Schema untuk filter departemen
 * Digunakan untuk query dengan kondisi tertentu
 */
export const departmentFilterSchema = z.object({
  isActive: z.boolean().optional(),
  name: z.string().optional(),
  slug: z.string().optional(),
  code: z.string().optional(),
});

/**
 * Schema untuk sorting departemen
 * Enum field yang bisa digunakan untuk sorting
 */
export const departmentSortSchema = z.enum(['name', 'code', 'createdAt', 'updatedAt', 'sortOrder']);

/**
 * Schema untuk pagination departemen
 * Include parameter pagination dan sorting
 */
export const departmentPaginationSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(10),
  sortBy: departmentSortSchema.default('sortOrder'),
  sortOrder: z.enum(['asc', 'desc']).default('asc'),
});

// Type exports untuk TypeScript
export type InsertDepartmentData = z.infer<typeof insertDepartmentDataSchema>;
export type UpdateDepartmentData = z.infer<typeof updateDepartmentDataSchema>;
export type SelectDepartmentData = z.infer<typeof selectDepartmentDataSchema>;
export type DepartmentFilter = z.infer<typeof departmentFilterSchema>;
export type DepartmentSort = z.infer<typeof departmentSortSchema>;
export type DepartmentPagination = z.infer<typeof departmentPaginationSchema>;