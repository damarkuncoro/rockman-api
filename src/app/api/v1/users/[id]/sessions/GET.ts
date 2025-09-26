import { NextRequest, NextResponse } from "next/server"
import { sessionsService } from "@/services/database/sessions/sessions.service"
import { createCorsResponse } from "@/utils/cors"

/**
 * GET /api/v1/users/[id]/sessions - Mengambil sessions berdasarkan user ID
 * 
 * Domain: User Management - Session Data
 * Responsibility: API endpoint untuk mengambil semua sessions milik user tertentu
 * 
 * Mengikuti prinsip:
 * - SRP: Hanya menangani operasi GET sessions by user ID
 * - DRY: Reusable endpoint untuk berbagai kebutuhan session data
 * - KISS: Interface API yang sederhana
 * - SOLID: Dependency injection dan separation of concerns
 * 
 * @param req - NextRequest object
 * @param params - Object yang berisi parameter user ID
 * @returns Promise<NextResponse> - Response dengan sessions atau error
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Validasi parameter ID
    const userId = parseInt((await params).id)
    
    if (isNaN(userId) || userId <= 0) {
      return createCorsResponse(
        { 
          success: false,
          error: 'Invalid user ID format',
          message: 'User ID harus berupa angka positif'
        },
        { status: 400 }
      )
    }

    // Validasi PostgreSQL integer overflow
    if (userId > 2147483647) {
      return createCorsResponse(
        { 
          success: false,
          error: 'User ID too large',
          message: 'User ID terlalu besar. Maksimum 2147483647'
        },
        { status: 400 }
      )
    }

    // Ambil sessions berdasarkan user ID menggunakan service method
    const sessions = await sessionsService.findByUserId(userId)
    
    // Return success response dengan CORS headers
    return createCorsResponse({
      success: true,
      data: sessions,
      total: sessions.length,
      userId: userId
    })

  } catch (error: unknown) {
    console.error('Error fetching sessions by user ID:', error)
    
    const apiError = error as { message?: string }
    return createCorsResponse(
      { 
        success: false,
        error: 'Failed to fetch sessions',
        message: apiError.message || 'Terjadi kesalahan saat mengambil data sessions'
      },
      { status: 500 }
    )
  }
}