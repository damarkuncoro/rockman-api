import { NextResponse } from "next/server"
import { featuresService } from "@/services/database/features/features.service"

/**
 * GET /api/v1/features - Mengambil semua features
 * @returns Promise<NextResponse> - Response dengan daftar features atau error
 */
export async function GET() {
  try {
    const features = await featuresService.GET.All()
    return NextResponse.json(features)
  } catch (error) {
    console.error('Error fetching features:', error)
    return NextResponse.json(
      { error: 'Failed to fetch features' },
      { status: 500 }
    )
  }
}