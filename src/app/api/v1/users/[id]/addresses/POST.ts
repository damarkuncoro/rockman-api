/**
 * API Route v1: Users/[id]/Addresses - POST Create
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
 * Interface untuk parameter request
 */
interface RequestParams {
  params: Promise<{
    id: string
  }>
}

/**
 * POST /api/v1/users/[id]/addresses
 * Membuat alamat user baru
 * 
 * Request Body:
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
 * @param params - Route parameters containing user ID
 * @returns Response dengan data alamat yang dibuat atau error
 */
export async function POST(
  request: NextRequest,
  { params }: RequestParams
): Promise<NextResponse> {
  try {
    console.log('🔍 POST /api/v1/users/[id]/addresses called')

    // Validasi parameter userId
    const userId = parseInt((await params).id)
    if (isNaN(userId) || userId <= 0) {
      return addCorsHeaders(NextResponse.json({
        success: false,
        error: 'ID user tidak valid',
        message: 'ID user harus berupa angka positif'
      }, { status: 400 }))
    }

    // Validasi batas integer PostgreSQL (2^31 - 1)
    if (userId > 2147483647) {
      return addCorsHeaders(NextResponse.json({
        success: false,
        error: 'ID user terlalu besar',
        message: 'ID user melebihi batas maksimum yang diizinkan'
      }, { status: 400 }))
    }

    // Parse request body
    const requestBody = await request.json()
    
    // Validasi data menggunakan schema (tanpa userId dulu)
    const validationResult = createUserAddressSchema.safeParse(requestBody)
    if (!validationResult.success) {
      const errorMessages = validationResult.error.issues.map((err: any) => 
        `${err.path.join('.')}: ${err.message}`
      ).join(', ')
      
      return addCorsHeaders(NextResponse.json({
        success: false,
        error: 'Data tidak valid',
        message: errorMessages
      }, { status: 400 }))
    }

    // Tambahkan userId ke data yang sudah divalidasi
    const addressData = {
      ...validationResult.data,
      userId
    }

    // Buat alamat baru menggunakan repository
    const newAddress = await userAddressesRepository.createAddress(addressData)

    console.log('✅ Address created successfully:', newAddress.id)

    return addCorsHeaders(NextResponse.json({
      success: true,
      data: newAddress,
      message: 'Alamat berhasil ditambahkan'
    }, { status: 201 }))

  } catch (error) {
    console.error('❌ Error creating address:', error)
    
    return addCorsHeaders(NextResponse.json({
      success: false,
      error: 'Terjadi kesalahan server',
      message: 'Gagal menambahkan alamat. Silakan coba lagi.'
    }, { status: 500 }))
  }
}