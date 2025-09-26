import { NextRequest, NextResponse } from "next/server"
import { routeFeaturesService } from "@/services/database/route_features/route_features.service"

/**
 * PUT /api/v1/route_features/[id] - Update route feature berdasarkan ID
 * @param req - NextRequest object dengan data route feature yang akan diupdate
 * @param params - Object yang berisi parameter ID
 * @returns Promise<NextResponse> - Response dengan route feature yang diupdate atau error
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = parseInt((await params).id)
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid ID format' },
        { status: 400 }
      )
    }

    const data = await req.json()
    const routeFeature = await routeFeaturesService.PUT.Update(id, data)
    return NextResponse.json(routeFeature)
  } catch (error) {
    console.error('Error updating route feature by ID:', error)
    return NextResponse.json(
      { error: 'Failed to update route feature' },
      { status: 500 }
    )
  }
}