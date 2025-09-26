/**
 * API Route v1: User Addresses - PATCH Set Default
 * 
 * Domain: User Management - Address Operations
 * Responsibility: Handle PATCH requests untuk mengubah alamat default user
 * 
 * Mengikuti prinsip:
 * - SRP: Hanya menangani operasi set default alamat
 * - DRY: Reusable error handling dan validation
 * - KISS: Interface API yang sederhana dan konsisten
 * - SOLID: Dependency injection dan separation of concerns
 * - RESTful: Menggunakan HTTP methods sesuai standar
 */

import { NextRequest, NextResponse } from 'next/server'
import { userAddressesRepository } from '@/repositories/user_addresses'
import { setDefaultAddressSchema } from '@/db/schema/user_addresses/validations/api_validation'
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
 * PATCH /api/v1/user_addresses/[id]
 * Mengubah alamat menjadi alamat default user
 * 
 * Query Parameters:
 * - userId: ID user pemilik alamat (required untuk validasi ownership)
 * 
 * Request Body:
 * - isDefault: boolean (harus true untuk set default)
 * 
 * @param request - Next.js request object
 * @param params - Route parameters containing address ID
 * @returns Response dengan data alamat yang diupdate atau error
 */
export async function PATCH(
  request: NextRequest,
  { params }: RequestParams
): Promise<NextResponse> {
  try {
    console.log('🔍 PATCH /api/v1/user_addresses/[id] called')

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

    console.log(`🎯 Setting default address ID: ${addressId} for user ID: ${userId}`)

    // Validasi ownership alamat
    const isOwner = await userAddressesRepository.validateOwnership(addressId, userId)
    if (!isOwner) {
      return addCorsHeaders(NextResponse.json({
        success: false,
        error: 'Alamat tidak ditemukan',
        message: 'Alamat tidak ditemukan atau Anda tidak memiliki akses'
      }, { status: 404 }))
    }

    // Parse request body
    const body = await request.json()
    console.log('📝 Request body received:', body)

    // Validasi request body menggunakan Zod schema
    const validationResult = setDefaultAddressSchema.safeParse(body)
    
    if (!validationResult.success) {
      console.log('❌ Validation failed:', validationResult.error.issues)
      
      return addCorsHeaders(NextResponse.json({
        success: false,
        error: 'Data tidak valid',
        message: 'Silakan periksa kembali data yang dikirim',
        details: validationResult.error.issues.map((err: any) => ({
          field: err.path.join('.'),
          message: err.message
        }))
      }, { status: 400 }))
    }

    const { addressId: bodyAddressId } = validationResult.data

    // Validasi bahwa addressId di body sama dengan parameter URL
    if (bodyAddressId !== addressId) {
      return addCorsHeaders(NextResponse.json({
        success: false,
        error: 'ID alamat tidak cocok',
        message: 'ID alamat di URL dan body request harus sama'
      }, { status: 400 }))
    }

    // Set alamat sebagai default menggunakan repository
    const defaultAddress = await userAddressesRepository.setAsDefault(addressId, userId)

    if (!defaultAddress) {
      return addCorsHeaders(NextResponse.json({
        success: false,
        error: 'Gagal mengatur alamat default',
        message: 'Alamat tidak dapat diatur sebagai default'
      }, { status: 500 }))
    }

    console.log(`✅ Default address set successfully: ${defaultAddress.label}`)

    // Return success response
    const response: ApiResponse = {
      success: true,
      data: defaultAddress,
      message: 'Alamat berhasil diatur sebagai default'
    }

    return addCorsHeaders(NextResponse.json(response))

  } catch (error: unknown) {
    console.error('❌ Error in PATCH /api/v1/user_addresses/[id]:', error)
    
    const apiError = error as { message?: string }
    let errorMessage = 'Terjadi kesalahan saat mengatur alamat default'
    let statusCode = 500

    // Handle specific error cases
    if (apiError.message?.includes('not found')) {
      errorMessage = 'Alamat tidak ditemukan'
      statusCode = 404
    }

    return addCorsHeaders(NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: errorMessage
    }, { status: statusCode }))
  }
}