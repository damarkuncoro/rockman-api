import { NextRequest, NextResponse } from "next/server"
import { departmentsService } from "@/services/database/departments/departments.service"
import { createCorsResponse } from "@/utils/cors"
import { bulkDepartmentSchema, reorderDepartmentSchema } from "@/db/schema/departments"

/**
 * PUT /api/v1/departments - Bulk operations untuk departments
 * 
 * Mendukung dua jenis operasi:
 * 1. Bulk update status (activate/deactivate/delete)
 * 2. Reorder departments (update sortOrder)
 * 
 * Request Body untuk bulk status:
 * - ids: number[] - Array ID departments
 * - action: 'activate' | 'deactivate' | 'delete' - Aksi yang akan dilakukan
 * 
 * Request Body untuk reorder:
 * - departments: Array<{id: number, sortOrder: number}> - Array departments dengan sortOrder baru
 * 
 * @param req - NextRequest object dengan data bulk operation
 * @returns Promise<NextResponse> - Response dengan hasil operasi atau error
 */
export async function PUT(req: NextRequest) {
  try {
    const data = await req.json()
    
    // Deteksi jenis operasi berdasarkan struktur data
    if (data.departments && Array.isArray(data.departments)) {
      // Operasi reorder
      const validatedData = reorderDepartmentSchema.parse(data)
      const result = await departmentsService.reorderDepartments(validatedData)
      
      return createCorsResponse({ 
        success: result,
        message: `Successfully reordered ${validatedData.departments.length} departments`
      })
      
    } else if (data.ids && Array.isArray(data.ids) && data.action) {
      // Operasi bulk status
      const validatedData = bulkDepartmentSchema.parse(data)
      const result = await departmentsService.bulkUpdateStatus(validatedData)
      
      return createCorsResponse({ 
        success: result,
        message: `Successfully ${validatedData.action}d ${validatedData.ids.length} departments`
      })
      
    } else {
      return createCorsResponse(
        { error: 'Invalid request format. Expected bulk status update or reorder operation.' },
        { status: 400 }
      )
    }
    
  } catch (error) {
    console.error('Error in bulk department operation:', error)
    
    // Handle validation errors
    if (error instanceof Error) {
      if (error.message.includes('validation') || error.message.includes('parse')) {
        return createCorsResponse(
          { error: 'Invalid input data', details: error.message },
          { status: 400 }
        )
      }
      
      // Handle business logic errors
      if (error.message.includes('not found')) {
        return createCorsResponse(
          { error: 'Resource not found', details: error.message },
          { status: 404 }
        )
      }
    }
    
    return createCorsResponse(
      { error: 'Failed to perform bulk operation' },
      { status: 500 }
    )
  }
}