import { NextResponse } from "next/server"
import { routeFeaturesService } from "@/services/database/route_features/route_features.service"
import { createCorsResponse } from "@/utils/cors"

/**
 * GET /api/v1/route_features - Mengambil semua route features
 * @returns Promise<NextResponse> - Response dengan daftar route features atau error
 */
export async function GET() {
  try {
    const routeFeatures = await routeFeaturesService.GET.All()
    return createCorsResponse(routeFeatures)
  } catch (error) {
    console.error('Error fetching route features:', error)
    return createCorsResponse(
      { error: 'Failed to fetch route features' },
      { status: 500 }
    )
  }
}