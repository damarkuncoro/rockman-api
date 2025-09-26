/**
 * Frontend Service: Email Validation
 * 
 * Domain: User Management - Email Validation
 * Responsibility: Menyediakan fungsi validasi untuk operasi email
 * 
 * Mengikuti prinsip:
 * - SRP: Hanya menangani validasi email
 * - DRY: Reusable validation functions
 * - KISS: Validasi yang sederhana dan mudah dipahami
 * - SOLID: Pure functions tanpa side effects
 */

/**
 * Validasi format email menggunakan regex
 * @param email - Email yang akan divalidasi
 * @returns boolean - true jika format valid
 */
export const validateEmailFormat = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validasi email tidak kosong
 * @param email - Email yang akan divalidasi
 * @returns boolean - true jika email tidak kosong
 */
export const validateEmailRequired = (email: string): boolean => {
  return email.trim().length > 0
}

/**
 * Validasi panjang email (maksimal 254 karakter sesuai RFC 5321)
 * @param email - Email yang akan divalidasi
 * @returns boolean - true jika panjang valid
 */
export const validateEmailLength = (email: string): boolean => {
  return email.length <= 254
}

/**
 * Validasi domain email tidak dalam blacklist
 * @param email - Email yang akan divalidasi
 * @returns boolean - true jika domain tidak dalam blacklist
 */
export const validateEmailDomain = (email: string): boolean => {
  const blacklistedDomains = [
    'tempmail.org',
    '10minutemail.com',
    'guerrillamail.com',
    'mailinator.com'
  ]
  
  const domain = email.split('@')[1]?.toLowerCase()
  return !blacklistedDomains.includes(domain)
}

/**
 * Validasi data change email (password dan email baru)
 * @param currentPassword - Password saat ini
 * @param newEmail - Email baru yang akan digunakan
 * @returns object - hasil validasi dengan detail error
 */
export const validateChangeEmailData = (currentPassword: string, newEmail: string) => {
  const errors: string[] = []
  
  
  if (!newEmail || newEmail.trim().length === 0) {
    errors.push('Email baru wajib diisi')
  }
  
  // Validasi format email baru jika ada
  if (newEmail && !validateEmailFormat(newEmail)) {
    errors.push('Format email baru tidak valid')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Validasi data update email (email saat ini dan email baru)
 * @param currentEmail - Email saat ini
 * @param newEmail - Email baru yang akan digunakan
 * @returns object - hasil validasi dengan detail error
 */
export const validateUpdateEmailData = (currentEmail: string, newEmail: string) => {
  
  const errors: string[] = []
  
  if (!currentEmail || currentEmail.trim().length === 0) {
    errors.push('Email saat ini wajib diisi')
  }
  
  if (!newEmail || newEmail.trim().length === 0) {
    errors.push('Email baru wajib diisi')
  }
  
  // Validasi format email saat ini jika ada
  if (currentEmail && !validateEmailFormat(currentEmail)) {
    errors.push('Format email saat ini tidak valid')
  }
  
  // Validasi format email baru jika ada
  if (newEmail && !validateEmailFormat(newEmail)) {
    errors.push('Format email baru tidak valid')
  }
  
  // Validasi email tidak sama
  if (currentEmail && newEmail && currentEmail.toLowerCase() === newEmail.toLowerCase()) {
    errors.push('Email baru harus berbeda dari email saat ini')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Validasi email lengkap (gabungan semua validasi)
 * @param email - Email yang akan divalidasi
 * @returns object - hasil validasi dengan detail error
 */
export const validateEmailComplete = (email: string) => {
  const errors: string[] = []
  
  if (!validateEmailRequired(email)) {
    errors.push('Email wajib diisi')
  }
  
  if (!validateEmailFormat(email)) {
    errors.push('Format email tidak valid')
  }
  
  if (!validateEmailLength(email)) {
    errors.push('Email terlalu panjang (maksimal 254 karakter)')
  }
  
  if (!validateEmailDomain(email)) {
    errors.push('Domain email tidak diizinkan')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Export semua fungsi validasi dalam satu object untuk kemudahan import
 */
export const EmailValidation = {
  format: validateEmailFormat,
  required: validateEmailRequired,
  length: validateEmailLength,
  domain: validateEmailDomain,
  complete: validateEmailComplete,
  changeEmailData: validateChangeEmailData,
  updateEmailData: validateUpdateEmailData
}

/**
 * Contoh penggunaan:
 * 
 * import { EmailValidation } from './validation'
 * 
 * // Validasi format
 * const isValidFormat = EmailValidation.format('test@example.com')
 * 
 * // Validasi lengkap
 * const validation = EmailValidation.complete('test@example.com')
 * if (!validation.isValid) {
 *   console.log('Errors:', validation.errors)
 * }
 * 
 * // Validasi data change email
 * const changeEmailValidation = EmailValidation.changeEmailData('currentPass', 'new@email.com')
 * if (!changeEmailValidation.isValid) {
 *   console.log('Change email errors:', changeEmailValidation.errors)
 * }
 */