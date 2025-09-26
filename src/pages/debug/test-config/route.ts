import { NextResponse } from 'next/server';

/**
 * API endpoint untuk test konfigurasi environment
 * GET /api/debug/test-config
 */
export async function GET() {
  try {
    // Periksa apakah DATABASE_URL ada
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({
        success: false,
        error: 'DATABASE_URL tidak ditemukan di environment variables',
        message: 'Konfigurasi environment tidak valid'
      }, { status: 500 });
    }

    // Validasi format URL
    try {
      const url = new URL(process.env.DATABASE_URL);
      
      // Periksa komponen URL yang diperlukan
      if (!url.hostname || !url.port || !url.pathname || !url.username) {
        return NextResponse.json({
          success: false,
          error: 'DATABASE_URL tidak lengkap',
          message: 'Format DATABASE_URL tidak memiliki semua komponen yang diperlukan',
          details: {
            hostname: url.hostname || 'missing',
            port: url.port || 'missing',
            database: url.pathname.slice(1) || 'missing',
            username: url.username || 'missing'
          }
        }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        message: 'Konfigurasi environment valid',
        details: {
          host: url.hostname,
          port: url.port,
          database: url.pathname.slice(1),
          username: url.username,
          protocol: url.protocol.replace(':', '')
        }
      });

    } catch (urlError) {
      return NextResponse.json({
        success: false,
        error: 'Format DATABASE_URL tidak valid',
        message: 'URL database tidak dapat di-parse',
        details: urlError instanceof Error ? urlError.message : 'Unknown URL error'
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Error testing config:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Error tidak terduga saat test konfigurasi',
      message: 'Terjadi kesalahan internal',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}