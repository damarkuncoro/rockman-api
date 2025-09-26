import { NextRequest, NextResponse } from "next/server"
import { routeFeaturesService } from "@/services/database/route_features/route_features.service"

/**
 * POST /api/v1/route_features - Membuat route feature baru
 * @param req - NextRequest object dengan data route feature
 * @returns Promise<NextResponse> - Response dengan route feature yang dibuat atau error
 */
export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    const routeFeature = await routeFeaturesService.POST.Create(data)
    return NextResponse.json(routeFeature, { status: 201 })
  } catch (error) {
    console.error('Error creating route feature:', error)
    return NextResponse.json(
      { error: 'Failed to create route feature' },
      { status: 500 }
    )
  }
}