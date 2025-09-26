/**
 * API Route v1: Users Phones - Route Handler
 * 
 * Domain: User Management - Phone Operations by User ID
 * Responsibility: Handle HTTP requests untuk operasi nomor telepon berdasarkan user ID
 * 
 * Mengikuti prinsip:
 * - SRP: Hanya menangani routing untuk operasi nomor telepon user
 * - DRY: Reusable error handling dan validation
 * - KISS: Interface API yang sederhana dan konsisten
 * - SOLID: Dependency injection dan separation of concerns
 * - RESTful: Menggunakan HTTP methods sesuai standar
 */

import { NextRequest, NextResponse } from 'next/server'
import { userPhonesRepository } from '@/repositories/user_phones'
import { createUserPhoneSchema } from '@/db/schema/user_phones/validations/api_validation'
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
  count?: number
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
 * GET /api/v1/users/[id]/phones
 * Mengambil nomor telepon user berdasarkan user ID
 * 
 * Query Parameters:
 * - includeInactive: Include nomor telepon yang tidak aktif (optional, default: false)
 * 
 * @param request - Next.js request object
 * @param params - Route parameters containing user ID
 * @returns Response dengan data nomor telepon user atau error
 */
export async function GET(
  request: NextRequest,
  { params }: RequestParams
): Promise<NextResponse> {
  try {
    console.log('🔍 GET /api/v1/users/[id]/phones called')

    // Resolve params
    const resolvedParams = await params
    const userId = parseInt(resolvedParams.id)
    
    if (isNaN(userId) || userId <= 0) {
      const response: ApiResponse = {
        success: false,
        error: 'Invalid user ID format. Must be a positive number.'
      }
      
      return addCorsHeaders(
        NextResponse.json(response, { status: 400 })
      )
    }

    // Ambil parameter dari query string
    const { searchParams } = new URL(request.url)
    const includeInactive = searchParams.get('includeInactive') === 'true'

    // Ambil nomor telepon untuk user tertentu
    const phones = await userPhonesRepository.findByUserId(userId, includeInactive)
    const count = phones.length
    
    console.log(`📱 Found ${count} phones for user ${userId}`)

    const response: ApiResponse = {
      success: true,
      data: phones,
      count,
      message: count > 0 ? 'Phones retrieved successfully' : 'No phones found for this user'
    }

    return addCorsHeaders(
      NextResponse.json(response, { status: 200 })
    )

  } catch (error) {
    console.error('❌ Error in GET /api/v1/users/[id]/phones:', error)
    
    const response: ApiResponse = {
      success: false,
      error: 'Internal server error while fetching phones',
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    }

    return addCorsHeaders(
      NextResponse.json(response, { status: 500 })
    )
  }
}

/**
 * POST /api/v1/users/[id]/phones
 * Membuat nomor telepon baru untuk user tertentu
 * 
 * Request Body:
 * - label: Label nomor telepon (required)
 * - phoneNumber: Nomor telepon (required)
 * - countryCode: Kode negara (optional, default: +62)
 * - isDefault: Apakah nomor telepon default (optional, default: false)
 * - isVerified: Apakah nomor telepon sudah diverifikasi (optional, default: false)
 * 
 * @param request - Next.js request object
 * @param params - Route parameters containing user ID
 * @returns Response dengan data nomor telepon yang dibuat atau error
 */
export async function POST(
  request: NextRequest,
  { params }: RequestParams
): Promise<NextResponse> {
  try {
    console.log('📱 POST /api/v1/users/[id]/phones called')

    // Resolve params
    const resolvedParams = await params
    const userId = parseInt(resolvedParams.id)
    
    if (isNaN(userId) || userId <= 0) {
      const response: ApiResponse = {
        success: false,
        error: 'Invalid user ID format. Must be a positive number.'
      }
      
      return addCorsHeaders(
        NextResponse.json(response, { status: 400 })
      )
    }

    // Parse request body
    const body = await request.json()
    console.log('📝 Request body:', body)

    // Tambahkan userId dari parameter URL ke body
    const phoneDataWithUserId = {
      ...body,
      userId: userId
    }

    // Validasi input menggunakan Zod schema
    const validationResult = createUserPhoneSchema.safeParse(phoneDataWithUserId)
    
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

    const phoneData = validationResult.data

    // Ambil nomor telepon existing untuk validasi
    const existingPhones = await userPhonesRepository.findByUserId(userId, true)

    // Validasi duplikasi nomor telepon
    if (!validatePhoneDuplication(existingPhones, phoneData.phoneNumber)) {
      const response: ApiResponse = {
        success: false,
        error: 'Phone number already exists for this user'
      }
      
      return addCorsHeaders(
        NextResponse.json(response, { status: 409 })
      )
    }

    // Validasi duplikasi label
    if (!validatePhoneLabel(existingPhones, phoneData.label)) {
      const response: ApiResponse = {
        success: false,
        error: 'Phone label already exists for this user'
      }
      
      return addCorsHeaders(
        NextResponse.json(response, { status: 409 })
      )
    }

    // Validasi format nomor telepon Indonesia jika menggunakan kode +62
    if (phoneData.countryCode === '+62' && !validateIndonesianPhoneNumber(phoneData.phoneNumber)) {
      const response: ApiResponse = {
        success: false,
        error: 'Invalid Indonesian phone number format'
      }
      
      return addCorsHeaders(
        NextResponse.json(response, { status: 400 })
      )
    }

    // Buat nomor telepon baru
    const newPhone = await userPhonesRepository.createPhone({
      ...phoneData,
      isActive: true,
      createdAt: new Date().toISOString()
    })

    console.log(`✅ Phone created successfully for user ${userId}:`, newPhone.id)

    const response: ApiResponse = {
      success: true,
      data: newPhone,
      message: 'Phone created successfully'
    }

    return addCorsHeaders(
      NextResponse.json(response, { status: 201 })
    )

  } catch (error) {
    console.error('❌ Error in POST /api/v1/users/[id]/phones:', error)
    
    const response: ApiResponse = {
      success: false,
      error: 'Internal server error while creating phone',
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    }

    return addCorsHeaders(
      NextResponse.json(response, { status: 500 })
    )
  }
}

/**
 * OPTIONS /api/v1/users/[id]/phones
 * Handle CORS preflight requests
 * 
 * @param request - Next.js request object
 * @returns Response dengan CORS headers
 */
export async function OPTIONS(request: NextRequest): Promise<NextResponse> {
  console.log('🔧 OPTIONS /api/v1/users/[id]/phones called')
  
  return addCorsHeaders(
    new NextResponse(null, { status: 200 })
  )
}