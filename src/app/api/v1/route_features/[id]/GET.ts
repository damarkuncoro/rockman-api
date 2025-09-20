import { NextRequest, NextResponse } from "next/server"
import { routeFeaturesService } from "@/services/database/route_features/route_features.service"

/**
 * GET /api/v1/route_features/[id] - Mengambil route feature berdasarkan ID
 * @param req - NextRequest object
 * @param params - Object yang berisi parameter ID
 * @returns Promise<NextResponse> - Response dengan route feature atau error
 */
export async function GET(
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

    const routeFeature = await routeFeaturesService.GET.ById(id)
    return NextResponse.json(routeFeature)
  } catch (error) {
    console.error('Error fetching route feature by ID:', error)
    return NextResponse.json(
      { error: 'Failed to fetch route feature' },
      { status: 500 }
    )
  }
}