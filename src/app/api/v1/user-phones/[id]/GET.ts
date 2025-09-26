/**
 * API Route v1: User Phones - GET by ID
 * 
 * Domain: User Management - Phone Operations
 * Responsibility: Handle GET requests untuk mengambil nomor telepon user berdasarkan ID
 * 
 * Mengikuti prinsip:
 * - SRP: Hanya menangani operasi GET nomor telepon by ID
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
}

/**
 * Interface untuk parameter request
 */
interface RequestParams {
  params: Promise<{
    id: string
  }>
}

/**
 * GET /api/v1/user-phones/[id]
 * Mengambil nomor telepon user berdasarkan ID
 * 
 * Query Parameters:
 * - userId: ID user pemilik nomor telepon (required untuk validasi ownership)
 * 
 * @param request - Next.js request object
 * @param params - Route parameters containing phone ID
 * @returns Response dengan data nomor telepon atau error
 */
export async function GET(
  request: NextRequest,
  { params }: RequestParams
): Promise<NextResponse> {
  try {
    console.log('📱 GET /api/v1/user-phones/[id] called')

    // Resolve params
    const resolvedParams = await params
    const phoneId = parseInt(resolvedParams.id)
    
    if (isNaN(phoneId)) {
      const response: ApiResponse = {
        success: false,
        error: 'Invalid phone ID'
      }
      
      return addCorsHeaders(
        NextResponse.json(response, { status: 400 })
      )
    }

    // Get userId from query parameters
    const url = new URL(request.url)
    const userIdParam = url.searchParams.get('userId')
    
    if (!userIdParam) {
      const response: ApiResponse = {
        success: false,
        error: 'userId query parameter is required'
      }
      
      return addCorsHeaders(
        NextResponse.json(response, { status: 400 })
      )
    }

    const userId = parseInt(userIdParam)
    
    if (isNaN(userId)) {
      const response: ApiResponse = {
        success: false,
        error: 'Invalid userId'
      }
      
      return addCorsHeaders(
        NextResponse.json(response, { status: 400 })
      )
    }

    // Validasi ownership
    const isOwner = await userPhonesRepository.validateOwnership(phoneId, userId)
    
    if (!isOwner) {
      const response: ApiResponse = {
        success: false,
        error: 'Phone not found or access denied'
      }
      
      return addCorsHeaders(
        NextResponse.json(response, { status: 404 })
      )
    }

    // Ambil nomor telepon berdasarkan ID
    const userPhones = await userPhonesRepository.findByUserId(userId, true)
    const phone = userPhones.find(p => p.id === phoneId)

    if (!phone) {
      const response: ApiResponse = {
        success: false,
        error: 'Phone not found'
      }
      
      return addCorsHeaders(
        NextResponse.json(response, { status: 404 })
      )
    }

    console.log('✅ Phone found:', phone.id)

    const response: ApiResponse = {
      success: true,
      data: phone,
      message: 'Phone retrieved successfully'
    }

    return addCorsHeaders(
      NextResponse.json(response, { status: 200 })
    )

  } catch (error) {
    console.error('❌ Error in GET /api/v1/user-phones/[id]:', error)
    
    const response: ApiResponse = {
      success: false,
      error: 'Internal server error while retrieving phone',
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    }

    return addCorsHeaders(
      NextResponse.json(response, { status: 500 })
    )
  }
}