import { NextRequest, NextResponse } from "next/server"
import { featureCategoriesService } from "@/services/database/feature_categories/feature_categories.service"
import { createCorsResponse } from "@/utils/cors"

/**
 * DELETE /api/v1/feature-categories/[id] - Menghapus feature category berdasarkan ID
 * @param req - NextRequest object
 * @param params - Object berisi parameter ID
 * @returns Promise<NextResponse> - Response dengan konfirmasi penghapusan atau error
 */
export async function DELETE(
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

    await featureCategoriesService.DELETE.Remove(id)
    return createCorsResponse({ message: 'Feature category deleted successfully' })
  } catch (error) {
    console.error('Error deleting feature category:', error)
    return createCorsResponse(
      { error: 'Failed to delete feature category' },
      { status: 500 }
    )
  }
}