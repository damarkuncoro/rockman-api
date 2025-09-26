import { NextResponse } from 'next/server';
import { drizzle } from 'drizzle-orm/node-postgres';

/**
 * API endpoint untuk test koneksi Drizzle ORM
 * GET /api/debug/test-drizzle-connection
 */
export async function GET() {
  try {
    // Inisialisasi Drizzle dengan DATABASE_URL
    const db = drizzle(process.env.DATABASE_URL!);
    
    const startTime = Date.now();
    
    // Test query menggunakan Drizzle
    const result = await db.execute('SELECT NOW() as current_time, current_database() as db_name');
    
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    const row = result.rows[0];
    
    return NextResponse.json({
      success: true,
      message: 'Koneksi Drizzle ORM berhasil',
      details: {
        'Server Time': new Date(row.current_time as string).toLocaleString('id-ID'),
        'Database Name': row.db_name,
        'ORM Status': 'Connected via Drizzle',
        'Query Response Time': `${responseTime}ms`,
        'Rows Returned': result.rows.length
      }
    });

  } catch (error) {
    console.error('Drizzle connection error:', error);
    
    // Tentukan jenis error yang lebih spesifik
    let errorMessage = 'Koneksi Drizzle ORM gagal';
    let errorDetails = {};
    
    if (error instanceof Error) {
      if (error.message.includes('ECONNREFUSED')) {
        errorMessage = 'Database server tidak dapat dijangkau melalui Drizzle';
        errorDetails = {
          'Error Type': 'Connection Refused',
          'Possible Cause': 'Database server tidak berjalan atau konfigurasi Drizzle salah'
        };
      } else if (error.message.includes('authentication failed')) {
        errorMessage = 'Autentikasi Drizzle gagal';
        errorDetails = {
          'Error Type': 'Authentication Failed',
          'Possible Cause': 'Kredensial database salah dalam konfigurasi Drizzle'
        };
      } else if (error.message.includes('database') && error.message.includes('does not exist')) {
        errorMessage = 'Database tidak ditemukan oleh Drizzle';
        errorDetails = {
          'Error Type': 'Database Not Found',
          'Possible Cause': 'Nama database salah dalam konfigurasi Drizzle'
        };
      } else if (error.message.includes('drizzle')) {
        errorMessage = 'Error konfigurasi Drizzle ORM';
        errorDetails = {
          'Error Type': 'Drizzle Configuration Error',
          'Possible Cause': 'Setup Drizzle ORM tidak benar'
        };
      } else {
        errorDetails = {
          'Error Type': 'Unknown Drizzle Error',
          'Error Message': error.message
        };
      }
    }

    return NextResponse.json({
      success: false,
      error: errorMessage,
      message: 'Test koneksi Drizzle ORM gagal',
      details: errorDetails
    }, { status: 500 });
  }
}