/**
 * API Route v1: User Phones - DELETE by ID
 * 
 * Domain: User Management - Phone Operations
 * Responsibility: Handle DELETE requests untuk menghapus nomor telepon user berdasarkan ID
 * 
 * Mengikuti prinsip:
 * - SRP: Hanya menangani operasi DELETE nomor telepon by ID
 * - DRY: Reusable error handling dan validation
 * - KISS: Interface API yang sederhana dan konsisten
 * - SOLID: Dependency injection dan separation of concerns
 * - RESTful: Menggunakan HTTP methods sesuai standar
 */

import { NextRequest, NextResponse } from 'next/server'
import { userPhonesRepository } from '@/repositories/user_phones'
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
 * DELETE /api/v1/user-phones/[id]
 * Menghapus nomor telepon user berdasarkan ID (soft delete)
 * 
 * Query Parameters:
 * - userId: ID user pemilik nomor telepon (required untuk validasi ownership)
 * 
 * @param request - Next.js request object
 * @param params - Route parameters containing phone ID
 * @returns Response dengan status penghapusan atau error
 */
export async function DELETE(
  request: NextRequest,
  { params }: RequestParams
): Promise<NextResponse> {
  try {
    console.log('📱 DELETE /api/v1/user-phones/[id] called')

    // Resolve params
    const resolvedParams = await params
    const phoneId = parseInt(resolvedParams.id)
    
    if (isNaN(phoneId)) {
      const response: ApiResponse = {
        success: false,
        error: 'Invalid phone ID'
      }
      
      return addCorsHeaders(
        NextResponse.json(response, { status: 400 })
      )
    }

    // Get userId from query parameters
    const url = new URL(request.url)
    const userIdParam = url.searchParams.get('userId')
    
    if (!userIdParam) {
      const response: ApiResponse = {
        success: false,
        error: 'userId query parameter is required'
      }
      
      return addCorsHeaders(
        NextResponse.json(response, { status: 400 })
      )
    }

    const userId = parseInt(userIdParam)
    
    if (isNaN(userId)) {
      const response: ApiResponse = {
        success: false,
        error: 'Invalid userId'
      }
      
      return addCorsHeaders(
        NextResponse.json(response, { status: 400 })
      )
    }

    // Validasi ownership
    const isOwner = await userPhonesRepository.validateOwnership(phoneId, userId)
    
    if (!isOwner) {
      const response: ApiResponse = {
        success: false,
        error: 'Phone not found or access denied'
      }
      
      return addCorsHeaders(
        NextResponse.json(response, { status: 404 })
      )
    }

    // Cek apakah nomor telepon adalah default
    const existingPhone = await userPhonesRepository.findByUserId(userId)
    const phoneToDelete = existingPhone.find(phone => phone.id === phoneId)
    
    if (phoneToDelete?.isDefault && existingPhone.length > 1) {
      // Jika nomor yang akan dihapus adalah default dan masih ada nomor lain,
      // set nomor lain sebagai default
      const otherPhones = existingPhone.filter(phone => phone.id !== phoneId && phone.isActive)
      
      if (otherPhones.length > 0) {
        await userPhonesRepository.setAsDefault(otherPhones[0].id, userId)
      }
    }

    // Hapus nomor telepon (soft delete)
    const isDeleted = await userPhonesRepository.deletePhone(phoneId, userId)

    if (!isDeleted) {
      const response: ApiResponse = {
        success: false,
        error: 'Failed to delete phone'
      }
      
      return addCorsHeaders(
        NextResponse.json(response, { status: 500 })
      )
    }

    console.log('✅ Phone deleted successfully:', phoneId)

    const response: ApiResponse = {
      success: true,
      message: 'Phone deleted successfully'
    }

    return addCorsHeaders(
      NextResponse.json(response, { status: 200 })
    )

  } catch (error) {
    console.error('❌ Error in DELETE /api/v1/user-phones/[id]:', error)
    
    const response: ApiResponse = {
      success: false,
      error: 'Internal server error while deleting phone',
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    }

    return addCorsHeaders(
      NextResponse.json(response, { status: 500 })
    )
  }
}