/**
 * API Route v1: User Phones - PUT Update
 * 
 * Domain: User Management - Phone Operations
 * Responsibility: Handle PUT requests untuk mengupdate nomor telepon user berdasarkan ID
 * 
 * Mengikuti prinsip:
 * - SRP: Hanya menangani operasi PUT nomor telepon by ID
 * - DRY: Reusable error handling dan validation
 * - KISS: Interface API yang sederhana dan konsisten
 * - SOLID: Dependency injection dan separation of concerns
 * - RESTful: Menggunakan HTTP methods sesuai standar
 */

import { NextRequest, NextResponse } from 'next/server'
import { userPhonesRepository } from '@/repositories/user_phones'
import { updateUserPhoneSchema } from '@/db/schema/user_phones/validations/api_validation'
import { validateIndonesianPhoneNumber, validatePhoneDuplication, validatePhoneLabel } from '@/db/schema/user_phones/validations/data_validation'
import { addCorsHeaders } from '@/utils/cors'

/**
 * Interface untuk API response
 */
interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  message?: string
  error?: string
  errors?: Record<string, string[]>
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
 * PUT /api/v1/user-phones/[id]
 * Mengupdate nomor telepon user berdasarkan ID
 * 
 * Query Parameters:
 * - userId: ID user pemilik nomor telepon (required untuk validasi ownership)
 * 
 * Request Body (semua optional):
 * - label: Label nomor telepon
 * - phoneNumber: Nomor telepon
 * - countryCode: Kode negara
 * - isDefault: Apakah nomor telepon default
 * - isVerified: Apakah nomor telepon sudah diverifikasi
 * 
 * @param request - Next.js request object
 * @param params - Route parameters containing phone ID
 * @returns Response dengan data nomor telepon yang diupdate atau error
 */
export async function PUT(
  request: NextRequest,
  { params }: RequestParams
): Promise<NextResponse> {
  try {
    console.log('📱 PUT /api/v1/user-phones/[id] called')

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

    // Parse request body
    const body = await request.json()
    console.log('📝 Request body:', body)

    // Validasi input menggunakan Zod schema
    const validationResult = updateUserPhoneSchema.safeParse(body)
    
    if (!validationResult.success) {
      const errors = validationResult.error.flatten().fieldErrors
      console.log('❌ Validation errors:', errors)
      
      const response: ApiResponse = {
        success: false,
        error: 'Validation failed',
        errors
      }
      
      return addCorsHeaders(
        NextResponse.json(response, { status: 400 })
      )
    }

    const updateData = validationResult.data

    // Jika ada perubahan phoneNumber atau label, lakukan validasi duplikasi
    if (updateData.phoneNumber || updateData.label) {
      const existingPhones = await userPhonesRepository.findByUserId(userId, true)
      
      // Validasi duplikasi nomor telepon (exclude current phone)
      if (updateData.phoneNumber) {
        const duplicatePhone = existingPhones.find(phone => 
          phone.phoneNumber === updateData.phoneNumber && phone.id !== phoneId
        )
        
        if (duplicatePhone) {
          const response: ApiResponse = {
            success: false,
            error: 'Phone number already exists for this user'
          }
          
          return addCorsHeaders(
            NextResponse.json(response, { status: 409 })
          )
        }
      }

      // Validasi duplikasi label (exclude current phone)
      if (updateData.label) {
        const duplicateLabel = existingPhones.find(phone => 
          phone.label === updateData.label && phone.id !== phoneId
        )
        
        if (duplicateLabel) {
          const response: ApiResponse = {
            success: false,
            error: 'Phone label already exists for this user'
          }
          
          return addCorsHeaders(
            NextResponse.json(response, { status: 409 })
          )
        }
      }
    }

    // Validasi format nomor telepon Indonesia jika menggunakan kode +62
    if (updateData.phoneNumber && updateData.countryCode === '+62' && 
        !validateIndonesianPhoneNumber(updateData.phoneNumber)) {
      const response: ApiResponse = {
        success: false,
        error: 'Invalid Indonesian phone number format'
      }
      
      return addCorsHeaders(
        NextResponse.json(response, { status: 400 })
      )
    }

    // Update nomor telepon
    const updatedPhone = await userPhonesRepository.updatePhone(phoneId, userId, updateData)

    if (!updatedPhone) {
      const response: ApiResponse = {
        success: false,
        error: 'Failed to update phone'
      }
      
      return addCorsHeaders(
        NextResponse.json(response, { status: 500 })
      )
    }

    console.log('✅ Phone updated successfully:', updatedPhone.id)

    const response: ApiResponse = {
      success: true,
      data: updatedPhone,
      message: 'Phone updated successfully'
    }

    return addCorsHeaders(
      NextResponse.json(response, { status: 200 })
    )

  } catch (error) {
    console.error('❌ Error in PUT /api/v1/user-phones/[id]:', error)
    
    const response: ApiResponse = {
      success: false,
      error: 'Internal server error while updating phone',
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    }

    return addCorsHeaders(
      NextResponse.json(response, { status: 500 })
    )
  }
}