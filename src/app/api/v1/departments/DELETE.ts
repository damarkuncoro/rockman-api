import { NextRequest, NextResponse } from "next/server"
import { departmentsService } from "@/services/database/departments/departments.service"
import { createCorsResponse } from "@/utils/cors"
import { bulkDepartmentSchema } from "@/db/schema/departments"

/**
 * DELETE /api/v1/departments - Soft delete departments secara bulk
 * 
 * Request Body:
 * - ids: number[] - Array ID departments yang akan dihapus
 * - action: 'delete' - Aksi delete (untuk konsistensi dengan bulk operations)
 * 
 * @param req - NextRequest object dengan data departments yang akan dihapus
 * @returns Promise<NextResponse> - Response dengan hasil operasi atau error
 */
export async function DELETE(req: NextRequest) {
  try {
    const data = await req.json()
    
    // Validasi input data
    const validatedData = bulkDepartmentSchema.parse(data)
    
    // Pastikan action adalah delete
    if (validatedData.action !== 'delete') {
      return createCorsResponse(
        { error: 'Invalid action. Only "delete" action is allowed for DELETE endpoint.' },
        { status: 400 }
      )
    }
    
    // Lakukan soft delete untuk setiap department
    const results = []
    const errors = []
    
    for (const id of validatedData.ids) {
      try {
        const result = await departmentsService.softDeleteDepartment(id)
        results.push({ id, success: result })
      } catch (error) {
        errors.push({ 
          id, 
          error: error instanceof Error ? error.message : 'Unknown error' 
        })
      }
    }
    
    // Jika ada error pada beberapa departments
    if (errors.length > 0) {
      return createCorsResponse({
        success: false,
        message: `Partially completed. ${results.length} departments deleted, ${errors.length} failed.`,
        results,
        errors
      }, { status: 207 }) // Multi-Status
    }
    
    // Jika semua berhasil
    return createCorsResponse({
      success: true,
      message: `Successfully deleted ${results.length} departments`,
      results
    })
    
  } catch (error) {
    console.error('Error deleting departments:', error)
    
    // Handle validation errors
    if (error instanceof Error) {
      if (error.message.includes('validation') || error.message.includes('parse')) {
        return createCorsResponse(
          { error: 'Invalid input data', details: error.message },
          { status: 400 }
        )
      }
    }
    
    return createCorsResponse(
      { error: 'Failed to delete departments' },
      { status: 500 }
    )
  }
}