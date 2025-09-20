import { NextRequest, NextResponse } from "next/server"
import { accessLogsService } from "@/services/database/access_logs/access_logs.service"

/**
 * PUT /api/v1/access_logs/[id] - Update access log berdasarkan ID
 * @param req - NextRequest object dengan data update
 * @param params - Object berisi parameter ID
 * @returns Promise<NextResponse> - Response dengan access log yang diupdate atau error
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid ID format' },
        { status: 400 }
      )
    }

    const data = await req.json()
    const accessLog = await accessLogsService.PUT.Update(id, data)
    
    return NextResponse.json(accessLog)
  } catch (error) {
    console.error('Error updating access log:', error)
    return NextResponse.json(
      { error: 'Failed to update access log' },
      { status: 500 }
    )
  }
}