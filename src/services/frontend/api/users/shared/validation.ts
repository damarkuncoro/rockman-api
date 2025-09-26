/**
 * Frontend Service: Validation API
 * 
 * Domain: User Management - Validation Operations
 * Responsibility: Menyediakan struktur hierarkis untuk validasi user data
 * 
 * Mengikuti prinsip:
 * - SRP: Hanya menangani validasi user data
 * - DRY: Reusable validation functions yang konsisten
 * - KISS: Interface yang sederhana dan mudah digunakan
 * - SOLID: Separation of concerns untuk setiap jenis validasi
 */

import type { PasswordStrengthResult } from '../../password/shared'

/**
 * Struktur hierarkis untuk validasi user data
 * Pattern: API.users.VALIDATE.Category.method(value)
 * 
 * Contoh penggunaan:
 * - API.users.VALIDATE.Required.email("test@example.com")
 * - API.users.VALIDATE.Format.email("test@example.com") 
 * - API.users.VALIDATE.Strength.password("myPassword123!")
 */
export const VALIDATE = {
  /**
   * Validasi untuk field yang wajib diisi (Required)
   */
  Required: {
    /**
     * Validasi email tidak kosong
     * @param email - Email yang akan divalidasi
     * @returns boolean - true jika email tidak kosong
     */
    email: (email: string): boolean => {
      return email.trim().length > 0
    },

    /**
     * Validasi password tidak kosong
     * @param password - Password yang akan divalidasi
     * @returns boolean - true jika password tidak kosong
     */
    password: (password: string): boolean => {
      return password.trim().length > 0
    },

    /**
     * Validasi nama tidak kosong
     * @param name - Nama yang akan divalidasi
     * @returns boolean - true jika nama tidak kosong
     */
    name: (name: string): boolean => {
      return name.trim().length > 0
    }
  },

  /**
   * Validasi untuk format data (Format)
   */
  Format: {
    /**
     * Validasi format email menggunakan regex
     * @param email - Email yang akan divalidasi
     * @returns boolean - true jika format email valid
     */
    email: (email: string): boolean => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailRegex.test(email)
    },

    /**
     * Validasi format phone number
     * @param phone - Nomor telepon yang akan divalidasi
     * @returns boolean - true jika format phone valid
     */
    phone: (phone: string): boolean => {
      const phoneRegex = /^(\+62|62|0)[0-9]{9,13}$/
      return phoneRegex.test(phone.replace(/\s|-/g, ''))
    }
  },

  /**
   * Validasi untuk kekuatan/kompleksitas data (Strength)
   */
  Strength: {
    /**
     * Validasi kekuatan password dengan analisis komprehensif
     * @param password - Password yang akan dianalisis
     * @returns PasswordStrengthResult - Hasil analisis kekuatan password
     */
    password: (password: string): PasswordStrengthResult => {
      const checks = {
        minLength: password.length >= 8,
        hasUpperCase: /[A-Z]/.test(password),
        hasLowerCase: /[a-z]/.test(password),
        hasNumbers: /\d/.test(password),
        hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password)
      }

      const score = Object.values(checks).filter(Boolean).length
      
      return {
        ...checks,
        score,
        isStrong: score >= 4,
        strength: score >= 4 ? 'strong' : score >= 3 ? 'medium' : 'weak'
      }
    }
  },

  /**
   * Validasi untuk panjang minimum data (Length)
   */
  Length: {
    /**
     * Validasi panjang minimum password
     * @param password - Password yang akan divalidasi
     * @param minLength - Panjang minimum (default: 8)
     * @returns boolean - true jika memenuhi panjang minimum
     */
    password: (password: string, minLength: number = 8): boolean => {
      return password.length >= minLength
    },

    /**
     * Validasi panjang minimum nama
     * @param name - Nama yang akan divalidasi
     * @param minLength - Panjang minimum (default: 2)
     * @returns boolean - true jika memenuhi panjang minimum
     */
    name: (name: string, minLength: number = 2): boolean => {
      return name.trim().length >= minLength
    }
  },

  /**
   * Validasi untuk kecocokan data (Match)
   */
  Match: {
    /**
     * Validasi kecocokan password dengan konfirmasi
     * @param password - Password pertama
     * @param confirmPassword - Password konfirmasi
     * @returns boolean - true jika password cocok
     */
    password: (password: string, confirmPassword: string): boolean => {
      return password === confirmPassword
    }
  },

  /**
   * Utility functions untuk validasi
   */
  Utils: {
    /**
     * Generate pesan kekuatan password
     * @param password - Password yang akan dianalisis
     * @returns string - Pesan kekuatan password
     */
    getPasswordStrengthMessage: (password: string): string => {
      const result = VALIDATE.Strength.password(password)
      
      if (result.strength === 'strong') {
        return 'Password sangat kuat'
      } else if (result.strength === 'medium') {
        return 'Password cukup kuat, pertimbangkan menambah karakter khusus'
      } else {
        return 'Password lemah, gunakan kombinasi huruf besar, kecil, angka, dan karakter khusus'
      }
    },

    /**
     * Validasi email lengkap (required + format)
     * @param email - Email yang akan divalidasi
     * @returns { isValid: boolean, message: string }
     */
    validateEmailComplete: (email: string): { isValid: boolean, message: string } => {
      if (!VALIDATE.Required.email(email)) {
        return { isValid: false, message: 'Email wajib diisi' }
      }
      
      if (!VALIDATE.Format.email(email)) {
        return { isValid: false, message: 'Format email tidak valid' }
      }
      
      return { isValid: true, message: 'Email valid' }
    },

    /**
     * Validasi password lengkap (required + length + strength)
     * @param password - Password yang akan divalidasi
     * @returns { isValid: boolean, message: string, strength?: PasswordStrengthResult }
     */
    validatePasswordComplete: (password: string): { 
      isValid: boolean, 
      message: string, 
      strength?: PasswordStrengthResult 
    } => {
      if (!VALIDATE.Required.password(password)) {
        return { isValid: false, message: 'Password wajib diisi' }
      }
      
      if (!VALIDATE.Length.password(password)) {
        return { isValid: false, message: 'Password minimal 8 karakter' }
      }
      
      const strength = VALIDATE.Strength.password(password)
      const strengthMessage = VALIDATE.Utils.getPasswordStrengthMessage(password)
      
      return { 
        isValid: true, 
        message: strengthMessage, 
        strength 
      }
    }
  }
}

/**
 * Contoh penggunaan struktur hierarkis:
 * 
 * // Validasi Required
 * const isEmailRequired = API.users.VALIDATE.Required.email("test@example.com")
 * const isPasswordRequired = API.users.VALIDATE.Required.password("myPassword")
 * 
 * // Validasi Format
 * const isEmailFormatValid = API.users.VALIDATE.Format.email("test@example.com")
 * const isPhoneFormatValid = API.users.VALIDATE.Format.phone("+6281234567890")
 * 
 * // Validasi Strength
 * const passwordStrength = API.users.VALIDATE.Strength.password("MyPassword123!")
 * console.log(passwordStrength.isStrong) // true/false
 * 
 * // Validasi Length
 * const isPasswordLengthValid = API.users.VALIDATE.Length.password("myPassword", 8)
 * const isNameLengthValid = API.users.VALIDATE.Length.name("John", 2)
 * 
 * // Validasi Match
 * const isPasswordMatch = API.users.VALIDATE.Match.password("password", "password")
 * 
 * // Utility Functions
 * const strengthMessage = API.users.VALIDATE.Utils.getPasswordStrengthMessage("MyPass123!")
 * const emailValidation = API.users.VALIDATE.Utils.validateEmailComplete("test@example.com")
 * const passwordValidation = API.users.VALIDATE.Utils.validatePasswordComplete("MyPass123!")
 */