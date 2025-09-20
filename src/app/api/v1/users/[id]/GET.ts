import { NextRequest, NextResponse } from "next/server"
import { usersService } from "@/services/database/users/users.service"

/**
 * GET /api/v1/users/[id] - Mengambil user berdasarkan ID
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
      return NextResponse.json(
        { error: 'Invalid user ID. Must be a positive number.' },
        { status: 400 }
      )
    }

    // Validasi PostgreSQL integer overflow
    if (userId > 2147483647) {
      return NextResponse.json(
        { error: 'User ID is too large. Maximum value is 2147483647.' },
        { status: 400 }
      )
    }

    // Ambil user dari service
    const user = await usersService.GET.ById(userId)
    
    // Jika user tidak ditemukan
    if (!user) {
      return NextResponse.json(
        { error: `User with ID ${userId} not found` },
        { status: 404 }
      )
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error('Error fetching user by ID:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    )
  }
}
