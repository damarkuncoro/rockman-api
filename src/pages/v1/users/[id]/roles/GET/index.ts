/**
 * GET /api/v1/users/[id]/roles
 * 
 * Domain: User Management - Role Assignment
 * Responsibility: Mendapatkan semua roles yang dimiliki oleh user tertentu
 * 
 * Menggunakan Registry Pattern untuk akses service yang terpusat
 * Mengikuti prinsip:
 * - SRP: Hanya menangani pengambilan roles user
 * - DRY: Menggunakan service registry yang sudah ada
 * - KISS: Interface sederhana untuk mendapatkan user roles
 * - SOLID: Dependency injection melalui registry
 */

import { NextRequest, NextResponse } from 'next/server'
import { SERVICE } from '@/core/core.service.registry'
// Import services untuk memastikan registrasi ke SERVICE registry
import '@/services/database/users/users.service'
import '@/services/database/user_roles/user_roles.service'
import '@/services/database/roles/roles.service'

/**
 * Interface untuk response user roles
 */
interface UserRoleResponse {
  userId: number
  roles: Array<{
    id: number
    name: string
    description?: string
    grantsAll: boolean
    createdAt: Date
    updatedAt: Date
  }>
  totalRoles: number
}

/**
 * GET Handler untuk mendapatkan roles user
 * 
 * @param request - NextRequest object
 * @param params - Route parameters berisi user ID
 * @returns NextResponse dengan data roles user atau error
 * 
 * @example
 * GET /api/v1/users/123/roles
 * Response:
 * {
 *   "success": true,
 *   "data": {
 *     "userId": 123,
 *     "roles": [
 *       {
 *         "id": 1,
 *         "name": "admin",
 *         "description": "Administrator role",
 *         "grantsAll": true,
 *         "createdAt": "2024-01-01T00:00:00.000Z",
 *         "updatedAt": "2024-01-01T00:00:00.000Z"
 *       }
 *     ],
 *     "totalRoles": 1
 *   }
 * }
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  console.log('\n🔍 GET /api/v1/users/[id]/roles - Registry Approach')
  
  try {
    // Await params sebelum menggunakan propertinya (Next.js 15 requirement)
    const resolvedParams = await params
    
    // Validasi parameter ID
    const userId = parseInt(resolvedParams.id)
    if (isNaN(userId) || userId <= 0) {
      return NextResponse.json({
        success: false,
        error: 'Invalid user ID',
        message: 'User ID harus berupa angka positif'
      }, { status: 400 })
    }

    console.log(`📋 Mengambil roles untuk user ID: ${userId}`)

    // Cek apakah user service terdaftar di registry
    if (!SERVICE.has('users')) {
      console.error('❌ Users service tidak terdaftar di SERVICE registry')
      return NextResponse.json({
        success: false,
        error: 'Users service not available',
        message: 'Service users belum terdaftar di registry'
      }, { status: 503 })
    }

    // Cek apakah user_roles service terdaftar di registry
    if (!SERVICE.has('user_roles')) {
      console.error('❌ User roles service tidak terdaftar di SERVICE registry')
      return NextResponse.json({
        success: false,
        error: 'User roles service not available',
        message: 'Service user_roles belum terdaftar di registry'
      }, { status: 503 })
    }

    // Cek apakah roles service terdaftar di registry
    if (!SERVICE.has('roles')) {
      console.error('❌ Roles service tidak terdaftar di SERVICE registry')
      return NextResponse.json({
        success: false,
        error: 'Roles service not available',
        message: 'Service roles belum terdaftar di registry'
      }, { status: 503 })
    }

    // Ambil service instances dari registry
    const usersService = SERVICE.get('users')
    const userRolesService = SERVICE.get('user_roles')
    const rolesService = SERVICE.get('roles')

    if (!usersService || !userRolesService || !rolesService) {
      return NextResponse.json({
        success: false,
        error: 'Service instances not available',
        message: 'Tidak dapat mengakses service instances dari registry'
      }, { status: 503 })
    }

    // Verifikasi user exists
    console.log('🔍 Memverifikasi keberadaan user...')
    const user = await (usersService as any).GET.ById(userId)
    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'User not found',
        message: `User dengan ID ${userId} tidak ditemukan`
      }, { status: 404 })
    }

    console.log(`✅ User ditemukan: ${user.name} (${user.email})`)

    // Ambil user roles dari user_roles table
    console.log('🔍 Mengambil user roles...')
    const userRoles = await (userRolesService as any).findByUserId(userId)
    
    if (!userRoles || userRoles.length === 0) {
      console.log('📝 User tidak memiliki roles')
      return NextResponse.json({
        success: true,
        data: {
          userId: userId,
          roles: [],
          totalRoles: 0
        },
        message: 'User tidak memiliki roles'
      })
    }

    console.log(`📋 Ditemukan ${userRoles.length} role assignments untuk user`)

    // Ambil detail roles berdasarkan role IDs
    const roleIds = userRoles.map((ur: any) => ur.roleId)
    console.log('🔍 Mengambil detail roles:', roleIds)

    const rolesDetails = await Promise.all(
      roleIds.map(async (roleId: number) => {
        return await (rolesService as any).GET.ById(roleId)
      })
    )

    // Filter out null results dan format response
    const validRoles = rolesDetails
      .filter(role => role !== null)
      .map(role => ({
        id: role.id,
        name: role.name,
        description: role.description,
        grantsAll: role.grantsAll,
        createdAt: role.createdAt,
        updatedAt: role.updatedAt
      }))

    console.log(`✅ Berhasil mengambil ${validRoles.length} roles untuk user ${userId}`)

    const response: UserRoleResponse = {
      userId: userId,
      roles: validRoles,
      totalRoles: validRoles.length
    }

    const jsonResponse = NextResponse.json({
      success: true,
      data: response,
      message: `Berhasil mengambil ${validRoles.length} roles untuk user ${userId}`
    })

    // Tambahkan CORS headers untuk mengizinkan akses dari frontend
    jsonResponse.headers.set('Access-Control-Allow-Origin', 'http://localhost:3000')
    jsonResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    jsonResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    jsonResponse.headers.set('Access-Control-Allow-Credentials', 'true')

    return jsonResponse

  } catch (error) {
    console.error('❌ Error dalam GET /api/v1/users/[id]/roles:', error)
    
    const errorResponse = NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: 'Terjadi kesalahan saat mengambil roles user',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })

    // Tambahkan CORS headers untuk error response juga
    errorResponse.headers.set('Access-Control-Allow-Origin', 'http://localhost:3000')
    errorResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    errorResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    errorResponse.headers.set('Access-Control-Allow-Credentials', 'true')

    return errorResponse
  }
}

/**
 * Export default untuk Next.js API route
 */
export default GET