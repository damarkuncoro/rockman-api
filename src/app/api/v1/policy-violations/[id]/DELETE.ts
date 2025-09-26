import { NextRequest, NextResponse } from "next/server"
import { policyViolationsService } from "@/services/database/policy_violations/policy_violations.service"

/**
 * DELETE /api/v1/policy_violations/[id] - Menghapus policy violation berdasarkan ID
 * @param req - NextRequest object
 * @param params - Object berisi parameter ID
 * @returns Promise<NextResponse> - Response dengan konfirmasi penghapusan atau error
 */
export async function DELETE(
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

    await policyViolationsService.DELETE.Remove(id)
    return NextResponse.json({ message: 'Policy violation deleted successfully' })
  } catch (error) {
    console.error('Error deleting policy violation:', error)
    return NextResponse.json(
      { error: 'Failed to delete policy violation' },
      { status: 500 }
    )
  }
}