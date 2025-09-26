import { NextRequest, NextResponse } from "next/server"
import { accessLogsService } from "@/services/database/access_logs/access_logs.service"

/**
 * GET /api/v1/access_logs/[id] - Mengambil access log berdasarkan ID
 * @param req - NextRequest object
 * @param params - Object berisi parameter ID
 * @returns Promise<NextResponse> - Response dengan access log atau error
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

    const accessLog = await accessLogsService.GET.ById(id)
    
    if (!accessLog) {
      return NextResponse.json(
        { error: 'Access log not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(accessLog)
  } catch (error) {
    console.error('Error fetching access log:', error)
    return NextResponse.json(
      { error: 'Failed to fetch access log' },
      { status: 500 }
    )
  }
}