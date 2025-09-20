import { NextResponse } from "next/server"
import { rolesService } from "@/services/database/roles/roles.service"

/**
 * GET /api/v1/roles - Mengambil semua roles
 * @returns Promise<NextResponse> - Response dengan daftar roles atau error
 */
export async function GET() {
  try {
    const roles = await rolesService.GET.All()
    return NextResponse.json(roles)
  } catch (error) {
    console.error('Error fetching roles:', error)
    return NextResponse.json(
      { error: 'Failed to fetch roles' },
      { status: 500 }
    )
  }
}