import { NextRequest, NextResponse } from "next/server"
import { accessLogsService } from "@/services/database/access_logs/access_logs.service"

/**
 * PUT /api/v1/access_logs - Update access log
 * @param req - NextRequest object dengan data access log yang akan diupdate
 * @returns Promise<NextResponse> - Response dengan access log yang diupdate atau error
 */
export async function PUT(req: NextRequest) {
  try {
    const data = await req.json()
    const accessLog = await accessLogsService.PUT.Update(data.id, data)
    return NextResponse.json(accessLog)
  } catch (error) {
    console.error('Error updating access log:', error)
    return NextResponse.json(
      { error: 'Failed to update access log' },
      { status: 500 }
    )
  }
}