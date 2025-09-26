import { NextResponse } from 'next/server'

/**
 * Utility untuk menambahkan CORS headers ke response
 * Menggunakan environment variable CORS_ORIGIN dengan fallback ke localhost:3000
 */
export function addCorsHeaders(response: NextResponse): NextResponse {
  const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:3000'
  
  response.headers.set('Access-Control-Allow-Origin', corsOrigin)
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  response.headers.set('Access-Control-Allow-Credentials', 'true')
  response.headers.set('Access-Control-Max-Age', '86400')
  
  return response
}

/**
 * Utility untuk membuat response JSON dengan CORS headers
 * @param data - Data untuk response
 * @param options - Options untuk NextResponse (status, headers, dll)
 * @returns NextResponse dengan CORS headers
 */
export function createCorsResponse(data: unknown, options?: { status?: number; headers?: Record<string, string> }) {
  const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:3000'
  
  const response = NextResponse.json(data, {
    status: options?.status || 200,
    headers: {
      'Access-Control-Allow-Origin': corsOrigin,
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Max-Age': '86400',
      ...options?.headers
    }
  })
  
  return response
}

/**
 * Utility untuk membuat OPTIONS response dengan CORS headers
 * @param allowedMethods - Metode HTTP yang diizinkan untuk endpoint ini
 * @returns NextResponse untuk OPTIONS request
 */
export function createOptionsResponse(allowedMethods: string = 'GET, POST, PUT, DELETE, OPTIONS') {
  const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:3000'
  
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': corsOrigin,
      'Access-Control-Allow-Methods': allowedMethods,
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Max-Age': '86400',
    },
  })
}