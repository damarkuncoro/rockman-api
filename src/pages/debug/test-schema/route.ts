import { NextResponse } from 'next/server';
import { drizzle } from 'drizzle-orm/node-postgres';

/**
 * API endpoint untuk test validasi schema database
 * GET /api/debug/test-schema
 */
export async function GET() {
  try {
    // Inisialisasi Drizzle dengan DATABASE_URL
    const db = drizzle(process.env.DATABASE_URL!);
    
    const startTime = Date.now();
    
    // Daftar tabel yang akan divalidasi (hardcoded untuk menghindari import error)
    const tableNames = [
      'users', 'sessions', 'roles', 'features', 'user_roles', 
      'role_features', 'route_features', 'policies', 'access_logs', 
      'policy_violations', 'change_history'
    ];
    const validationResults: Record<string, unknown> = {};
    
    // Test setiap tabel untuk memastikan schema valid
    for (const tableName of tableNames) {
      try {
        // Query sederhana untuk test apakah tabel ada dan dapat diakses
        const result = await db.execute(`
          SELECT COUNT(*) as count 
          FROM information_schema.tables 
          WHERE table_name = '${tableName}' 
          AND table_schema = 'public'
        `);
        
        const tableExists = parseInt(result.rows[0].count as string) > 0;
        
        if (tableExists) {
          // Jika tabel ada, coba query struktur kolom
          const columnsResult = await db.execute(`
            SELECT column_name, data_type, is_nullable 
            FROM information_schema.columns 
            WHERE table_name = '${tableName}' 
            AND table_schema = 'public'
            ORDER BY ordinal_position
          `);
          
          validationResults[tableName] = {
            exists: true,
            columns: columnsResult.rows.length,
            structure: columnsResult.rows.map(row => ({
              name: row.column_name,
              type: row.data_type,
              nullable: row.is_nullable === 'YES'
            }))
          };
        } else {
          validationResults[tableName] = {
            exists: false,
            error: 'Tabel tidak ditemukan di database'
          };
        }
        
      } catch (tableError) {
        validationResults[tableName] = {
          exists: false,
          error: tableError instanceof Error ? tableError.message : 'Unknown error'
        };
      }
    }
    
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    // Hitung statistik
    const totalTables = tableNames.length;
    const existingTables = Object.values(validationResults).filter(result => (result as { exists?: boolean }).exists).length;
    const missingTables = totalTables - existingTables;
    
    // Tentukan status keseluruhan
    const allTablesExist = missingTables === 0;
    
    return NextResponse.json({
      success: allTablesExist,
      message: allTablesExist 
        ? 'Semua schema database valid dan tabel tersedia'
        : `${missingTables} dari ${totalTables} tabel tidak ditemukan`,
      details: {
        'Total Tables': totalTables,
        'Existing Tables': existingTables,
        'Missing Tables': missingTables,
        'Validation Time': `${responseTime}ms`,
        'Schema Status': allTablesExist ? 'Complete' : 'Incomplete'
      },
      tableDetails: validationResults
    });

  } catch (error) {
    console.error('Schema validation error:', error);
    
    // Tentukan jenis error yang lebih spesifik
    let errorMessage = 'Validasi schema database gagal';
    let errorDetails = {};
    
    if (error instanceof Error) {
      if (error.message.includes('ECONNREFUSED')) {
        errorMessage = 'Tidak dapat terhubung ke database untuk validasi schema';
        errorDetails = {
          'Error Type': 'Connection Refused',
          'Possible Cause': 'Database server tidak berjalan'
        };
      } else if (error.message.includes('permission denied')) {
        errorMessage = 'Tidak memiliki permission untuk mengakses schema';
        errorDetails = {
          'Error Type': 'Permission Denied',
          'Possible Cause': 'User database tidak memiliki akses ke information_schema'
        };
      } else if (error.message.includes('schema')) {
        errorMessage = 'Error dalam konfigurasi schema';
        errorDetails = {
          'Error Type': 'Schema Configuration Error',
          'Possible Cause': 'File schema tidak dapat dimuat atau tidak valid'
        };
      } else {
        errorDetails = {
          'Error Type': 'Unknown Schema Error',
          'Error Message': error.message
        };
      }
    }

    return NextResponse.json({
      success: false,
      error: errorMessage,
      message: 'Test validasi schema gagal',
      details: errorDetails
    }, { status: 500 });
  }
}