import { NextRequest, NextResponse } from "next/server"
import { featureCategoriesService } from "@/services/database/feature_categories/feature_categories.service"
import { createCorsResponse } from "@/utils/cors"

/**
 * PUT /api/v1/feature-categories - Update feature category
 * @param req - NextRequest object dengan data feature category yang akan diupdate
 * @returns Promise<NextResponse> - Response dengan feature category yang diupdate atau error
 */
export async function PUT(req: NextRequest) {
  try {
    const data = await req.json()
    
    if (!data.id) {
      return createCorsResponse(
        { error: 'ID is required for update' },
        { status: 400 }
      )
    }

    const category = await featureCategoriesService.PUT.Update(data.id, data)
    return createCorsResponse(category)
  } catch (error) {
    console.error('Error updating feature category:', error)
    return createCorsResponse(
      { error: 'Failed to update feature category' },
      { status: 500 }
    )
  }
}