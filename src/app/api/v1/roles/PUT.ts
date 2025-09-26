import { NextRequest, NextResponse } from "next/server"
import { rolesService } from "@/services/database/roles/roles.service"
import { addCorsHeaders } from "@/utils/cors"

/**
 * PUT /api/v1/roles - Update role
 * @param req - NextRequest object dengan data role yang akan diupdate
 * @returns Promise<NextResponse> - Response dengan role yang diupdate atau error
 */
export async function PUT(req: NextRequest) {
  try {
    const data = await req.json()
    
    if (!data.id) {
      const errorResponse = NextResponse.json(
        { error: 'ID is required for update' },
        { status: 400 }
      )
      return addCorsHeaders(errorResponse)
    }

    const role = await rolesService.PUT.Update(data.id, data)
    const response = NextResponse.json(role)
    return addCorsHeaders(response)
  } catch (error) {
    console.error('Error updating role:', error)
    const errorResponse = NextResponse.json(
      { error: 'Failed to update role' },
      { status: 500 }
    )
    return addCorsHeaders(errorResponse)
  }
}