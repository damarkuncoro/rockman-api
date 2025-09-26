import bcrypt from "bcryptjs"
import SYSTEM from "@/core/core.system"

/**
 * Password Service Module
 * 
 * Domain: Authentication & Security
 * Responsibility: Mengelola hashing dan verifikasi password
 * 
 * Mengikuti prinsip:
 * - SRP: Hanya menangani operasi password
 * - DRY: Reusable password utilities
 * - KISS: Interface sederhana dan jelas
 */

/**
 * Registrasi modul password ke SYSTEM
 * Menyediakan fungsi untuk generate dan verify password hash
 */
SYSTEM.register("password", {
  /**
   * Generate hash dari plain text password
   * @param plain - Plain text password
   * @param saltRounds - Jumlah salt rounds untuk bcrypt (default: 10)
   * @returns Promise<string> - Hashed password
   */
  GENERATE: async (...args: unknown[]): Promise<string> => {
    const [plain, saltRounds = 10] = args as [string, number?]
    if (!plain || typeof plain !== 'string') {
      throw new Error('Password harus berupa string yang tidak kosong')
    }
    return await bcrypt.hash(plain, saltRounds)
  },

  /**
   * Verify plain text password dengan hash
   * @param plain - Plain text password
   * @param hashed - Hashed password untuk dibandingkan
   * @returns Promise<boolean> - True jika password cocok
   */
  VERIFY: async (...args: unknown[]): Promise<boolean> => {
    const [plain, hashed] = args as [string, string]
    if (!plain || typeof plain !== 'string') {
      throw new Error('Password harus berupa string yang tidak kosong')
    }
    if (!hashed || typeof hashed !== 'string') {
      throw new Error('Hash password harus berupa string yang tidak kosong')
    }
    return await bcrypt.compare(plain, hashed)
  }
})

export default SYSTEM
