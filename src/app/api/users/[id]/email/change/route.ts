/**
 * API Route: Change User Email
 * 
 * Domain: User Management - Email Management
 * Responsibility: Handle email change requests
 * 
 * Mengikuti prinsip:
 * - SRP: Hanya menangani change email
 * - DRY: Reusable error handling
 * - KISS: Interface API yang sederhana
 * - SOLID: Dependency injection dan separation of concerns
 */

import { NextRequest, NextResponse } from 'next/server'
import { usersEmailService } from '@/services/database/users/email.service'

/**
 * Interface untuk request body
 */
interface ChangeEmailRequest {
  newEmail: string
  password: string
}

/**
 * POST /api/users/[id]/email/change
 * Mengubah email user
 * 
 * @param request - Next.js request object
 * @param params - Route parameters
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Parse parameters
    const { id } = await params
    const userId = parseInt(id, 10)

    // Validasi user ID
    if (isNaN(userId) || userId <= 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid user ID',
          message: 'ID user tidak valid'
        },
        { status: 400 }
      )
    }

    // Parse request body
    let body: ChangeEmailRequest
    try {
      body = await request.json()
    } catch (error) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid JSON',
          message: 'Format data tidak valid'
        },
        { status: 400 }
      )
    }

    // Validasi request body
    if (!body.newEmail || !body.password) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required fields',
          message: 'Email baru dan password wajib diisi'
        },
        { status: 400 }
      )
    }

    // Validasi email format
    const emailValidation = await usersEmailService.validateEmailFormat(body.newEmail)
    if (!emailValidation.isValid) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid email format',
          message: emailValidation.message || 'Format email tidak valid'
        },
        { status: 400 }
      )
    }

    // Check email availability
    const availabilityCheck = await usersEmailService.checkEmailAvailability(body.newEmail)
    if (!availabilityCheck.isValid) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Email not available',
          message: availabilityCheck.message || 'Email sudah digunakan'
        },
        { status: 400 }
      )
    }

    // Change email menggunakan service
    const result = await usersEmailService.changeEmail({
      userId,
      currentPassword: body.password,
      newEmail: body.newEmail
    })

    return NextResponse.json({
      success: true,
      message: 'Email berhasil diubah',
      data: result
    })

  } catch (error: unknown) {
    const apiError = error as { message?: string }
    console.error('Error changing email:', error)

    // Handle specific errors
    if (apiError.message?.includes('password')) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid password',
          message: 'Password salah'
        },
        { status: 400 }
      )
    }

    if (apiError.message?.includes('email sudah')) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Email already exists',
          message: 'Email sudah digunakan oleh user lain'
        },
        { status: 400 }
      )
    }

    if (apiError.message?.includes('tidak ditemukan')) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'User not found',
          message: 'User tidak ditemukan'
        },
        { status: 404 }
      )
    }

    // Generic error
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error',
        message: 'Terjadi kesalahan server. Silakan coba lagi.'
      },
      { status: 500 }
    )
  }
}

/**
 * Handle method not allowed
 */
export async function GET() {
  return NextResponse.json(
    { 
      success: false, 
      error: 'Method not allowed',
      message: 'Metode GET tidak diizinkan'
    },
    { status: 405 }
  )
}

export async function PUT() {
  return NextResponse.json(
    { 
      success: false, 
      error: 'Method not allowed',
      message: 'Metode PUT tidak diizinkan'
    },
    { status: 405 }
  )
}

export async function DELETE() {
  return NextResponse.json(
    { 
      success: false, 
      error: 'Method not allowed',
      message: 'Metode DELETE tidak diizinkan'
    },
    { status: 405 }
  )
}