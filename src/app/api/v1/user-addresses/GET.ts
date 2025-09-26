/**
 * API Route v1: User Addresses - GET All
 * 
 * Domain: User Management - Address Operations
 * Responsibility: Handle GET requests untuk mengambil alamat user
 * 
 * Mengikuti prinsip:
 * - SRP: Hanya menangani operasi GET alamat user
 * - DRY: Reusable error handling dan validation
 * - KISS: Interface API yang sederhana dan konsisten
 * - SOLID: Dependency injection dan separation of concerns
 * - RESTful: Menggunakan HTTP methods sesuai standar
 */

import { NextRequest, NextResponse } from 'next/server'
import { userAddressesRepository } from '@/repositories/user_addresses'
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
 * GET /api/v1/user_addresses
 * Mengambil alamat user berdasarkan userId dari query parameter
 * 
 * Query Parameters:
 * - userId: ID user yang alamatnya akan diambil (optional, jika tidak ada akan mengambil semua alamat)
 * - includeInactive: Include alamat yang tidak aktif (optional, default: false)
 * 
 * @param request - Next.js request object
 * @returns Response dengan data alamat user atau error
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    console.log('🔍 GET /api/v1/user_addresses called')

    // Ambil parameter dari query string
    const { searchParams } = new URL(request.url)
    const userIdParam = searchParams.get('userId')
    const includeInactive = searchParams.get('includeInactive') === 'true'

    // Validasi format userId jika disediakan
    let userId: number | null = null
    if (userIdParam) {
      userId = parseInt(userIdParam)
      if (isNaN(userId) || userId <= 0) {
        return addCorsHeaders(NextResponse.json({
          success: false,
          error: 'Parameter userId tidak valid',
          message: 'userId harus berupa angka positif'
        }, { status: 400 }))
      }
      console.log(`🎯 Fetching addresses for user ID: ${userId}`)
    } else {
      console.log('🎯 Fetching all addresses')
    }

    // Ambil alamat user dari repository
    const addresses = userId 
      ? await userAddressesRepository.findByUserId(userId, includeInactive)
      : await userAddressesRepository.SELECT.All()

    // Filter alamat tidak aktif jika tidak diminta dan tidak ada userId
    const filteredAddresses = !userId && !includeInactive 
      ? addresses.filter((addr: any) => addr.isActive)
      : addresses

    console.log(`✅ Found ${filteredAddresses.length} addresses for user ${userId}`)

    // Return success response
    const response: ApiResponse = {
      success: true,
      data: filteredAddresses,
      count: filteredAddresses.length,
      message: filteredAddresses.length > 0 
        ? `Berhasil mengambil ${filteredAddresses.length} alamat` 
        : 'Tidak ada alamat ditemukan'
    }

    return addCorsHeaders(NextResponse.json(response))

  } catch (error: unknown) {
    console.error('❌ Error in GET /api/v1/user_addresses:', error)
    
    const apiError = error as { message?: string }
    const errorMessage = apiError.message || 'Terjadi kesalahan saat mengambil alamat'

    return addCorsHeaders(NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: errorMessage
    }, { status: 500 }))
  }
}