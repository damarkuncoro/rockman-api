import { NextRequest, NextResponse } from "next/server"
import { featuresService } from "@/services/database/features/features.service"

/**
 * PUT /api/v1/features/[id] - Update feature berdasarkan ID
 * @param req - NextRequest object dengan data update
 * @param params - Object berisi parameter ID
 * @returns Promise<NextResponse> - Response dengan feature yang diupdate atau error
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
    const feature = await featuresService.PUT.Update(id, data)
    
    return NextResponse.json(feature)
  } catch (error) {
    console.error('Error updating feature:', error)
    return NextResponse.json(
      { error: 'Failed to update feature' },
      { status: 500 }
    )
  }
}