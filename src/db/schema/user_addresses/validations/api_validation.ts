import { z } from "zod";

/**
 * Validasi untuk API user addresses
 * 
 * Domain: User Management
 * Responsibility: Validasi input API untuk user addresses
 */

/**
 * Schema validasi untuk create user address
 */
export const createUserAddressSchema = z.object({
  label: z.string().min(1, "Label alamat harus diisi").max(100, "Label alamat maksimal 100 karakter"),
  recipientName: z.string().min(1, "Nama penerima harus diisi").max(100, "Nama penerima maksimal 100 karakter"),
  phoneNumber: z.string().min(10, "Nomor telepon minimal 10 digit").max(20, "Nomor telepon maksimal 20 karakter"),
  addressLine1: z.string().min(1, "Alamat harus diisi"),
  addressLine2: z.string().optional(),
  city: z.string().min(1, "Kota harus diisi").max(100, "Kota maksimal 100 karakter"),
  province: z.string().min(1, "Provinsi harus diisi").max(100, "Provinsi maksimal 100 karakter"),
  postalCode: z.string().min(5, "Kode pos minimal 5 digit").max(10, "Kode pos maksimal 10 karakter"),
  country: z.string().max(100, "Negara maksimal 100 karakter").default("Indonesia"),
  isDefault: z.boolean().default(false),
});

/**
 * Schema validasi untuk update user address
 */
export const updateUserAddressSchema = createUserAddressSchema.partial();

/**
 * Schema validasi untuk set default address
 */
export const setDefaultAddressSchema = z.object({
  addressId: z.number().int().positive("ID alamat harus berupa angka positif"),
});

/**
 * Type definitions
 */
export type CreateUserAddressInput = z.infer<typeof createUserAddressSchema>;
export type UpdateUserAddressInput = z.infer<typeof updateUserAddressSchema>;
export type SetDefaultAddressInput = z.infer<typeof setDefaultAddressSchema>;