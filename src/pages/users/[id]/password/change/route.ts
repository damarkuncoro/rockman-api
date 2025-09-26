/**
 * API Route: Change User Password
 * 
 * Domain: User Management - Password Security
 * Responsibility: Handle password change requests
 * 
 * Mengikuti prinsip:
 * - SRP: Hanya menangani change password
 * - DRY: Reusable error handling
 * - KISS: Interface API yang sederhana
 * - SOLID: Dependency injection dan separation of concerns
 */

import { NextRequest, NextResponse } from 'next/server'
import { usersPasswordService } from '@/services/database/users/password.service'

/**
 * Interface untuk request body
 */
interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
}

/**
 * POST /api/users/[id]/password/change
 * Mengubah password user
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
    let body: ChangePasswordRequest
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
    if (!body.currentPassword || !body.newPassword) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required fields',
          message: 'Password saat ini dan password baru wajib diisi'
        },
        { status: 400 }
      )
    }

    // Validasi password length
    if (body.currentPassword.length < 6) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Current password too short',
          message: 'Password saat ini minimal 6 karakter'
        },
        { status: 400 }
      )
    }

    if (body.newPassword.length < 8) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'New password too short',
          message: 'Password baru minimal 8 karakter'
        },
        { status: 400 }
      )
    }

    // Validasi password tidak sama
    if (body.currentPassword === body.newPassword) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Same password',
          message: 'Password baru harus berbeda dengan password saat ini'
        },
        { status: 400 }
      )
    }

    // Change password menggunakan service
    const result = await usersPasswordService.changePassword({
      userId,
      currentPassword: body.currentPassword,
      newPassword: body.newPassword
    })

    return NextResponse.json({
      success: true,
      message: 'Password berhasil diubah',
      data: result
    })

  } catch (error: unknown) {
    const apiError = error as { message?: string }
    console.error('Error changing password:', error)

    // Handle specific errors
    if (apiError.message?.includes('password saat ini')) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid current password',
          message: 'Password saat ini salah'
        },
        { status: 400 }
      )
    }

    if (apiError.message?.includes('lemah')) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Weak password',
          message: 'Password baru terlalu lemah'
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