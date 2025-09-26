
import { NextRequest, NextResponse } from 'next/server'
import { SERVICE } from "@/core/core.service.registry"
import { addCorsHeaders } from '@/utils/cors'

/**
 * APPROACH 3: Service Registry
 * Menggunakan service registry untuk mengakses data users
 * 
 * @param request - NextRequest object
 * @returns NextResponse dengan data users dari registry atau error
 */
export async function handleRegistryApproach(request: NextRequest) {
  console.log('\n🔧 APPROACH 3: Service Registry')
  
  try {
    // Check if users service is registered
    if (SERVICE.has('users')) {
      const registryService = SERVICE.get('users')
      console.log('🔍 Registry service:', registryService)
      
      if (registryService) {
        const registryUsers = await (registryService as any).GET.All()
        console.log('✅ Service Registry - Success:', registryUsers?.length, 'users found')
        console.log('📊 First user from registry:', registryUsers?.[0])
        
        if (registryUsers && registryUsers.length > 0) {
          return addCorsHeaders(NextResponse.json({
            method: 'registry',
            data: registryUsers,
            count: registryUsers.length,
            success: true
          }))
        } else {
          return addCorsHeaders(NextResponse.json({
            method: 'registry',
            data: [],
            count: 0,
            message: 'No users found',
            success: true
          }))
        }
      } else {
        return addCorsHeaders(NextResponse.json({
          method: 'registry',
          error: 'Registry service is null',
          success: false
        }, { status: 500 }))
      }
    } else {
      console.log('⚠️ Users service not registered in SERVICE registry')
      return addCorsHeaders(NextResponse.json({
        method: 'registry',
        error: 'Users service not registered in SERVICE registry',
        success: false
      }, { status: 404 }))
    }
  } catch (registryError) {
    console.error('❌ Service Registry - Error:', registryError)
    return addCorsHeaders(NextResponse.json({
      method: 'registry',
      error: 'Registry method failed',
      details: registryError instanceof Error ? registryError.message : 'Unknown error',
      success: false
    }, { status: 500 }))
  }
}
