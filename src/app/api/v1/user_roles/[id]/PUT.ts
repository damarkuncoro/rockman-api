import { NextRequest, NextResponse } from "next/server"
import { userRolesService } from "@/services/database/user_roles/user_roles.service"

/**
 * PUT /api/v1/user_roles/[id] - Update user role berdasarkan ID
 * @param req - NextRequest object dengan data update
 * @param params - Object berisi parameter ID
 * @returns Promise<NextResponse> - Response dengan user role yang diupdate atau error
 */
export async function PUT(
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

    const data = await req.json()
    const userRole = await userRolesService.PUT.Update(id, data)
    
    return NextResponse.json(userRole)
  } catch (error) {
    console.error('Error updating user role:', error)
    return NextResponse.json(
      { error: 'Failed to update user role' },
      { status: 500 }
    )
  }
}