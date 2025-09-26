import { NextRequest, NextResponse } from "next/server"
import { featureCategoriesService } from "@/services/database/feature_categories/feature_categories.service"
import { createCorsResponse } from "@/utils/cors"

/**
 * GET /api/v1/feature-categories/[id] - Mengambil feature category berdasarkan ID
 * @param req - NextRequest object
 * @param params - Object berisi parameter ID
 * @returns Promise<NextResponse> - Response dengan feature category atau error
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = parseInt((await params).id)
    
    if (isNaN(id)) {
      return createCorsResponse(
        { error: 'Invalid ID format' },
        { status: 400 }
      )
    }

    const category = await featureCategoriesService.GET.ById(id)
    
    if (!category) {
      return createCorsResponse(
        { error: 'Feature category not found' },
        { status: 404 }
      )
    }

    return createCorsResponse(category)
  } catch (error) {
    console.error('Error fetching feature category:', error)
    return createCorsResponse(
      { error: 'Failed to fetch feature category' },
      { status: 500 }
    )
  }
}