/**
 * Route handler untuk /api/v1/roles/[id]/users
 * 
 * Menggunakan Next.js App Router dengan struktur modular
 * Mengimpor implementasi dari folder GET/ untuk organisasi yang lebih baik
 */

import { NextRequest, NextResponse } from 'next/server'
import { GET as GetRoleUsers } from './GET'

/**
 * GET Handler - Mendapatkan users dalam role tertentu
 * Delegasi ke implementasi di GET/index.ts
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return await GetRoleUsers(request, { params })
}

/**
 * OPTIONS Handler untuk CORS preflight requests
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': 'http://localhost:3000',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Credentials': 'true',
    },
  })
}