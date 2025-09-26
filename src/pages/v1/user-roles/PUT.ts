import { NextRequest, NextResponse } from "next/server"
import { userRolesService } from "@/services/database/user_roles/user_roles.service"

/**
 * PUT /api/v1/user_roles - Update user role
 * @param req - NextRequest object dengan data user role yang akan diupdate
 * @returns Promise<NextResponse> - Response dengan user role yang diupdate atau error
 */
export async function PUT(req: NextRequest) {
  try {
    const data = await req.json()
    const userRole = await userRolesService.PUT.Update(data.id, data)
    return NextResponse.json(userRole)
  } catch (error) {
    console.error('Error updating user role:', error)
    return NextResponse.json(
      { error: 'Failed to update user role' },
      { status: 500 }
    )
  }
}