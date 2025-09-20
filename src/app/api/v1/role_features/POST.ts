import { NextRequest, NextResponse } from "next/server"
import { roleFeaturesService } from "@/services/database/role_features/role_features.service"

/**
 * POST /api/v1/role_features - Membuat role feature baru
 * @param req - NextRequest object dengan data role feature
 * @returns Promise<NextResponse> - Response dengan role feature yang dibuat atau error
 */
export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    const roleFeature = await roleFeaturesService.POST.Create(data)
    return NextResponse.json(roleFeature, { status: 201 })
  } catch (error) {
    console.error('Error creating role feature:', error)
    return NextResponse.json(
      { error: 'Failed to create role feature' },
      { status: 500 }
    )
  }
}