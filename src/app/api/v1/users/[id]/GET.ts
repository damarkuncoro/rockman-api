import { NextRequest, NextResponse } from "next/server"
import { SERVICE } from "@/core/core.service.registry"
import { createCorsResponse } from "@/utils/cors"
// Import users service untuk memastikan registrasi ke SERVICE registry
import "@/services/database/users/users.service"

/**
 * GET /api/v1/users/[id] - Mengambil user berdasarkan ID
 * Menggunakan SERVICE registry pattern untuk akses service
 * @param request - Next.js request object
 * @param params - Route parameters containing the user ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    const userId = parseInt(resolvedParams.id)
    
    // Validasi ID - PostgreSQL integer range: -2147483648 to 2147483647
    if (isNaN(userId) || userId <= 0) {
      return createCorsResponse(
        { error: 'Invalid user ID. Must be a positive number.' },
        { status: 400 }
      )
    }

    // Validasi PostgreSQL integer overflow
    if (userId > 2147483647) {
      return createCorsResponse(
        { error: 'User ID is too large. Maximum value is 2147483647.' },
        { status: 400 }
      )
    }

    // Ambil user dari SERVICE.users.GET menggunakan SERVICE registry
    const user = await (SERVICE as any).users.GET.ById(userId)
    
    // Jika user tidak ditemukan
    if (!user) {
      return createCorsResponse(
        { error: `User with ID ${userId} not found` },
        { status: 404 }
      )
    }

    return createCorsResponse(user)
  } catch (error) {
    console.error('Error fetching user by ID:', error)
    return createCorsResponse(
      { error: 'Failed to fetch user' },
      { status: 500 }
    )
  }
}
