import { NextRequest, NextResponse } from "next/server"
import { sessionsService } from "@/services/database/sessions/sessions.service"

/**
 * PUT /api/v1/sessions/[id] - Update session berdasarkan ID
 * @param req - NextRequest object dengan data session yang akan diupdate
 * @param params - Object yang berisi parameter ID
 * @returns Promise<NextResponse> - Response dengan session yang diupdate atau error
 */
export async function PUT(
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

    const data = await req.json()
    const session = await sessionsService.PUT.Update(id, data)
    return NextResponse.json(session)
  } catch (error) {
    console.error('Error updating session by ID:', error)
    return NextResponse.json(
      { error: 'Failed to update session' },
      { status: 500 }
    )
  }
}