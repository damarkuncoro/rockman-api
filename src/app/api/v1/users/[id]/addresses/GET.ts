/**
 * API Route v1: Users/[id]/Addresses - GET
 * 
 * Domain: User Management - Address Operations
 * Responsibility: Handle GET requests untuk mengambil alamat user berdasarkan ID
 * 
 * Mengikuti prinsip:
 * - SRP: Hanya menangani operasi GET alamat user berdasarkan ID
 * - DRY: Reusable error handling dan validation
 * - KISS: Interface API yang sederhana dan konsisten
 * - SOLID: Dependency injection dan separation of concerns
 * - RESTful: Menggunakan HTTP methods sesuai standar
 */

import { NextRequest, NextResponse } from "next/server"
import { userAddressesRepository } from "@/repositories/user_addresses"
import { createCorsResponse } from "@/utils/cors"

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
 * GET /api/v1/users/[id]/addresses
 * Mengambil alamat user berdasarkan user ID dari parameter URL
 * 
 * Query Parameters:
 * - includeInactive: Include alamat yang tidak aktif (optional, default: false)
 * 
 * @param request - Next.js request object
 * @param params - Route parameters containing the user ID
 * @returns Response dengan data alamat user atau error
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    console.log('🔍 GET /api/v1/users/[id]/addresses called')

    // Resolve params dari Promise
    const resolvedParams = await params
    const userId = parseInt(resolvedParams.id)

    // Validasi ID - PostgreSQL integer range: -2147483648 to 2147483647
    if (isNaN(userId) || userId <= 0) {
      const response: ApiResponse = {
        success: false,
        error: 'Invalid user ID. Must be a positive number.'
      }
      return createCorsResponse(response, { status: 400 })
    }

    // Validasi PostgreSQL integer overflow
    if (userId > 2147483647) {
      const response: ApiResponse = {
        success: false,
        error: 'User ID is too large. Maximum value is 2147483647.'
      }
      return createCorsResponse(response, { status: 400 })
    }

    // Ambil parameter dari query string
    const { searchParams } = new URL(request.url)
    const includeInactive = searchParams.get('includeInactive') === 'true'

    console.log(`📋 Fetching addresses for user ID: ${userId}, includeInactive: ${includeInactive}`)

    // Ambil alamat user dari repository
    const addresses = await userAddressesRepository.findByUserId(userId, includeInactive)

    // Jika tidak ada alamat ditemukan
    if (!addresses || addresses.length === 0) {
      const response: ApiResponse = {
        success: true,
        data: [],
        message: `Tidak ada alamat ditemukan untuk user ID ${userId}`,
        count: 0
      }
      return createCorsResponse(response)
    }

    // Response sukses dengan data alamat
    const response: ApiResponse = {
      success: true,
      data: addresses,
      message: `Berhasil mengambil ${addresses.length} alamat untuk user ID ${userId}`,
      count: addresses.length
    }

    console.log(`✅ Successfully fetched ${addresses.length} addresses for user ID: ${userId}`)
    return createCorsResponse(response)

  } catch (error) {
    console.error('❌ Error fetching user addresses:', error)
    
    const response: ApiResponse = {
      success: false,
      error: 'Internal server error'
    }
    
    return createCorsResponse(response, { status: 500 })
  }
}