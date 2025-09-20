import { NextRequest, NextResponse } from "next/server"
import { userRolesService } from "@/services/database/user_roles/user_roles.service"

/**
 * GET /api/v1/user_roles/[id] - Mengambil user role berdasarkan ID
 * @param req - NextRequest object
 * @param params - Object berisi parameter ID
 * @returns Promise<NextResponse> - Response dengan user role atau error
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid ID format' },
        { status: 400 }
      )
    }

    const userRole = await userRolesService.GET.ById(id)
    
    if (!userRole) {
      return NextResponse.json(
        { error: 'User role not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(userRole)
  } catch (error) {
    console.error('Error fetching user role:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user role' },
      { status: 500 }
    )
  }
}