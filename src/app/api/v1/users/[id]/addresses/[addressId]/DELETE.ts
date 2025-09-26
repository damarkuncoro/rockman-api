/**
 * API Route v1: Users/[id]/Addresses/[addressId] - DELETE
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
    addressId: string
  }>
}

/**
 * DELETE /api/v1/users/[id]/addresses/[addressId]
 * Menghapus alamat user berdasarkan ID (soft delete)
 * 
 * @param request - Next.js request object
 * @param params - Route parameters containing user ID and address ID
 * @returns Response dengan konfirmasi penghapusan atau error
 */
export async function DELETE(
  request: NextRequest,
  { params }: RequestParams
): Promise<NextResponse> {
  try {
    console.log('🔍 DELETE /api/v1/users/[id]/addresses/[addressId] called')

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

    // Validasi ownership alamat
    const isOwner = await userAddressesRepository.validateOwnership(addressId, userId)
    if (!isOwner) {
      return addCorsHeaders(NextResponse.json({
        success: false,
        error: 'Alamat tidak ditemukan',
        message: 'Alamat tidak ditemukan atau bukan milik user ini'
      }, { status: 404 }))
    }

    // Hapus alamat menggunakan repository (soft delete)
    const isDeleted = await userAddressesRepository.deleteAddress(addressId, userId)

    if (!isDeleted) {
      return addCorsHeaders(NextResponse.json({
        success: false,
        error: 'Alamat tidak ditemukan',
        message: 'Alamat tidak ditemukan atau gagal dihapus'
      }, { status: 404 }))
    }

    console.log('✅ Address deleted successfully:', addressId)

    return addCorsHeaders(NextResponse.json({
      success: true,
      message: 'Alamat berhasil dihapus'
    }, { status: 200 }))

  } catch (error) {
    console.error('❌ Error deleting address:', error)
    
    return addCorsHeaders(NextResponse.json({
      success: false,
      error: 'Terjadi kesalahan server',
      message: 'Gagal menghapus alamat. Silakan coba lagi.'
    }, { status: 500 }))
  }
}