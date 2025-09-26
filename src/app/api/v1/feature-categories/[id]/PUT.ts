import { NextRequest, NextResponse } from "next/server"
import { featureCategoriesService } from "@/services/database/feature_categories/feature_categories.service"
import { createCorsResponse } from "@/utils/cors"

/**
 * PUT /api/v1/feature-categories/[id] - Update feature category berdasarkan ID
 * @param req - NextRequest object dengan data update
 * @param params - Object berisi parameter ID
 * @returns Promise<NextResponse> - Response dengan feature category yang diupdate atau error
 */
export async function PUT(
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

    const data = await req.json()
    const category = await featureCategoriesService.PUT.Update(id, data)
    
    return createCorsResponse(category)
  } catch (error) {
    console.error('Error updating feature category:', error)
    return createCorsResponse(
      { error: 'Failed to update feature category' },
      { status: 500 }
    )
  }
}