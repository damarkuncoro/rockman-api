/**
 * API Route v1: User Addresses - GET by ID
 * 
 * Domain: User Management - Address Operations
 * Responsibility: Handle GET requests untuk mengambil alamat user berdasarkan ID
 * 
 * Mengikuti prinsip:
 * - SRP: Hanya menangani operasi GET alamat by ID
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
 * GET /api/v1/user_addresses/[id]
 * Mengambil alamat user berdasarkan ID
 * 
 * Query Parameters:
 * - userId: ID user pemilik alamat (required untuk validasi ownership)
 * 
 * @param request - Next.js request object
 * @param params - Route parameters containing address ID
 * @returns Response dengan data alamat atau error
 */
export async function GET(
  request: NextRequest,
  { params }: RequestParams
): Promise<NextResponse> {
  try {
    console.log('🔍 GET /api/v1/user_addresses/[id] called')

    // Validasi parameter ID
    const addressId = parseInt((await params).id)
    if (isNaN(addressId) || addressId <= 0) {
      return addCorsHeaders(NextResponse.json({
        success: false,
        error: 'ID alamat tidak valid',
        message: 'ID alamat harus berupa angka positif'
      }, { status: 400 }))
    }

    // Ambil userId dari query parameter untuk validasi ownership
    const { searchParams } = new URL(request.url)
    const userIdParam = searchParams.get('userId')

    if (!userIdParam) {
      return addCorsHeaders(NextResponse.json({
        success: false,
        error: 'Parameter userId diperlukan',
        message: 'Silakan sertakan userId dalam query parameter'
      }, { status: 400 }))
    }

    const userId = parseInt(userIdParam)
    if (isNaN(userId) || userId <= 0) {
      return addCorsHeaders(NextResponse.json({
        success: false,
        error: 'Parameter userId tidak valid',
        message: 'userId harus berupa angka positif'
      }, { status: 400 }))
    }

    console.log(`🎯 Fetching address ID: ${addressId} for user ID: ${userId}`)

    // Validasi ownership alamat
    const isOwner = await userAddressesRepository.validateOwnership(addressId, userId)
    if (!isOwner) {
      return addCorsHeaders(NextResponse.json({
        success: false,
        error: 'Alamat tidak ditemukan',
        message: 'Alamat tidak ditemukan atau Anda tidak memiliki akses'
      }, { status: 404 }))
    }

    // Ambil alamat dari repository
    const address = await userAddressesRepository.SELECT.ById(addressId)

    if (!address) {
      return addCorsHeaders(NextResponse.json({
        success: false,
        error: 'Alamat tidak ditemukan',
        message: 'Alamat dengan ID tersebut tidak ditemukan'
      }, { status: 404 }))
    }

    console.log(`✅ Address found: ${address.label}`)

    // Return success response
    const response: ApiResponse = {
      success: true,
      data: address,
      message: 'Alamat berhasil ditemukan'
    }

    return addCorsHeaders(NextResponse.json(response))

  } catch (error: unknown) {
    console.error('❌ Error in GET /api/v1/user_addresses/[id]:', error)
    
    const apiError = error as { message?: string }
    const errorMessage = apiError.message || 'Terjadi kesalahan saat mengambil alamat'

    return addCorsHeaders(NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: errorMessage
    }, { status: 500 }))
  }
}