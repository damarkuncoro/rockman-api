import { NextRequest, NextResponse } from "next/server"
import { featureCategoriesService } from "@/services/database/feature_categories/feature_categories.service"
import { createCorsResponse } from "@/utils/cors"

/**
 * DELETE /api/v1/feature-categories - Menghapus feature category
 * @param req - NextRequest object dengan ID feature category yang akan dihapus
 * @returns Promise<NextResponse> - Response dengan konfirmasi penghapusan atau error
 */
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return createCorsResponse(
        { error: 'ID is required' },
        { status: 400 }
      )
    }

    await featureCategoriesService.DELETE.Remove(parseInt(id))
    return createCorsResponse({ message: 'Feature category deleted successfully' })
  } catch (error) {
    console.error('Error deleting feature category:', error)
    return createCorsResponse(
      { error: 'Failed to delete feature category' },
      { status: 500 }
    )
  }
}