import { NextRequest, NextResponse } from "next/server"
import { routeFeaturesService } from "@/services/database/route_features/route_features.service"

/**
 * GET /api/v1/route_features/[id] - Mengambil route feature berdasarkan ID
 * @param req - NextRequest object
 * @param params - Object yang berisi parameter ID
 * @returns Promise<NextResponse> - Response dengan route feature atau error
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = parseInt((await params).id)
    
    if (isNaN(id)) {
      const response = NextResponse.json(
        { error: 'Invalid ID format' },
        { status: 400 }
      )
      // Tambahkan CORS headers
      const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:3000'
      response.headers.set('Access-Control-Allow-Origin', corsOrigin)
      response.headers.set('Access-Control-Allow-Credentials', 'true')
      return response
    }

    const routeFeature = await routeFeaturesService.GET.ById(id)
    const response = NextResponse.json(routeFeature)
    
    // Tambahkan CORS headers untuk response sukses
    const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:3000'
    response.headers.set('Access-Control-Allow-Origin', corsOrigin)
    response.headers.set('Access-Control-Allow-Credentials', 'true')
    
    return response
  } catch (error) {
    console.error('Error fetching route feature by ID:', error)
    const response = NextResponse.json(
      { error: 'Failed to fetch route feature' },
      { status: 500 }
    )
    // Tambahkan CORS headers untuk error response
    const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:3000'
    response.headers.set('Access-Control-Allow-Origin', corsOrigin)
    response.headers.set('Access-Control-Allow-Credentials', 'true')
    return response
  }
}