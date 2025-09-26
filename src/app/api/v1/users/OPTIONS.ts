import { NextResponse } from 'next/server'

/**
 * OPTIONS /api/v1/users - Handler untuk preflight CORS request
 * @returns Promise<NextResponse> - Response dengan CORS headers
 */
export async function OPTIONS() {
  // Mengambil CORS origin dari environment variable
  const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:3000'
  
  // Membuat response dengan CORS headers untuk preflight request
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': corsOrigin,
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Max-Age': '86400', // 24 hours
    },
  })
}