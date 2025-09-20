import { NextResponse } from "next/server"
import { accessLogsService } from "@/services/database/access_logs/access_logs.service"

/**
 * GET /api/v1/access_logs - Mengambil semua access logs
 * @returns Promise<NextResponse> - Response dengan array access logs atau error
 */
export async function GET() {
  try {
    const accessLogs = await accessLogsService.GET.All()
    return NextResponse.json(accessLogs)
  } catch (error) {
    console.error('Error fetching access logs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch access logs' },
      { status: 500 }
    )
  }
}