import { SYSTEM } from "@/services/systems"

/**
 * Password Processing Utilities
 * 
 * Domain: Authentication & Security
 * Responsibility: Utility functions untuk memproses password dalam request data
 * 
 * Mengikuti prinsip:
 * - SRP: Hanya menangani password processing
 * - DRY: Reusable password processing logic
 * - KISS: Interface sederhana dan jelas
 * - YAGNI: Hanya implementasi yang dibutuhkan
 */

/**
 * Interface untuk data yang mengandung password
 */
export interface PasswordData {
  password?: string
  passwordHash?: string
  [key: string]: any
}

/**
 * Memproses password dalam data request
 * - Hash password jika ada field 'password'
 * - Hapus field 'password' untuk keamanan
 * - Tambahkan field 'passwordHash' dengan hasil hash
 * 
 * @param data - Data request yang mungkin mengandung password
 * @param saltRounds - Jumlah salt rounds untuk bcrypt (default: 10)
 * @returns Promise<T> - Data yang sudah diproses dengan passwordHash
 */
export async function processPasswordInData<T extends PasswordData>(
  data: T, 
  saltRounds: number = 10
): Promise<T> {
  // Validasi input
  if (!data || typeof data !== 'object') {
    throw new Error('Data harus berupa object yang valid')
  }

  // Clone data untuk menghindari mutation
  const processedData = { ...data }

  // Hash password jika ada
  if (processedData.password) {
    try {
      // Generate hash menggunakan SYSTEM.password service
      processedData.passwordHash = await SYSTEM.password.GENERATE(
        processedData.password, 
        saltRounds
      )
      
      // Hapus password dari data untuk keamanan
      delete processedData.password
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      throw new Error(`Gagal memproses password: ${errorMessage}`)
    }
  }

  return processedData
}

/**
 * Utility untuk memvalidasi apakah data mengandung password yang valid
 * 
 * @param data - Data yang akan divalidasi
 * @returns boolean - True jika password valid
 */
export function hasValidPassword(data: PasswordData): boolean {
  return !!(data?.password && typeof data.password === 'string' && data.password.trim().length > 0)
}

/**
 * Utility untuk membersihkan password dari data tanpa hashing
 * Berguna untuk logging atau debugging
 * 
 * @param data - Data yang akan dibersihkan
 * @returns T - Data tanpa field password
 */
export function sanitizePasswordFromData<T extends PasswordData>(data: T): Omit<T, 'password'> {
  const sanitized = { ...data }
  delete sanitized.password
  return sanitized
}