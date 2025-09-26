import { NextRequest, NextResponse } from "next/server"
import { featuresService } from "@/services/database/features/features.service"

/**
 * GET /api/v1/features/[id] - Mengambil feature berdasarkan ID
 * @param req - NextRequest object
 * @param params - Object berisi parameter ID
 * @returns Promise<NextResponse> - Response dengan feature atau error
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Ambil CORS origin dari environment variable dengan fallback
  const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:3000'
  
  try {
    const id = parseInt((await params).id)
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid ID format' },
        { 
          status: 400,
          headers: {
            'Access-Control-Allow-Origin': corsOrigin,
            'Access-Control-Allow-Credentials': 'true',
          }
        }
      )
    }

    const feature = await featuresService.GET.ById(id)
    
    if (!feature) {
      return NextResponse.json(
        { error: 'Feature not found' },
        { 
          status: 404,
          headers: {
            'Access-Control-Allow-Origin': corsOrigin,
            'Access-Control-Allow-Credentials': 'true',
          }
        }
      )
    }

    return NextResponse.json(feature, {
      headers: {
        'Access-Control-Allow-Origin': corsOrigin,
        'Access-Control-Allow-Credentials': 'true',
      }
    })
  } catch (error) {
    console.error('Error fetching feature:', error)
    return NextResponse.json(
      { error: 'Failed to fetch feature' },
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': corsOrigin,
          'Access-Control-Allow-Credentials': 'true',
        }
      }
    )
  }
}