
import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'
import { addCorsHeaders } from '@/utils/cors'

/**
 * APPROACH 4: Direct API (Raw SQL)
 * Menggunakan raw SQL query untuk mengakses data users langsung dari database
 * 
 * @param request - NextRequest object
 * @returns NextResponse dengan data users dari raw SQL atau error
 */
export async function handleRawApproach(request: NextRequest) {
  console.log('\n🔧 APPROACH 4: Direct API (Raw SQL)')
  
  try {
    // Get DATABASE_URL from environment
    const databaseUrl = process.env.DATABASE_URL
    console.log('🔍 DATABASE_URL from env:', databaseUrl ? 'Found' : 'Not found')

    if (!databaseUrl) {
      console.error('❌ DATABASE_URL not found in environment')
      return addCorsHeaders(NextResponse.json({
        method: 'raw',
        error: 'Database configuration missing',
        success: false
      }, { status: 500 }))
    }

    // Create pool connection
    const pool = new Pool({ connectionString: databaseUrl })
    console.log('✅ Database pool created')

    try {
      // Test connection first
      const testResult = await pool.query('SELECT COUNT(*) as count FROM users')
      console.log('📊 Test query result:', testResult.rows[0])

      // Use raw SQL query that matches the actual database schema
      const result = await pool.query(`
        SELECT 
          id, 
          name, 
          email, 
          password_hash as "passwordHash", 
          active, 
          roles_updated_at as "rolesUpdatedAt",
          department,
          region,
          level, 
          created_at as "createdAt", 
          updated_at as "updatedAt"
        FROM users 
        ORDER BY id
      `)

      console.log('📊 Raw SQL query result count:', result.rows.length)
      console.log('📊 First user from raw SQL:', result.rows[0])

      if (result.rows && result.rows.length > 0) {
        return addCorsHeaders(NextResponse.json({
          method: 'raw',
          data: result.rows,
          count: result.rows.length,
          success: true
        }))
      } else {
        return addCorsHeaders(NextResponse.json({
          method: 'raw',
          data: [],
          count: 0,
          message: 'No users found',
          success: true
        }))
      }
    } finally {
      // Always close the pool connection
      await pool.end()
    }
  } catch (rawError) {
    console.error('❌ Raw SQL - Error:', rawError)
    return addCorsHeaders(NextResponse.json({
      method: 'raw',
      error: 'Raw SQL method failed',
      details: rawError instanceof Error ? rawError.message : 'Unknown error',
      success: false
    }, { status: 500 }))
  }
}
