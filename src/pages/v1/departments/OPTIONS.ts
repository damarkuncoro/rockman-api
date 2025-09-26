import { NextResponse } from "next/server"
import { createCorsResponse } from "@/utils/cors"

/**
 * OPTIONS /api/v1/departments - CORS preflight handler
 * 
 * Menangani CORS preflight requests untuk departments API
 * Mengizinkan semua HTTP methods yang didukung
 * 
 * @returns Promise<NextResponse> - Response dengan CORS headers
 */
export async function OPTIONS() {
  return createCorsResponse(null, {
    status: 200,
    headers: {
      'Allow': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400', // 24 hours
    }
  })
}