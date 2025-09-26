/**
 * Frontend Service: Email API Endpoints
 * 
 * Domain: User Management - Email API Operations
 * Responsibility: Menyediakan interface untuk operasi email user melalui API
 * 
 * Mengikuti prinsip:
 * - SRP: Hanya menangani API calls untuk operasi email
 * - DRY: Reusable API calls yang konsisten
 * - KISS: Interface yang sederhana dan mudah digunakan
 * - SOLID: Dependency injection dan separation of concerns
 */

import { EmailValidation } from '../shared'

/**
 * Interface untuk request update email
 */
/**
 * Interface untuk request update email
 */
export interface UpdateEmailRequest {
  currentEmail: string
  currentPassword: string
  newEmail: string
}

/**
 * Interface untuk response update email
 */
export interface UpdateEmailResponse {
  id: number
  email: string
  isVerified: boolean
  updatedAt: string
  message: string
}

/**
 * Interface untuk response get email status
 */
export interface EmailStatusResponse {
  id: number
  email: string
  isVerified: boolean
  lastUpdated: string
}

/**
 * Interface untuk API response wrapper
 */
export interface ApiResponse<T> {
  success: boolean
  message?: string
  data?: T
  error?: string
}

/**
 * Interface untuk request change email
 */
export interface ChangeEmailRequest {
  currentPassword: string
  newEmail: string
}

/**
 * Interface untuk request verify email
 */
export interface VerifyEmailRequest {
  verificationCode: string
}

/**
 * Mengambil status email user
 * @param userId - ID user
 * @returns Promise<EmailStatusResponse>
 */
export const getEmailStatus = async (userId: number): Promise<EmailStatusResponse> => {
  const response = await fetch(`/api/v1/users/${userId}/email`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  const result: ApiResponse<EmailStatusResponse> = await response.json()

  if (!response.ok) {
    throw new Error(result.message || 'Gagal mengambil status email')
  }

  if (!result.success || !result.data) {
    throw new Error(result.message || 'Response tidak valid')
  }

  return result.data
}

/**
 * Method untuk mengubah email user
 * @param userId - ID user yang akan diubah emailnya
 * @param data - Data change email request
 * @returns Promise response dari API
 */
export const changeEmail = async (userId: number, data: ChangeEmailRequest) => {
  // Validasi input menggunakan validation module
  const validation = EmailValidation.complete(data.newEmail)
  if (!validation.isValid) {
    throw new Error(validation.errors.join(', '))
  }

  const response = await fetch(`/api/v1/users/${userId}/email/change`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  
  return response.json()
}

/**
 * Method untuk verifikasi email user
 * @param userId - ID user yang akan diverifikasi emailnya
 * @param data - Data verify email request
 * @returns Promise response dari API
 */
export const verifyEmail = async (userId: number, data: VerifyEmailRequest) => {
  const response = await fetch(`/api/v1/users/${userId}/email/verify`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  
  return response.json()
}

/**
 * Mengupdate email user
 * @param userId - ID user
 * @param emailData - Data email baru dan password konfirmasi
 * @returns Promise<UpdateEmailResponse>
 */
export const updateEmail = async (
  userId: number, 
  emailData: UpdateEmailRequest
): Promise<UpdateEmailResponse> => {
  // Validasi input menggunakan validation module
  const inputValidation = EmailValidation.changeEmailData(emailData.currentPassword, emailData.newEmail)
  if (!inputValidation.isValid) {
    throw new Error(inputValidation.errors.join(', '))
  }

  // Validasi email data menggunakan validation module
  const emailValidation = EmailValidation.updateEmailData(emailData.currentEmail, emailData.newEmail)
  if (!emailValidation.isValid) {
    throw new Error(emailValidation.errors.join(', '))
  }

  const response = await fetch(`/api/v1/users/${userId}/email`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(emailData),
  })

  const result: ApiResponse<UpdateEmailResponse> = await response.json()

  if (!response.ok) {
    throw new Error(result.message || 'Gagal mengupdate email')
  }

  if (!result.success || !result.data) {
    throw new Error(result.message || 'Update email gagal')
  }

  return result.data
}

/**
 * Export semua endpoint functions dalam satu object
 */
export const EmailEndpoints = {
  getStatus: getEmailStatus,
  change: changeEmail,
  verify: verifyEmail,
  update: updateEmail
}

/**
 * Contoh penggunaan:
 * 
 * import { EmailEndpoints } from './endpoint'
 * 
 * // GET email status
 * const emailStatus = await EmailEndpoints.getStatus(1)
 * console.log(emailStatus.email, emailStatus.isVerified)
 * 
 * // UPDATE email
 * const updateResult = await EmailEndpoints.update(1, {
 *   currentPassword: "current_password",
 *   newEmail: "new@example.com"
 * })
 * console.log(updateResult.message)
 * 
 * // CHANGE email
 * const changeResult = await EmailEndpoints.change(1, {
 *   currentPassword: "current_password",
 *   newEmail: "new@example.com"
 * })
 */