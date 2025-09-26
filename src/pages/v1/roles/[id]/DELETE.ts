import { NextRequest, NextResponse } from "next/server"
import { rolesService } from "@/services/database/roles/roles.service"

/**
 * DELETE /api/v1/roles/[id] - Menghapus role berdasarkan ID
 * @param req - NextRequest object
 * @param params - Object yang berisi parameter ID
 * @returns Promise<NextResponse> - Response dengan konfirmasi penghapusan atau error
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Ambil CORS origin dari environment variable dengan fallback
  const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:3000'
  
  try {
    const id = parseInt((await params).id)
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid ID format' },
        { 
          status: 400,
          headers: {
            'Access-Control-Allow-Origin': corsOrigin,
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Access-Control-Allow-Credentials': 'true',
            'Access-Control-Max-Age': '86400',
          }
        }
      )
    }

    await rolesService.DELETE.Remove(id)
    return NextResponse.json({ message: 'Role deleted successfully' }, {
      headers: {
        'Access-Control-Allow-Origin': corsOrigin,
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Max-Age': '86400',
      }
    })
  } catch (error) {
    console.error('Error deleting role by ID:', error)
    return NextResponse.json(
      { error: 'Failed to delete role' },
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': corsOrigin,
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'Access-Control-Allow-Credentials': 'true',
          'Access-Control-Max-Age': '86400',
        }
      }
    )
  }
}