/**
 * API Route v1: User Addresses - POST Create
 * 
 * Domain: User Management - Address Operations
 * Responsibility: Handle POST requests untuk membuat alamat user baru
 * 
 * Mengikuti prinsip:
 * - SRP: Hanya menangani operasi POST alamat user
 * - DRY: Reusable error handling dan validation
 * - KISS: Interface API yang sederhana dan konsisten
 * - SOLID: Dependency injection dan separation of concerns
 * - RESTful: Menggunakan HTTP methods sesuai standar
 */

import { NextRequest, NextResponse } from 'next/server'
import { userAddressesRepository } from '@/repositories/user_addresses'
import { createUserAddressSchema } from '@/db/schema/user_addresses/validations/api_validation'
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
 * POST /api/v1/user_addresses
 * Membuat alamat user baru
 * 
 * Request Body:
 * - userId: ID user pemilik alamat (required, dari query parameter)
 * - label: Label alamat (required)
 * - recipientName: Nama penerima (required)
 * - phoneNumber: Nomor telepon (required)
 * - addressLine1: Alamat baris 1 (required)
 * - addressLine2: Alamat baris 2 (optional)
 * - city: Kota (required)
 * - province: Provinsi (required)
 * - postalCode: Kode pos (required)
 * - country: Negara (optional, default: 'Indonesia')
 * - isDefault: Apakah alamat default (optional, default: false)
 * 
 * @param request - Next.js request object
 * @returns Response dengan data alamat yang dibuat atau error
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    console.log('🔍 POST /api/v1/user_addresses called')

    // Ambil userId dari query parameter
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

    // Parse request body
    const body = await request.json()
    console.log('📝 Request body received:', { ...body, phoneNumber: '***' })

    // Validasi request body menggunakan Zod schema
    const validationResult = createUserAddressSchema.safeParse(body)
    
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

    const addressData = validationResult.data
    console.log(`🎯 Creating address for user ID: ${userId}`)

    // Buat alamat baru menggunakan repository
    const newAddress = await userAddressesRepository.createAddress({
      userId,
      ...addressData,
      country: addressData.country || 'Indonesia',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })

    console.log(`✅ Address created successfully with ID: ${newAddress.id}`)

    // Return success response
    const response: ApiResponse = {
      success: true,
      data: newAddress,
      message: 'Alamat berhasil dibuat'
    }

    return addCorsHeaders(NextResponse.json(response, { status: 201 }))

  } catch (error: unknown) {
    console.error('❌ Error in POST /api/v1/user_addresses:', error)
    
    const apiError = error as { message?: string }
    let errorMessage = 'Terjadi kesalahan saat membuat alamat'
    let statusCode = 500

    // Handle specific error cases
    if (apiError.message?.includes('duplicate') || apiError.message?.includes('unique')) {
      errorMessage = 'Alamat dengan data yang sama sudah ada'
      statusCode = 409
    } else if (apiError.message?.includes('foreign key') || apiError.message?.includes('user')) {
      errorMessage = 'User tidak ditemukan'
      statusCode = 404
    }

    return addCorsHeaders(NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: errorMessage
    }, { status: statusCode }))
  }
}