import { NextRequest, NextResponse } from 'next/server'

/**
 * Handler untuk OPTIONS request (CORS preflight)
 * Mengizinkan frontend untuk melakukan cross-origin requests
 */
export async function OPTIONS(request: NextRequest) {
  const response = new NextResponse(null, { status: 200 })
  
  // Set CORS headers untuk preflight request
  response.headers.set('Access-Control-Allow-Origin', 'http://localhost:3000')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  response.headers.set('Access-Control-Allow-Credentials', 'true')
  response.headers.set('Access-Control-Max-Age', '86400') // Cache preflight untuk 24 jam
  
  return response
}