import { NextRequest, NextResponse } from "next/server"
import { departmentsService } from "@/services/database/departments/departments.service"
import { createCorsResponse } from "@/utils/cors"
import { departmentQuerySchema } from "@/db/schema/departments"

/**
 * GET /api/v1/departments - Mengambil daftar departments dengan pagination dan filtering
 * 
 * Query Parameters:
 * - page: number (optional) - Halaman yang diminta
 * - limit: number (optional) - Jumlah item per halaman
 * - sortBy: string (optional) - Field untuk sorting
 * - sortOrder: 'asc' | 'desc' (optional) - Arah sorting
 * - isActive: boolean (optional) - Filter berdasarkan status aktif
 * - search: string (optional) - Pencarian berdasarkan nama atau kode
 * 
 * @param req - NextRequest object dengan query parameters
 * @returns Promise<NextResponse> - Response dengan daftar departments atau error
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    
    // Konversi search params ke object
    const queryParams = Object.fromEntries(searchParams.entries())
    
    // Validasi query parameters
    const validatedQuery = departmentQuerySchema.parse(queryParams)
    
    // Jika tidak ada query parameters, ambil semua departments aktif
    if (Object.keys(validatedQuery).length === 0) {
      const departments = await departmentsService.getActiveDepartments()
      return createCorsResponse(departments)
    }
    
    // Jika ada query parameters, gunakan search dengan pagination
    const result = await departmentsService.searchDepartments(validatedQuery)
    return createCorsResponse(result)
    
  } catch (error) {
    console.error('Error fetching departments:', error)
    
    // Handle validation errors
    if (error instanceof Error && error.message.includes('validation')) {
      return createCorsResponse(
        { error: 'Invalid query parameters', details: error.message },
        { status: 400 }
      )
    }
    
    return createCorsResponse(
      { error: 'Failed to fetch departments' },
      { status: 500 }
    )
  }
}