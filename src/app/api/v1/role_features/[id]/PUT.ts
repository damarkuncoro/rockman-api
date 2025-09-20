import { NextRequest, NextResponse } from "next/server"
import { roleFeaturesService } from "@/services/database/role_features/role_features.service"

/**
 * PUT /api/v1/role_features/[id] - Update role feature berdasarkan ID
 * @param req - NextRequest object dengan data update
 * @param params - Object berisi parameter ID
 * @returns Promise<NextResponse> - Response dengan role feature yang diupdate atau error
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
    const roleFeature = await roleFeaturesService.PUT.Update(id, data)
    
    return NextResponse.json(roleFeature)
  } catch (error) {
    console.error('Error updating role feature:', error)
    return NextResponse.json(
      { error: 'Failed to update role feature' },
      { status: 500 }
    )
  }
}