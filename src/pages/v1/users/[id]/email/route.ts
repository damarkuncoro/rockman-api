/**
 * API Route v1: User Email Management
 * 
 * Domain: User Management - Email Operations
 * Responsibility: Handle email-related operations (GET, PUT)
 * 
 * Mengikuti prinsip:
 * - SRP: Hanya menangani operasi email user
 * - DRY: Reusable error handling dan validation
 * - KISS: Interface API yang sederhana dan konsisten
 * - SOLID: Dependency injection dan separation of concerns
 * - RESTful: Menggunakan HTTP methods sesuai standar
 */

import { NextRequest, NextResponse } from 'next/server'
import { usersEmailService } from '@/services/database/users/email.service'
import { usersService } from '@/services/database/users/users.service'

/**
 * Interface untuk request body PUT
 */
interface UpdateEmailRequest {
  newEmail: string
  currentPassword: string
}

/**
 * Interface untuk response data
 */
interface EmailResponse {
  id: number
  email: string
  isVerified: boolean
  updatedAt: string
}

/**
 * GET /api/v1/users/[id]/email
 * Mengambil informasi email user
 * 
 * @param request - Next.js request object
 * @param params - Route parameters
 */
export async function GET(
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
          error: 'INVALID_USER_ID',
          message: 'ID user tidak valid'
        },
        { status: 400 }
      )
    }

    // Ambil informasi user untuk mendapatkan email
    const user = await usersService.GET.ById(userId)
    
    if (!user) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'USER_NOT_FOUND',
          message: 'User tidak ditemukan'
        },
        { status: 404 }
      )
    }

    const response: EmailResponse = {
      id: user.id,
      email: user.email,
      isVerified: false, // Untuk sementara set false, bisa disesuaikan dengan schema
      updatedAt: user.updatedAt?.toISOString() || new Date().toISOString()
    }

    return NextResponse.json({
      success: true,
      data: response
    })

  } catch (error: unknown) {
    console.error('Error getting user email:', error)

    return NextResponse.json(
      { 
        success: false, 
        error: 'INTERNAL_SERVER_ERROR',
        message: 'Terjadi kesalahan server. Silakan coba lagi.'
      },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/v1/users/[id]/email
 * Mengubah email user
 * 
 * @param request - Next.js request object
 * @param params - Route parameters
 */
export async function PUT(
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
          error: 'INVALID_USER_ID',
          message: 'ID user tidak valid'
        },
        { status: 400 }
      )
    }

    // Parse request body
    let body: UpdateEmailRequest
    try {
      body = await request.json()
    } catch (error) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'INVALID_JSON',
          message: 'Format data tidak valid'
        },
        { status: 400 }
      )
    }

    // Validasi request body
    if (!body.newEmail || !body.currentPassword) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'MISSING_REQUIRED_FIELDS',
          message: 'Email baru dan password saat ini wajib diisi'
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
          error: 'INVALID_EMAIL_FORMAT',
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
          error: 'EMAIL_NOT_AVAILABLE',
          message: availabilityCheck.message || 'Email sudah digunakan'
        },
        { status: 400 }
      )
    }

    // Update email menggunakan service
    const result = await usersEmailService.changeEmail({
      userId,
      newEmail: body.newEmail,
      currentPassword: body.currentPassword
    })

    if (!result.isValid) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'CHANGE_EMAIL_FAILED',
          message: result.message
        },
        { status: 400 }
      )
    }

    // Ambil data user terbaru setelah update
    const updatedUser = await usersService.GET.ById(userId)
    
    const response: EmailResponse = {
      id: updatedUser!.id,
      email: updatedUser!.email,
      isVerified: false, // Email baru perlu diverifikasi ulang
      updatedAt: updatedUser!.updatedAt?.toISOString() || new Date().toISOString()
    }

    return NextResponse.json({
      success: true,
      message: 'Email berhasil diubah',
      data: response
    })

  } catch (error: unknown) {
    const apiError = error as { message?: string }
    console.error('Error updating email:', error)

    // Handle specific errors
    if (apiError.message?.includes('password')) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'INVALID_PASSWORD',
          message: 'Password salah'
        },
        { status: 400 }
      )
    }

    if (apiError.message?.includes('email sudah')) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'EMAIL_ALREADY_EXISTS',
          message: 'Email sudah digunakan oleh user lain'
        },
        { status: 400 }
      )
    }

    if (apiError.message?.includes('tidak ditemukan')) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'USER_NOT_FOUND',
          message: 'User tidak ditemukan'
        },
        { status: 404 }
      )
    }

    // Generic error
    return NextResponse.json(
      { 
        success: false, 
        error: 'INTERNAL_SERVER_ERROR',
        message: 'Terjadi kesalahan server. Silakan coba lagi.'
      },
      { status: 500 }
    )
  }
}

/**
 * Handle method not allowed untuk POST
 */
export async function POST() {
  return NextResponse.json(
    { 
      success: false, 
      error: 'METHOD_NOT_ALLOWED',
      message: 'Metode POST tidak diizinkan. Gunakan PUT untuk update email.'
    },
    { status: 405 }
  )
}

/**
 * Handle method not allowed untuk DELETE
 */
export async function DELETE() {
  return NextResponse.json(
    { 
      success: false, 
      error: 'METHOD_NOT_ALLOWED',
      message: 'Metode DELETE tidak diizinkan'
    },
    { status: 405 }
  )
}