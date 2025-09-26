import { NextRequest, NextResponse } from "next/server"
import { roleFeaturesService } from "@/services/database/role_features/role_features.service"

/**
 * GET /api/v1/role_features/[id] - Mengambil role feature berdasarkan ID
 * @param req - NextRequest object
 * @param params - Object berisi parameter ID
 * @returns Promise<NextResponse> - Response dengan role feature atau error
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = parseInt((await params).id)
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid ID format' },
        { status: 400 }
      )
    }

    const roleFeature = await roleFeaturesService.GET.ById(id)
    
    if (!roleFeature) {
      return NextResponse.json(
        { error: 'Role feature not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(roleFeature)
  } catch (error) {
    console.error('Error fetching role feature:', error)
    return NextResponse.json(
      { error: 'Failed to fetch role feature' },
      { status: 500 }
    )
  }
}