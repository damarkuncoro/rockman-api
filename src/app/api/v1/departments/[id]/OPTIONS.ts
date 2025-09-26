import { NextRequest, NextResponse } from "next/server"

/**
 * OPTIONS /api/v1/departments/[id] - Handle CORS preflight request
 * 
 * @param req - NextRequest object
 * @returns NextResponse - CORS headers untuk preflight request
 */
export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    },
  })
}