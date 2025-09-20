#!/usr/bin/env tsx

/**
 * Script untuk menguji koneksi database PostgreSQL
 * Menggunakan Drizzle ORM dan pg client
 */

import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Client } from 'pg';

/**
 * Fungsi untuk menguji koneksi database menggunakan pg client
 */
async function testRawConnection(): Promise<boolean> {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    console.log('🔄 Menguji koneksi raw PostgreSQL...');
    await client.connect();
    
    // Test query sederhana
    const result = await client.query('SELECT NOW() as current_time, version() as pg_version');
    console.log('✅ Koneksi raw PostgreSQL berhasil!');
    console.log('📅 Waktu server:', result.rows[0].current_time);
    console.log('🐘 Versi PostgreSQL:', result.rows[0].pg_version.split(' ')[0] + ' ' + result.rows[0].pg_version.split(' ')[1]);
    
    return true;
  } catch (error) {
    console.error('❌ Koneksi raw PostgreSQL gagal:', error);
    return false;
  } finally {
    await client.end();
  }
}

/**
 * Fungsi untuk menguji koneksi database menggunakan Drizzle ORM
 */
async function testDrizzleConnection(): Promise<boolean> {
  try {
    console.log('🔄 Menguji koneksi Drizzle ORM...');
    const db = drizzle(process.env.DATABASE_URL!);
    
    // Test query menggunakan Drizzle
    const result = await db.execute('SELECT NOW() as current_time');
    console.log('✅ Koneksi Drizzle ORM berhasil!');
    console.log('📅 Waktu server (via Drizzle):', result.rows[0].current_time);
    
    return true;
  } catch (error) {
    console.error('❌ Koneksi Drizzle ORM gagal:', error);
    return false;
  }
}

/**
 * Fungsi untuk memeriksa konfigurasi environment
 */
function checkEnvironmentConfig(): boolean {
  console.log('🔍 Memeriksa konfigurasi environment...');
  
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL tidak ditemukan di environment variables');
    return false;
  }
  
  console.log('✅ DATABASE_URL ditemukan');
  
  // Parse URL untuk menampilkan info koneksi (tanpa password)
  try {
    const url = new URL(process.env.DATABASE_URL);
    console.log('🔗 Info koneksi:');
    console.log('   - Host:', url.hostname);
    console.log('   - Port:', url.port);
    console.log('   - Database:', url.pathname.slice(1));
    console.log('   - Username:', url.username);
    console.log('   - Password:', url.password ? '***' : 'tidak ada');
    
    return true;
  } catch (error) {
    console.error('❌ Format DATABASE_URL tidak valid:', error);
    return false;
  }
}

/**
 * Fungsi utama untuk menjalankan semua test koneksi
 */
async function main(): Promise<void> {
  console.log('🚀 Memulai test koneksi database...\n');
  
  // 1. Periksa konfigurasi environment
  const configValid = checkEnvironmentConfig();
  console.log('');
  
  if (!configValid) {
    console.log('❌ Test dihentikan karena konfigurasi tidak valid');
    process.exit(1);
  }
  
  // 2. Test koneksi raw PostgreSQL
  const rawConnectionSuccess = await testRawConnection();
  console.log('');
  
  // 3. Test koneksi Drizzle ORM
  const drizzleConnectionSuccess = await testDrizzleConnection();
  console.log('');
  
  // 4. Ringkasan hasil
  console.log('📊 Ringkasan hasil test:');
  console.log('   - Konfigurasi environment:', configValid ? '✅' : '❌');
  console.log('   - Koneksi raw PostgreSQL:', rawConnectionSuccess ? '✅' : '❌');
  console.log('   - Koneksi Drizzle ORM:', drizzleConnectionSuccess ? '✅' : '❌');
  
  if (rawConnectionSuccess && drizzleConnectionSuccess) {
    console.log('\n🎉 Semua test koneksi berhasil! Database siap digunakan.');
    process.exit(0);
  } else {
    console.log('\n⚠️  Beberapa test koneksi gagal. Periksa konfigurasi database Anda.');
    process.exit(1);
  }
}

// Jalankan script jika dipanggil langsung
if (require.main === module) {
  main().catch((error) => {
    console.error('💥 Error tidak terduga:', error);
    process.exit(1);
  });
}

export { testRawConnection, testDrizzleConnection, checkEnvironmentConfig };