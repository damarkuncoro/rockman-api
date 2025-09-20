import { NextRequest, NextResponse } from "next/server"
import { roleFeaturesService } from "@/services/database/role_features/role_features.service"

/**
 * PUT /api/v1/role_features - Update role feature
 * @param req - NextRequest object dengan data role feature yang akan diupdate
 * @returns Promise<NextResponse> - Response dengan role feature yang diupdate atau error
 */
export async function PUT(req: NextRequest) {
  try {
    const data = await req.json()
    
    if (!data.id) {
      return NextResponse.json(
        { error: 'ID is required for update' },
        { status: 400 }
      )
    }

    const roleFeature = await roleFeaturesService.PUT.Update(data.id, data)
    return NextResponse.json(roleFeature)
  } catch (error) {
    console.error('Error updating role feature:', error)
    return NextResponse.json(
      { error: 'Failed to update role feature' },
      { status: 500 }
    )
  }
}