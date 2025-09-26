/**
 * API Route v1: User Phones - GET All
 * 
 * Domain: User Management - Phone Operations
 * Responsibility: Handle GET requests untuk mengambil nomor telepon user
 * 
 * Mengikuti prinsip:
 * - SRP: Hanya menangani operasi GET nomor telepon user
 * - DRY: Reusable error handling dan validation
 * - KISS: Interface API yang sederhana dan konsisten
 * - SOLID: Dependency injection dan separation of concerns
 * - RESTful: Menggunakan HTTP methods sesuai standar
 */

import { NextRequest, NextResponse } from 'next/server'
import { userPhonesRepository } from '@/repositories/user_phones'
import { addCorsHeaders } from '@/utils/cors'

/**
 * Interface untuk API response
 */
interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  message?: string
  error?: string
  count?: number
}

/**
 * GET /api/v1/user-phones
 * Mengambil nomor telepon user berdasarkan userId dari query parameter
 * 
 * Query Parameters:
 * - userId: ID user yang nomor teleponnya akan diambil (optional, jika tidak ada akan mengambil semua nomor)
 * - includeInactive: Include nomor telepon yang tidak aktif (optional, default: false)
 * 
 * @param request - Next.js request object
 * @returns Response dengan data nomor telepon user atau error
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    console.log('🔍 GET /api/v1/user-phones called')

    // Ambil parameter dari query string
    const { searchParams } = new URL(request.url)
    const userIdParam = searchParams.get('userId')
    const includeInactive = searchParams.get('includeInactive') === 'true'

    // Validasi format userId jika disediakan
    if (userIdParam && (isNaN(Number(userIdParam)) || Number(userIdParam) <= 0)) {
      const response: ApiResponse = {
        success: false,
        error: 'Invalid userId format. Must be a positive number.'
      }
      
      return addCorsHeaders(
        NextResponse.json(response, { status: 400 })
      )
    }

    let phones
    let count = 0

    if (userIdParam) {
      // Ambil nomor telepon untuk user tertentu
      const userId = Number(userIdParam)
      phones = await userPhonesRepository.findByUserId(userId, includeInactive)
      count = phones.length
      
      console.log(`📱 Found ${count} phones for user ${userId}`)
    } else {
      // Jika tidak ada userId, ambil semua nomor telepon (untuk admin)
      phones = await userPhonesRepository.SELECT.All()
      count = phones.length
      
      console.log(`📱 Found ${count} total phones`)
    }

    const response: ApiResponse = {
      success: true,
      data: phones,
      count,
      message: count > 0 ? 'Phones retrieved successfully' : 'No phones found'
    }

    return addCorsHeaders(
      NextResponse.json(response, { status: 200 })
    )

  } catch (error) {
    console.error('❌ Error in GET /api/v1/user-phones:', error)
    
    const response: ApiResponse = {
      success: false,
      error: 'Internal server error while fetching phones',
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    }

    return addCorsHeaders(
      NextResponse.json(response, { status: 500 })
    )
  }
}