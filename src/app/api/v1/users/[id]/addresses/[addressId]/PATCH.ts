/**
 * API Route v1: Users/[id]/Addresses/[addressId] - PATCH Partial Update
 * 
 * Domain: User Management - Address Operations
 * Responsibility: Handle PATCH requests untuk update parsial alamat user
 * 
 * Mengikuti prinsip:
 * - SRP: Hanya menangani operasi update parsial alamat
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
 * PATCH /api/v1/users/[id]/addresses/[addressId]
 * Update parsial alamat user
 * 
 * Request Body (semua field opsional):
 * - label?: string
 * - recipientName?: string
 * - phoneNumber?: string
 * - addressLine1?: string
 * - addressLine2?: string
 * - city?: string
 * - province?: string
 * - postalCode?: string
 * - country?: string
 * - isDefault?: boolean
 * 
 * @param request - Next.js request object
 * @param params - Route parameters containing user ID and address ID
 * @returns Response dengan data alamat yang diupdate atau error
 */
export async function PATCH(
  request: NextRequest,
  { params }: RequestParams
): Promise<NextResponse> {
  try {
    console.log('🔍 PATCH /api/v1/users/[id]/addresses/[addressId] called')

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
    
    // Validasi bahwa ada minimal satu field untuk diupdate
    const allowedFields = ['label', 'recipientName', 'phoneNumber', 'addressLine1', 'addressLine2', 'city', 'province', 'postalCode', 'country', 'isDefault']
    const updateFields = Object.keys(requestBody).filter(key => allowedFields.includes(key))
    
    if (updateFields.length === 0) {
      return addCorsHeaders(NextResponse.json({
        success: false,
        error: 'Parameter tidak valid',
        message: 'Minimal satu field harus disediakan untuk update'
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

    // Jika isDefault true, set sebagai default
    if (requestBody.isDefault === true) {
      const defaultAddress = await userAddressesRepository.setAsDefault(addressId, userId)
      
      if (!defaultAddress) {
        return addCorsHeaders(NextResponse.json({
          success: false,
          error: 'Alamat tidak ditemukan',
          message: 'Alamat tidak ditemukan atau gagal diset sebagai default'
        }, { status: 404 }))
      }

      console.log('✅ Address set as default successfully:', defaultAddress.id)

      return addCorsHeaders(NextResponse.json({
        success: true,
        data: defaultAddress,
        message: 'Alamat berhasil diset sebagai default'
      }, { status: 200 }))
    }

    // Update parsial alamat
    const updatedAddress = await userAddressesRepository.updateAddress(addressId, userId, requestBody)

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
    console.error('❌ Error setting default address:', error)
    
    return addCorsHeaders(NextResponse.json({
      success: false,
      error: 'Terjadi kesalahan server',
      message: 'Gagal mengset alamat sebagai default. Silakan coba lagi.'
    }, { status: 500 }))
  }
}