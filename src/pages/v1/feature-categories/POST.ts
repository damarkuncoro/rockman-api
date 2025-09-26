import { NextRequest, NextResponse } from "next/server"
import { featureCategoriesService } from "@/services/database/feature_categories/feature_categories.service"
import { createCorsResponse } from "@/utils/cors"

/**
 * POST /api/v1/feature-categories - Membuat feature category baru
 * @param req - NextRequest object dengan data feature category
 * @returns Promise<NextResponse> - Response dengan feature category yang dibuat atau error
 */
export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    const category = await featureCategoriesService.POST.Create(data)
    return createCorsResponse(category, { status: 201 })
  } catch (error) {
    console.error('Error creating feature category:', error)
    return createCorsResponse(
      { error: 'Failed to create feature category' },
      { status: 500 }
    )
  }
}