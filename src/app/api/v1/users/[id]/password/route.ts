/**
 * API Route v1: User Password Management
 * 
 * Domain: Authentication & Security
 * Responsibility: Handle password-related operations (GET, PUT)
 * 
 * Mengikuti prinsip:
 * - SRP: Hanya menangani operasi password user
 * - DRY: Reusable error handling dan validation
 * - KISS: Interface API yang sederhana dan konsisten
 * - SOLID: Dependency injection dan separation of concerns
 * - RESTful: Menggunakan HTTP methods sesuai standar
 */

import { NextRequest, NextResponse } from 'next/server'
import { usersPasswordService } from '@/services/database/users/password.service'
import { usersService } from '@/services/database/users/users.service'

/**
 * Interface untuk request body PUT
 */
interface UpdatePasswordRequest {
  currentPassword: string
  newPassword: string
}

/**
 * Interface untuk response data
 */
interface PasswordResponse {
  id: number
  message: string
  updatedAt: string
}

/**
 * GET /api/v1/users/[id]/password
 * Mengambil informasi password status user (tanpa password hash)
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

    // Ambil informasi user untuk memastikan user ada
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

    // Return informasi password status (tanpa hash)
    const response = {
      id: user.id,
      hasPassword: !!user.passwordHash,
      lastUpdated: user.updatedAt?.toISOString() || new Date().toISOString()
    }

    return NextResponse.json({
      success: true,
      data: response
    })

  } catch (error: unknown) {
    console.error('Error getting user password info:', error)

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
 * PUT /api/v1/users/[id]/password
 * Mengubah password user
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
    let body: UpdatePasswordRequest
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
    if (!body.currentPassword || !body.newPassword) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'MISSING_REQUIRED_FIELDS',
          message: 'Password lama dan password baru wajib diisi'
        },
        { status: 400 }
      )
    }

    // Update password menggunakan service
    const result = await usersPasswordService.changePassword({
      userId,
      currentPassword: body.currentPassword,
      newPassword: body.newPassword
    })

    if (!result.isValid) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'CHANGE_PASSWORD_FAILED',
          message: result.message
        },
        { status: 400 }
      )
    }

    // Ambil data user terbaru setelah update
    const updatedUser = await usersService.GET.ById(userId)
    
    const response: PasswordResponse = {
      id: updatedUser!.id,
      message: result.message,
      updatedAt: updatedUser!.updatedAt?.toISOString() || new Date().toISOString()
    }

    return NextResponse.json({
      success: true,
      message: 'Password berhasil diubah',
      data: response
    })

  } catch (error: unknown) {
    const apiError = error as { message?: string }
    console.error('Error updating password:', error)

    // Handle specific errors
    if (apiError.message?.includes('password lama')) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'INVALID_CURRENT_PASSWORD',
          message: 'Password lama tidak sesuai'
        },
        { status: 400 }
      )
    }

    if (apiError.message?.includes('kriteria keamanan')) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'WEAK_PASSWORD',
          message: 'Password baru tidak memenuhi kriteria keamanan'
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
      message: 'Metode POST tidak diizinkan. Gunakan PUT untuk update password.'
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