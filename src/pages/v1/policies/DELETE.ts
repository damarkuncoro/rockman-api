import { NextRequest, NextResponse } from "next/server"
import { policiesService } from "@/services/database/policies/policies.service"

/**
 * DELETE /api/v1/policies - Menghapus policy
 * @param req - NextRequest object dengan ID policy yang akan dihapus
 * @returns Promise<NextResponse> - Response dengan konfirmasi penghapusan atau error
 */
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID is required' },
        { status: 400 }
      )
    }

    await policiesService.DELETE.Remove(parseInt(id))
    return NextResponse.json({ message: 'Policy deleted successfully' })
  } catch (error) {
    console.error('Error deleting policy:', error)
    return NextResponse.json(
      { error: 'Failed to delete policy' },
      { status: 500 }
    )
  }
}