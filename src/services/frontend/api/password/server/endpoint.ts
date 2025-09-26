/**
 * Password API Endpoints
 * 
 * Domain: Frontend API - Password Operations
 * Responsibility: Menangani HTTP requests untuk password operations
 * 
 * Mengikuti prinsip:
 * - SRP: Hanya menangani endpoint password operations
 * - DRY: Reusable endpoint patterns
 * - KISS: Interface yang sederhana dan jelas
 * - SOLID: Dependency injection dan error handling
 */

import { NextRequest, NextResponse } from 'next/server'
import { usersPasswordService } from '@/services/database/users/password.service'
import { 
  validateChangePassword, 
  validateResetPassword, 
  validatePasswordStrength
} from '../shared'

/**
 * Interface untuk API response
 */
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

/**
 * Interface untuk password strength response
 */
export interface PasswordStrengthResponse {
  score: number
  feedback: string[]
  isValid: boolean
}

/**
 * Handler untuk change password endpoint
 * POST /api/users/[id]/password/change
 */
export async function handleChangePassword(
  request: NextRequest,
  userId: number
): Promise<NextResponse<ApiResponse>> {
  try {
    const body = await request.json()
    
    // Validasi input menggunakan schema
    const validation = validateChangePassword(body)
    if (!validation.success) {
      return NextResponse.json({
        success: false,
        error: validation.error.issues[0].message
      }, { status: 400 })
    }

    const { currentPassword, newPassword } = validation.data

    // Panggil service untuk change password
    const result = await usersPasswordService.changePassword({
      userId,
      currentPassword,
      newPassword
    })

    if (!result.isValid) {
      return NextResponse.json({
        success: false,
        error: result.message
      }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: 'Password berhasil diubah'
    })

  } catch (error: unknown) {
    console.error('Error in handleChangePassword:', error)
    return NextResponse.json({
      success: false,
      error: 'Terjadi kesalahan server'
    }, { status: 500 })
  }
}

/**
 * Handler untuk reset password endpoint
 * POST /api/users/password/reset
 */
export async function handleResetPassword(
  request: NextRequest
): Promise<NextResponse<ApiResponse>> {
  try {
    const body = await request.json()
    
    // Validasi input menggunakan schema
    const validation = validateResetPassword(body)
    if (!validation.success) {
      return NextResponse.json({
        success: false,
        error: validation.error.issues[0].message
      }, { status: 400 })
    }

    const { email } = validation.data

    // Panggil service untuk reset password
    const result = await usersPasswordService.resetPassword({ email })

    if (!result.isValid) {
      return NextResponse.json({
        success: false,
        error: result.message
      }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: 'Link reset password telah dikirim ke email Anda'
    })

  } catch (error: unknown) {
    console.error('Error in handleResetPassword:', error)
    return NextResponse.json({
      success: false,
      error: 'Terjadi kesalahan server'
    }, { status: 500 })
  }
}

/**
 * Handler untuk check password strength endpoint
 * POST /api/users/password/strength
 */
export async function handlePasswordStrength(
  request: NextRequest
): Promise<NextResponse<ApiResponse<PasswordStrengthResponse>>> {
  try {
    const body = await request.json()
    
    // Validasi input menggunakan schema
    const validation = validatePasswordStrength(body)
    if (!validation.success) {
      return NextResponse.json({
        success: false,
        error: validation.error.issues[0].message
      }, { status: 400 })
    }

    const { password } = validation.data

    // Panggil service untuk check password strength
    const result = usersPasswordService.validatePasswordStrength(password)

    // Convert ke format response yang diharapkan
    const strengthResponse: PasswordStrengthResponse = {
      score: result.isValid ? 4 : 2,
      feedback: result.isValid ? ['Password kuat'] : [result.message],
      isValid: result.isValid
    }

    return NextResponse.json({
      success: true,
      data: strengthResponse
    })

  } catch (error: unknown) {
    console.error('Error in handlePasswordStrength:', error)
    return NextResponse.json({
      success: false,
      error: 'Terjadi kesalahan server'
    }, { status: 500 })
  }
}

/**
 * Helper function untuk extract user ID dari URL params
 */
export function extractUserIdFromParams(params: { id: string }): number {
  const userId = parseInt(params.id, 10)
  if (isNaN(userId)) {
    throw new Error('Invalid user ID')
  }
  return userId
}