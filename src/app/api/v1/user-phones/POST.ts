/**
 * API Route v1: User Phones - POST Create
 * 
 * Domain: User Management - Phone Operations
 * Responsibility: Handle POST requests untuk membuat nomor telepon user baru
 * 
 * Mengikuti prinsip:
 * - SRP: Hanya menangani operasi POST nomor telepon user
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
}

/**
 * POST /api/v1/user-phones
 * Membuat nomor telepon user baru
 * 
 * Request Body:
 * - userId: ID user pemilik nomor telepon (required)
 * - label: Label nomor telepon (required)
 * - phoneNumber: Nomor telepon (required)
 * - countryCode: Kode negara (optional, default: +62)
 * - isDefault: Apakah nomor telepon default (optional, default: false)
 * - isVerified: Apakah nomor telepon sudah diverifikasi (optional, default: false)
 * 
 * @param request - Next.js request object
 * @returns Response dengan data nomor telepon yang dibuat atau error
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    console.log('📱 POST /api/v1/user-phones called')

    // Parse request body
    const body = await request.json()
    console.log('📝 Request body:', body)

    // Validasi input menggunakan Zod schema
    const validationResult = createUserPhoneSchema.safeParse(body)
    
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
    
    // Validasi userId harus ada
    if (!phoneData.userId) {
      const response: ApiResponse = {
        success: false,
        error: 'userId is required'
      }
      
      return addCorsHeaders(
        NextResponse.json(response, { status: 400 })
      )
    }

    // Ambil nomor telepon existing untuk validasi
    const existingPhones = await userPhonesRepository.findByUserId(phoneData.userId, true)

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

    console.log('✅ Phone created successfully:', newPhone.id)

    const response: ApiResponse = {
      success: true,
      data: newPhone,
      message: 'Phone created successfully'
    }

    return addCorsHeaders(
      NextResponse.json(response, { status: 201 })
    )

  } catch (error) {
    console.error('❌ Error in POST /api/v1/user-phones:', error)
    
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