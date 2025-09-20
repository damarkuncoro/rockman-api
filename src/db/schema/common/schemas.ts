import { z } from "zod";

/**
 * Schema validasi untuk ID (primary key)
 */
export const idSchema = z.number().int().positive("ID harus berupa integer positif");

/**
 * Schema validasi untuk slug (URL-friendly string)
 */
export const slugSchema = z
  .string()
  .min(1, "Slug diperlukan")
  .max(100, "Slug maksimal 100 karakter")
  .regex(/^[a-z0-9-]+$/, "Slug hanya boleh mengandung huruf kecil, angka, dan dash");

/**
 * Schema validasi untuk path/route
 */
export const pathSchema = z
  .string()
  .min(1, "Path diperlukan")
  .max(255, "Path maksimal 255 karakter")
  .regex(/^\/[a-zA-Z0-9\/_-]*$/, "Path harus dimulai dengan / dan hanya mengandung karakter valid");

/**
 * Schema validasi untuk HTTP method
 */
export const httpMethodSchema = z.enum(["GET", "POST", "PUT", "DELETE", "PATCH"], {
  message: "HTTP method harus salah satu dari: GET, POST, PUT, DELETE, PATCH",
});

/**
 * Schema validasi untuk status aktif/tidak aktif
 */
export const statusSchema = z.enum(["active", "inactive"], {
  message: "Status harus 'active' atau 'inactive'",
});

/**
 * Schema validasi untuk decision (allow/deny)
 */
export const decisionSchema = z.enum(["allow", "deny"], {
  message: "Decision harus 'allow' atau 'deny'",
});

/**
 * Schema validasi untuk pagination
 */
export const paginationSchema = z.object({
  page: z.number().int().min(1, "Page minimal 1").default(1),
  limit: z.number().int().min(1, "Limit minimal 1").max(100, "Limit maksimal 100").default(10),
});

/**
 * Schema validasi untuk sorting
 */
export const sortSchema = z.object({
  sortBy: z.string().min(1, "Sort by diperlukan").optional(),
  sortOrder: z.enum(["asc", "desc"], {
    message: "Sort order harus 'asc' atau 'desc'",
  }).default("asc"),
});

/**
 * Schema validasi untuk search
 */
export const searchSchema = z.object({
  search: z.string().max(255, "Search maksimal 255 karakter").optional(),
});

/**
 * Schema validasi untuk date range
 */
export const dateRangeSchema = z.object({
  startDate: z.string().datetime("Format tanggal tidak valid").optional(),
  endDate: z.string().datetime("Format tanggal tidak valid").optional(),
}).refine(
  (data) => {
    if (data.startDate && data.endDate) {
      return new Date(data.startDate) <= new Date(data.endDate);
    }
    return true;
  },
  {
    message: "Start date harus lebih kecil atau sama dengan end date",
    path: ["endDate"],
  }
);

/**
 * Base query schema yang menggabungkan pagination, sort, search, dan date range
 */
export const baseQuerySchema = paginationSchema
  .merge(sortSchema)
  .merge(searchSchema)
  .merge(dateRangeSchema);

/**
 * Query schema dengan status filter
 */
export const statusQuerySchema = baseQuerySchema.extend({
  status: statusSchema.optional(),
});

/**
 * Query schema dengan role filter
 */
export const roleQuerySchema = baseQuerySchema.extend({
  roleId: idSchema.optional(),
});

/**
 * Query schema dengan feature filter
 */
export const featureQuerySchema = baseQuerySchema.extend({
  featureId: idSchema.optional(),
});

/**
 * Response schemas
 */
export const successResponseSchema = z.object({
  success: z.literal(true),
  message: z.string().optional(),
  data: z.any().optional(),
});

export const errorResponseSchema = z.object({
  success: z.literal(false),
  message: z.string(),
  error: z.string().optional(),
  details: z.any().optional(),
});

export const paginatedResponseSchema = z.object({
  success: z.literal(true),
  message: z.string().optional(),
  data: z.array(z.any()),
  pagination: z.object({
    page: z.number().int(),
    limit: z.number().int(),
    total: z.number().int(),
    totalPages: z.number().int(),
    hasNext: z.boolean(),
    hasPrev: z.boolean(),
  }),
});

/**
 * Utility function untuk membuat array schema
 */
export const createArraySchema = <T>(itemSchema: z.ZodSchema<T>, minItems = 1) => {
  return z.array(itemSchema).min(minItems, `Array minimal ${minItems} item`);
};