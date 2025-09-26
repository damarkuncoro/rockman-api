/**
 * API Route v1: User Addresses - PUT Update
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
  }>
}

/**
 * PUT /api/v1/user_addresses/[id]
 * Mengupdate alamat user berdasarkan ID
 * 
 * Query Parameters:
 * - userId: ID user pemilik alamat (required untuk validasi ownership)
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
 * @param params - Route parameters containing address ID
 * @returns Response dengan data alamat yang diupdate atau error
 */
export async function PUT(
  request: NextRequest,
  { params }: RequestParams
): Promise<NextResponse> {
  try {
    console.log('🔍 PUT /api/v1/user_addresses/[id] called')

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

    console.log(`🎯 Updating address ID: ${addressId} for user ID: ${userId}`)

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
    console.log('📝 Request body received:', { ...body, phoneNumber: body.phoneNumber ? '***' : undefined })

    // Validasi request body menggunakan Zod schema
    const validationResult = updateUserAddressSchema.safeParse(body)
    
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

    const updateData = validationResult.data

    // Jika tidak ada data untuk diupdate
    if (Object.keys(updateData).length === 0) {
      return addCorsHeaders(NextResponse.json({
        success: false,
        error: 'Tidak ada data untuk diupdate',
        message: 'Silakan sertakan minimal satu field untuk diupdate'
      }, { status: 400 }))
    }

    // Update alamat menggunakan repository
    const updatedAddress = await userAddressesRepository.updateAddress(
      addressId,
      userId,
      updateData
    )

    if (!updatedAddress) {
      return addCorsHeaders(NextResponse.json({
        success: false,
        error: 'Gagal mengupdate alamat',
        message: 'Alamat tidak dapat diupdate'
      }, { status: 500 }))
    }

    console.log(`✅ Address updated successfully: ${updatedAddress.label}`)

    // Return success response
    const response: ApiResponse = {
      success: true,
      data: updatedAddress,
      message: 'Alamat berhasil diupdate'
    }

    return addCorsHeaders(NextResponse.json(response))

  } catch (error: unknown) {
    console.error('❌ Error in PUT /api/v1/user_addresses/[id]:', error)
    
    const apiError = error as { message?: string }
    let errorMessage = 'Terjadi kesalahan saat mengupdate alamat'
    let statusCode = 500

    // Handle specific error cases
    if (apiError.message?.includes('duplicate') || apiError.message?.includes('unique')) {
      errorMessage = 'Alamat dengan data yang sama sudah ada'
      statusCode = 409
    }

    return addCorsHeaders(NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: errorMessage
    }, { status: statusCode }))
  }
}