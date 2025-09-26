/**
 * API Route: Validate Email
 * 
 * Domain: User Management - Email Validation
 * Responsibility: Handle email validation requests
 * 
 * Mengikuti prinsip:
 * - SRP: Hanya menangani validasi email
 * - DRY: Reusable validation logic
 * - KISS: Interface API yang sederhana
 * - SOLID: Dependency injection dan separation of concerns
 */

import { NextRequest, NextResponse } from 'next/server'
import { usersEmailService } from '@/services/database/users/email.service'

/**
 * Interface untuk request body
 */
interface ValidateEmailRequest {
  email: string
}

/**
 * POST /api/users/[id]/email/validate
 * Validasi format dan ketersediaan email
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
    let body: ValidateEmailRequest
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
    if (!body.email) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing email',
          message: 'Email wajib diisi'
        },
        { status: 400 }
      )
    }

    // Validasi format email
    const formatValidation = await usersEmailService.validateEmailFormat(body.email)
    if (!formatValidation.isValid) {
      return NextResponse.json({
        success: false,
        validation: {
          isValid: false,
          message: formatValidation.message || 'Format email tidak valid',
          type: 'format'
        }
      })
    }

    // Check ketersediaan email
    const availabilityCheck = await usersEmailService.checkEmailAvailability(body.email)
    if (!availabilityCheck.isValid) {
      return NextResponse.json({
        success: false,
        validation: {
          isValid: false,
          message: availabilityCheck.message || 'Email sudah digunakan',
          type: 'availability'
        }
      })
    }

    // Email valid dan tersedia
    return NextResponse.json({
      success: true,
      validation: {
        isValid: true,
        message: 'Email valid dan tersedia',
        type: 'success'
      }
    })

  } catch (error: unknown) {
    const apiError = error as { message?: string }
    console.error('Error validating email:', error)

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