import { NextResponse } from "next/server"
import { usersService } from "@/services/database/users/users.service"

/**
 * GET /api/v1/users - Mengambil semua users
 * @returns Promise<NextResponse> - Response dengan array users atau error
 */
export async function GET() {
  try {
    const users = await usersService.GET.All()
    return NextResponse.json(users)
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}
