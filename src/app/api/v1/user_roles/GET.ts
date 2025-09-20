import { NextResponse } from "next/server"
import { userRolesService } from "@/services/database/user_roles/user_roles.service"

/**
 * GET /api/v1/user_roles - Mengambil semua user roles
 * @returns Promise<NextResponse> - Response dengan array user roles atau error
 */
export async function GET() {
  try {
    const userRoles = await userRolesService.GET.All()
    return NextResponse.json(userRoles)
  } catch (error) {
    console.error('Error fetching user roles:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user roles' },
      { status: 500 }
    )
  }
}