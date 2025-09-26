/**
 * API Route v1: User Phones - PATCH Operations
 * 
 * Domain: User Management - Phone Operations
 * Responsibility: Handle PATCH requests untuk operasi khusus nomor telepon (set default, verify)
 * 
 * Mengikuti prinsip:
 * - SRP: Hanya menangani operasi PATCH nomor telepon by ID
 * - DRY: Reusable error handling dan validation
 * - KISS: Interface API yang sederhana dan konsisten
 * - SOLID: Dependency injection dan separation of concerns
 * - RESTful: Menggunakan HTTP methods sesuai standar
 */

import { NextRequest, NextResponse } from 'next/server'
import { userPhonesRepository } from '@/repositories/user_phones'
import { setDefaultPhoneSchema, verifyPhoneSchema } from '@/db/schema/user_phones/validations/api_validation'
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
 * PATCH /api/v1/user-phones/[id]
 * Operasi khusus untuk nomor telepon (set default, verify)
 * 
 * Query Parameters:
 * - userId: ID user pemilik nomor telepon (required untuk validasi ownership)
 * - action: Jenis operasi ('set-default' atau 'verify')
 * 
 * Request Body untuk action 'set-default':
 * - phoneId: ID nomor telepon (harus sama dengan parameter URL)
 * 
 * Request Body untuk action 'verify':
 * - phoneId: ID nomor telepon (harus sama dengan parameter URL)
 * - verificationCode: Kode verifikasi
 * 
 * @param request - Next.js request object
 * @param params - Route parameters containing phone ID
 * @returns Response dengan data nomor telepon yang diupdate atau error
 */
export async function PATCH(
  request: NextRequest,
  { params }: RequestParams
): Promise<NextResponse> {
  try {
    console.log('📱 PATCH /api/v1/user-phones/[id] called')

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

    // Get parameters from query
    const url = new URL(request.url)
    const userIdParam = url.searchParams.get('userId')
    const action = url.searchParams.get('action')
    
    if (!userIdParam) {
      const response: ApiResponse = {
        success: false,
        error: 'userId query parameter is required'
      }
      
      return addCorsHeaders(
        NextResponse.json(response, { status: 400 })
      )
    }

    if (!action) {
      const response: ApiResponse = {
        success: false,
        error: 'action query parameter is required (set-default or verify)'
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

    // Handle different actions
    if (action === 'set-default') {
      // Validasi input untuk set default
      const validationResult = setDefaultPhoneSchema.safeParse({
        ...body,
        phoneId
      })
      
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

      // Set nomor telepon sebagai default
      const updatedPhone = await userPhonesRepository.setAsDefault(phoneId, userId)

      if (!updatedPhone) {
        const response: ApiResponse = {
          success: false,
          error: 'Failed to set phone as default'
        }
        
        return addCorsHeaders(
          NextResponse.json(response, { status: 500 })
        )
      }

      console.log('✅ Phone set as default successfully:', updatedPhone.id)

      const response: ApiResponse = {
        success: true,
        data: updatedPhone,
        message: 'Phone set as default successfully'
      }

      return addCorsHeaders(
        NextResponse.json(response, { status: 200 })
      )

    } else if (action === 'verify') {
      // Validasi input untuk verify
      const validationResult = verifyPhoneSchema.safeParse({
        ...body,
        phoneId
      })
      
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

      // TODO: Implementasi verifikasi kode (misalnya dengan SMS gateway)
      // Untuk saat ini, langsung set sebagai verified
      const updatedPhone = await userPhonesRepository.verifyPhone(phoneId, userId)

      if (!updatedPhone) {
        const response: ApiResponse = {
          success: false,
          error: 'Failed to verify phone'
        }
        
        return addCorsHeaders(
          NextResponse.json(response, { status: 500 })
        )
      }

      console.log('✅ Phone verified successfully:', updatedPhone.id)

      const response: ApiResponse = {
        success: true,
        data: updatedPhone,
        message: 'Phone verified successfully'
      }

      return addCorsHeaders(
        NextResponse.json(response, { status: 200 })
      )

    } else {
      const response: ApiResponse = {
        success: false,
        error: 'Invalid action. Supported actions: set-default, verify'
      }
      
      return addCorsHeaders(
        NextResponse.json(response, { status: 400 })
      )
    }

  } catch (error) {
    console.error('❌ Error in PATCH /api/v1/user-phones/[id]:', error)
    
    const response: ApiResponse = {
      success: false,
      error: 'Internal server error while processing phone operation',
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    }

    return addCorsHeaders(
      NextResponse.json(response, { status: 500 })
    )
  }
}