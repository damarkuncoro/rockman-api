import { NextRequest, NextResponse } from "next/server"
import { featuresService } from "@/services/database/features/features.service"

/**
 * POST /api/v1/features - Membuat feature baru
 * @param req - NextRequest object dengan data feature
 * @returns Promise<NextResponse> - Response dengan feature yang dibuat atau error
 */
export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    const feature = await featuresService.POST.Create(data)
    return NextResponse.json(feature, { status: 201 })
  } catch (error) {
    console.error('Error creating feature:', error)
    return NextResponse.json(
      { error: 'Failed to create feature' },
      { status: 500 }
    )
  }
}