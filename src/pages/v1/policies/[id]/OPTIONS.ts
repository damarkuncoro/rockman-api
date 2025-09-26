import { NextRequest, NextResponse } from "next/server"

/**
 * OPTIONS /api/v1/policies/[id] - Handler untuk preflight CORS request
 * @param req - NextRequest object
 * @param params - Object yang berisi parameter ID
 * @returns Promise<NextResponse> - Response dengan CORS headers
 */
export async function OPTIONS(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Ambil CORS origin dari environment variable dengan fallback
  const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:3000'
  
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