import { NextRequest, NextResponse } from "next/server"
import { accessLogsService } from "@/services/database/access_logs/access_logs.service"

/**
 * POST /api/v1/access_logs - Membuat access log baru
 * @param req - NextRequest object dengan data access log baru
 * @returns Promise<NextResponse> - Response dengan access log yang dibuat atau error
 */
export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    const accessLog = await accessLogsService.POST.Create(data)
    return NextResponse.json(accessLog, { status: 201 })
  } catch (error) {
    console.error('Error creating access log:', error)
    return NextResponse.json(
      { error: 'Failed to create access log' },
      { status: 500 }
    )
  }
}