
import { NextRequest, NextResponse } from 'next/server'
import { createUsersService } from '@/services/database/users/users.service'
import { addCorsHeaders } from '@/utils/cors'

/**
 * APPROACH 2: Direct Service
 * Menggunakan service layer untuk mengakses data users
 * 
 * @param request - NextRequest object
 * @returns NextResponse dengan data users dari service atau error
 */
export async function handleServiceApproach(request: NextRequest) {
  console.log('\n🔧 APPROACH 2: Direct Service')
  
  try {
    const usersService = createUsersService()
    console.log('🔍 Service instance:', usersService)
    
    const serviceUsers = await usersService.GET.All()
    console.log('✅ Direct Service - Success:', serviceUsers?.length, 'users found')
    console.log('📊 First user from service:', serviceUsers?.[0])
    
    if (serviceUsers && serviceUsers.length > 0) {
      return addCorsHeaders(NextResponse.json({
        method: 'service',
        data: serviceUsers,
        count: serviceUsers.length,
        success: true
      }))
    } else {
      return addCorsHeaders(NextResponse.json({
        method: 'service',
        data: [],
        count: 0,
        message: 'No users found',
        success: true
      }))
    }
  } catch (serviceError) {
    console.error('❌ Direct Service - Error:', serviceError)
    return addCorsHeaders(NextResponse.json({
      method: 'service',
      error: 'Service method failed',
      details: serviceError instanceof Error ? serviceError.message : 'Unknown error',
      success: false
    }, { status: 500 }))
  }
}