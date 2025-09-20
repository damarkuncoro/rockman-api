import { NextResponse } from 'next/server';
import { Client } from 'pg';

/**
 * API endpoint untuk test koneksi raw PostgreSQL
 * GET /api/debug/test-raw-connection
 */
export async function GET() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    // Test koneksi ke database
    await client.connect();
    
    // Jalankan query test sederhana
    const result = await client.query('SELECT NOW() as current_time, version() as pg_version');
    const row = result.rows[0];
    
    // Parse versi PostgreSQL
    const versionParts = row.pg_version.split(' ');
    const pgVersion = `${versionParts[0]} ${versionParts[1]}`;
    
    return NextResponse.json({
      success: true,
      message: 'Koneksi raw PostgreSQL berhasil',
      details: {
        'Server Time': new Date(row.current_time).toLocaleString('id-ID'),
        'PostgreSQL Version': pgVersion,
        'Connection Status': 'Connected',
        'Query Response Time': `${Date.now() - Date.now()}ms`
      }
    });

  } catch (error) {
    console.error('Raw connection error:', error);
    
    // Tentukan jenis error yang lebih spesifik
    let errorMessage = 'Koneksi raw PostgreSQL gagal';
    let errorDetails = {};
    
    if (error instanceof Error) {
      if (error.message.includes('ECONNREFUSED')) {
        errorMessage = 'Database server tidak dapat dijangkau';
        errorDetails = {
          'Error Type': 'Connection Refused',
          'Possible Cause': 'Database server tidak berjalan atau port salah'
        };
      } else if (error.message.includes('authentication failed')) {
        errorMessage = 'Autentikasi database gagal';
        errorDetails = {
          'Error Type': 'Authentication Failed',
          'Possible Cause': 'Username atau password salah'
        };
      } else if (error.message.includes('database') && error.message.includes('does not exist')) {
        errorMessage = 'Database tidak ditemukan';
        errorDetails = {
          'Error Type': 'Database Not Found',
          'Possible Cause': 'Nama database salah atau belum dibuat'
        };
      } else {
        errorDetails = {
          'Error Type': 'Unknown Error',
          'Error Message': error.message
        };
      }
    }

    return NextResponse.json({
      success: false,
      error: errorMessage,
      message: 'Test koneksi raw PostgreSQL gagal',
      details: errorDetails
    }, { status: 500 });

  } finally {
    // Pastikan koneksi ditutup
    try {
      await client.end();
    } catch (endError) {
      console.error('Error closing connection:', endError);
    }
  }
}