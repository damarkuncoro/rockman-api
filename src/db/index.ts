import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

// Membuat connection pool untuk performa yang lebih baik
const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
});

// Inisialisasi Drizzle dengan pool connection
const db = drizzle(pool);

export default db;