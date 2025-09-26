/**
 * API Route v1: User Addresses - DELETE
 * 
 * Domain: User Management - Address Operations
 * Responsibility: Handle DELETE requests untuk menghapus alamat user berdasarkan ID
 * 
 * Mengikuti prinsip:
 * - SRP: Hanya menangani operasi DELETE alamat by ID
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
 * DELETE /api/v1/user_addresses/[id]
 * Menghapus alamat user berdasarkan ID (soft delete)
 * 
 * Query Parameters:
 * - userId: ID user pemilik alamat (required untuk validasi ownership)
 * 
 * @param request - Next.js request object
 * @param params - Route parameters containing address ID
 * @returns Response dengan konfirmasi penghapusan atau error
 */
export async function DELETE(
  request: NextRequest,
  { params }: RequestParams
): Promise<NextResponse> {
  try {
    console.log('🔍 DELETE /api/v1/user_addresses/[id] called')

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

    console.log(`🎯 Deleting address ID: ${addressId} for user ID: ${userId}`)

    // Validasi ownership alamat
    const isOwner = await userAddressesRepository.validateOwnership(addressId, userId)
    if (!isOwner) {
      return addCorsHeaders(NextResponse.json({
        success: false,
        error: 'Alamat tidak ditemukan',
        message: 'Alamat tidak ditemukan atau Anda tidak memiliki akses'
      }, { status: 404 }))
    }

    // Cek apakah alamat adalah alamat default
    const address = await userAddressesRepository.SELECT.ById(addressId)
    if (!address) {
      return addCorsHeaders(NextResponse.json({
        success: false,
        error: 'Alamat tidak ditemukan',
        message: 'Alamat tidak ditemukan'
      }, { status: 404 }))
    }

    // Jika alamat adalah default, cek apakah user memiliki alamat lain
    if (address.isDefault) {
      const userAddresses = await userAddressesRepository.findByUserId(userId, false)
      const activeAddresses = userAddresses.filter(addr => addr.id !== addressId)
      
      if (activeAddresses.length === 0) {
        return addCorsHeaders(NextResponse.json({
          success: false,
          error: 'Tidak dapat menghapus alamat default terakhir',
          message: 'Anda harus memiliki minimal satu alamat aktif'
        }, { status: 400 }))
      }
    }

    // Hapus alamat menggunakan repository (soft delete)
    const isDeleted = await userAddressesRepository.deleteAddress(addressId, userId)

    if (!isDeleted) {
      return addCorsHeaders(NextResponse.json({
        success: false,
        error: 'Gagal menghapus alamat',
        message: 'Alamat tidak dapat dihapus'
      }, { status: 500 }))
    }

    console.log(`✅ Address deleted successfully: ${address.label}`)

    // Return success response
    const response: ApiResponse = {
      success: true,
      message: 'Alamat berhasil dihapus'
    }

    return addCorsHeaders(NextResponse.json(response))

  } catch (error: unknown) {
    console.error('❌ Error in DELETE /api/v1/user_addresses/[id]:', error)
    
    const apiError = error as { message?: string }
    let errorMessage = 'Terjadi kesalahan saat menghapus alamat'
    let statusCode = 500

    // Handle specific error cases
    if (apiError.message?.includes('constraint') || apiError.message?.includes('foreign key')) {
      errorMessage = 'Alamat tidak dapat dihapus karena masih digunakan'
      statusCode = 409
    }

    return addCorsHeaders(NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: errorMessage
    }, { status: statusCode }))
  }
}