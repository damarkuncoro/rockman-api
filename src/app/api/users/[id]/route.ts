/**
 * User API Endpoint
 * 
 * Domain: User Management - User Data
 * Responsibility: API endpoint untuk mengambil data user berdasarkan ID
 * 
 * Mengikuti prinsip:
 * - SRP: Hanya menangani operasi GET user by ID
 * - DRY: Reusable endpoint untuk berbagai kebutuhan user data
 * - KISS: Interface API yang sederhana
 * - SOLID: Dependency injection dan separation of concerns
 */

import { NextRequest, NextResponse } from 'next/server'
import { usersService } from '@/services/database/users/users.service'
import { UserDetailData } from '@/services/frontend/api/users/shared/types'

/**
 * Interface untuk parameter request
 */
interface RequestParams {
  params: Promise<{
    id: string
  }>
}

/**
 * GET /api/users/[id]
 * Mengambil data user berdasarkan ID
 * 
 * @param request - Next.js request object
 * @param params - Route parameters containing user ID
 * @returns Response dengan data user atau error
 */
export async function GET(
  request: NextRequest,
  { params }: RequestParams
): Promise<NextResponse> {
  try {
    // Validasi parameter ID
    const userId = parseInt((await params).id)
    if (isNaN(userId) || userId <= 0) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'ID user tidak valid' 
        },
        { status: 400 }
      )
    }

    // Ambil data user
    const user = await usersService.GET.ById(userId)
    
    if (!user) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'User tidak ditemukan' 
        },
        { status: 404 }
      )
    }

    // Transform data ke format UserDetailData untuk client-side
    const userDetailData: UserDetailData = {
      id: user.id,
      name: user.name,
      email: user.email,
      active: user.active ?? null,
      departmentId: user.departmentId ?? null,
      region: user.region ?? null,
      level: user.level ?? null,
      rolesUpdatedAt: user.rolesUpdatedAt ?? null,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }

    // Return success response
    return NextResponse.json(userDetailData)

  } catch (error: unknown) {
    const apiError = error as { message?: string }
    console.error('Error updating user:', error)
    
    // Handle specific errors
    if (apiError.message?.includes('not found')) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'User tidak ditemukan' 
        },
        { status: 404 }
      )
    }

    // Handle general errors
    return NextResponse.json(
      { 
        success: false, 
        message: 'Terjadi kesalahan saat mengambil data user' 
      },
      { status: 500 }
    )
  }
}

/**
 * Handle method not allowed
 */
export async function POST() {
  return NextResponse.json(
    { success: false, message: 'Method not allowed' },
    { status: 405 }
  )
}

export async function PUT() {
  return NextResponse.json(
    { success: false, message: 'Method not allowed' },
    { status: 405 }
  )
}

export async function DELETE() {
  return NextResponse.json(
    { success: false, message: 'Method not allowed' },
    { status: 405 }
  )
}