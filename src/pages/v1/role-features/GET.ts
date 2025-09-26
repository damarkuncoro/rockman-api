import { NextResponse } from "next/server"
import { roleFeaturesService } from "@/services/database/role_features/role_features.service"

/**
 * GET /api/v1/role_features - Mengambil semua role features
 * @returns Promise<NextResponse> - Response dengan daftar role features atau error
 */
export async function GET() {
  try {
    const roleFeatures = await roleFeaturesService.GET.All()
    return NextResponse.json(roleFeatures)
  } catch (error) {
    console.error('Error fetching role features:', error)
    return NextResponse.json(
      { error: 'Failed to fetch role features' },
      { status: 500 }
    )
  }
}