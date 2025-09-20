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
  GENERATE: async (plain: string, saltRounds: number = 10): Promise<string> => {
    if (!plain || typeof plain !== 'string') {
      throw new Error('Password harus berupa string yang tidak kosong')
    }
    return await bcrypt.hash(plain, saltRounds)
  },

  /**
   * Verify plain text password dengan hash
   * @param plain - Plain text password
   * @param hashed - Hashed password dari database
   * @returns Promise<boolean> - True jika password cocok
   */
  VERIFY: async (plain: string, hashed: string): Promise<boolean> => {
    if (!plain || !hashed) {
      return false
    }
    return await bcrypt.compare(plain, hashed)
  }
})

// Export SYSTEM untuk chaining dengan modul lain
export default SYSTEM as {
  password: {
    GENERATE: (plain: string, saltRounds?: number) => Promise<string>
    VERIFY: (plain: string, hashed: string) => Promise<boolean>
  }
}
