import { NextResponse } from "next/server"
import { featureCategoriesService } from "@/services/database/feature_categories/feature_categories.service"
import { createCorsResponse } from "@/utils/cors"

/**
 * GET /api/v1/feature-categories - Mengambil semua feature categories
 * @returns Promise<NextResponse> - Response dengan daftar feature categories atau error
 */
export async function GET() {
  try {
    const categories = await featureCategoriesService.GET.All()
    return createCorsResponse(categories)
  } catch (error) {
    console.error('Error fetching feature categories:', error)
    return createCorsResponse(
      { error: 'Failed to fetch feature categories' },
      { status: 500 }
    )
  }
}