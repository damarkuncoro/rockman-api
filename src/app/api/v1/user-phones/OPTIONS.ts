/**
 * API Route v1: User Phones - OPTIONS
 * 
 * Domain: User Management - Phone Operations
 * Responsibility: Handle OPTIONS requests untuk CORS preflight
 * 
 * Mengikuti prinsip:
 * - SRP: Hanya menangani CORS preflight requests
 * - KISS: Interface yang sederhana untuk CORS
 * - RESTful: Menggunakan HTTP methods sesuai standar
 */

import { NextRequest, NextResponse } from 'next/server'
import { addCorsHeaders } from '@/utils/cors'

/**
 * OPTIONS /api/v1/user-phones
 * Handle CORS preflight requests
 * 
 * @param request - Next.js request object
 * @returns Response dengan CORS headers
 */
export async function OPTIONS(request: NextRequest): Promise<NextResponse> {
  console.log('📱 OPTIONS /api/v1/user-phones called')
  
  const response = new NextResponse(null, { status: 200 })
  return addCorsHeaders(response)
}