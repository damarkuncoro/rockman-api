/**
 * API Route v1: Users/[id]/Addresses/[addressId] - PUT Update
 * 
 * Domain: User Management - Address Operations
 * Responsibility: Handle PUT requests untuk mengupdate alamat user berdasarkan ID
 * 
 * Mengikuti prinsip:
 * - SRP: Hanya menangani operasi PUT alamat by ID
 * - DRY: Reusable error handling dan validation
 * - KISS: Interface API yang sederhana dan konsisten
 * - SOLID: Dependency injection dan separation of concerns
 * - RESTful: Menggunakan HTTP methods sesuai standar
 */

import { NextRequest, NextResponse } from 'next/server'
import { userAddressesRepository } from '@/repositories/user_addresses'
import { updateUserAddressSchema } from '@/db/schema/user_addresses/validations/api_validation'
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
    addressId: string
  }>
}

/**
 * PUT /api/v1/users/[id]/addresses/[addressId]
 * Mengupdate alamat user berdasarkan ID
 * 
 * Request Body (semua optional):
 * - label: Label alamat
 * - recipientName: Nama penerima
 * - phoneNumber: Nomor telepon
 * - addressLine1: Alamat baris 1
 * - addressLine2: Alamat baris 2
 * - city: Kota
 * - province: Provinsi
 * - postalCode: Kode pos
 * - country: Negara
 * - isDefault: Apakah alamat default
 * 
 * @param request - Next.js request object
 * @param params - Route parameters containing user ID and address ID
 * @returns Response dengan data alamat yang diupdate atau error
 */
export async function PUT(
  request: NextRequest,
  { params }: RequestParams
): Promise<NextResponse> {
  try {
    console.log('🔍 PUT /api/v1/users/[id]/addresses/[addressId] called')

    // Validasi parameter userId
    const userId = parseInt((await params).id)
    if (isNaN(userId) || userId <= 0) {
      return addCorsHeaders(NextResponse.json({
        success: false,
        error: 'ID user tidak valid',
        message: 'ID user harus berupa angka positif'
      }, { status: 400 }))
    }

    // Validasi parameter addressId
    const addressId = parseInt((await params).addressId)
    if (isNaN(addressId) || addressId <= 0) {
      return addCorsHeaders(NextResponse.json({
        success: false,
        error: 'ID alamat tidak valid',
        message: 'ID alamat harus berupa angka positif'
      }, { status: 400 }))
    }

    // Validasi batas integer PostgreSQL (2^31 - 1)
    if (userId > 2147483647 || addressId > 2147483647) {
      return addCorsHeaders(NextResponse.json({
        success: false,
        error: 'ID terlalu besar',
        message: 'ID melebihi batas maksimum yang diizinkan'
      }, { status: 400 }))
    }

    // Parse request body
    const requestBody = await request.json()
    
    // Validasi data menggunakan schema
    const validationResult = updateUserAddressSchema.safeParse(requestBody)
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

    // Validasi ownership alamat
    const isOwner = await userAddressesRepository.validateOwnership(addressId, userId)
    if (!isOwner) {
      return addCorsHeaders(NextResponse.json({
        success: false,
        error: 'Alamat tidak ditemukan',
        message: 'Alamat tidak ditemukan atau bukan milik user ini'
      }, { status: 404 }))
    }

    // Update alamat menggunakan repository
    const updatedAddress = await userAddressesRepository.updateAddress(
      addressId,
      userId,
      validationResult.data
    )

    if (!updatedAddress) {
      return addCorsHeaders(NextResponse.json({
        success: false,
        error: 'Alamat tidak ditemukan',
        message: 'Alamat tidak ditemukan atau gagal diupdate'
      }, { status: 404 }))
    }

    console.log('✅ Address updated successfully:', updatedAddress.id)

    return addCorsHeaders(NextResponse.json({
      success: true,
      data: updatedAddress,
      message: 'Alamat berhasil diupdate'
    }, { status: 200 }))

  } catch (error) {
    console.error('❌ Error updating address:', error)
    
    return addCorsHeaders(NextResponse.json({
      success: false,
      error: 'Terjadi kesalahan server',
      message: 'Gagal mengupdate alamat. Silakan coba lagi.'
    }, { status: 500 }))
  }
}