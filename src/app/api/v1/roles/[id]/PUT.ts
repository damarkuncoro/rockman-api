import { NextRequest, NextResponse } from "next/server"
import { rolesService } from "@/services/database/roles/roles.service"

/**
 * PUT /api/v1/roles/[id] - Update role berdasarkan ID
 * @param req - NextRequest object dengan data role yang akan diupdate
 * @param params - Object yang berisi parameter ID
 * @returns Promise<NextResponse> - Response dengan role yang diupdate atau error
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
    const role = await rolesService.PUT.Update(id, data)
    return NextResponse.json(role)
  } catch (error) {
    console.error('Error updating role by ID:', error)
    return NextResponse.json(
      { error: 'Failed to update role' },
      { status: 500 }
    )
  }
}