import { NextResponse } from 'next/server';

/**
 * API endpoint untuk mendapatkan konfigurasi database
 * GET /api/debug/database-config
 */
export async function GET() {
  try {
    // Periksa apakah DATABASE_URL ada
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({
        success: false,
        error: 'DATABASE_URL tidak ditemukan di environment variables'
      }, { status: 500 });
    }

    // Parse URL database untuk mendapatkan informasi koneksi
    const url = new URL(process.env.DATABASE_URL);
    
    const config = {
      'Host': url.hostname,
      'Port': url.port,
      'Database': url.pathname.slice(1),
      'Username': url.username,
      'Password': url.password ? '***' : 'tidak ada',
      'Protocol': url.protocol.replace(':', ''),
      'Status': 'Konfigurasi Valid'
    };

    return NextResponse.json({
      success: true,
      data: config,
      message: 'Konfigurasi database berhasil dimuat'
    });

  } catch (error) {
    console.error('Error parsing database config:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Format DATABASE_URL tidak valid',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}