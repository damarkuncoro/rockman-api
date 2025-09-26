import { NextRequest, NextResponse } from "next/server"
import { routeFeaturesService } from "@/services/database/route_features/route_features.service"

/**
 * PUT /api/v1/route_features - Update route feature
 * @param req - NextRequest object dengan data route feature yang akan diupdate
 * @returns Promise<NextResponse> - Response dengan route feature yang diupdate atau error
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

    const routeFeature = await routeFeaturesService.PUT.Update(data.id, data)
    return NextResponse.json(routeFeature)
  } catch (error) {
    console.error('Error updating route feature:', error)
    return NextResponse.json(
      { error: 'Failed to update route feature' },
      { status: 500 }
    )
  }
}