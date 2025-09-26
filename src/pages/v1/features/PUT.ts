import { NextRequest, NextResponse } from "next/server"
import { featuresService } from "@/services/database/features/features.service"

/**
 * PUT /api/v1/features - Update feature
 * @param req - NextRequest object dengan data feature yang akan diupdate
 * @returns Promise<NextResponse> - Response dengan feature yang diupdate atau error
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

    const feature = await featuresService.PUT.Update(data.id, data)
    return NextResponse.json(feature)
  } catch (error) {
    console.error('Error updating feature:', error)
    return NextResponse.json(
      { error: 'Failed to update feature' },
      { status: 500 }
    )
  }
}