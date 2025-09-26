import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { eq } from "drizzle-orm";
import { users } from "../../../rockman-tests/src/db/schema/users";
import * as bcrypt from "bcryptjs";

// Inisialisasi koneksi database
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool);

/**
 * Data sampel untuk tabel users
 * Mencakup berbagai department, region, dan level untuk testing ABAC
 */
const usersData = [
  // Super Admin
  {
    name: "Super Admin",
    email: "admin@rockman.com",
    password: "admin123",
    department: "IT",
    region: "Jakarta",
    level: 5,
    active: true,
  },
  // IT Department
  {
    name: "John Doe",
    email: "john.doe@rockman.com", 
    password: "password123",
    department: "IT",
    region: "Jakarta",
    level: 4,
    active: true,
  },
  {
    name: "Jane Smith",
    email: "jane.smith@rockman.com",
    password: "password123", 
    department: "IT",
    region: "Surabaya",
    level: 3,
    active: true,
  },
  // Finance Department
  {
    name: "Michael Johnson",
    email: "michael.johnson@rockman.com",
    password: "password123",
    department: "Finance",
    region: "Jakarta",
    level: 4,
    active: true,
  },
  {
    name: "Sarah Wilson",
    email: "sarah.wilson@rockman.com",
    password: "password123",
    department: "Finance", 
    region: "Bandung",
    level: 2,
    active: true,
  },
  // HR Department
  {
    name: "David Brown",
    email: "david.brown@rockman.com",
    password: "password123",
    department: "HR",
    region: "Jakarta",
    level: 3,
    active: true,
  },
  {
    name: "Lisa Davis",
    email: "lisa.davis@rockman.com",
    password: "password123",
    department: "HR",
    region: "Medan",
    level: 2,
    active: true,
  },
  // Marketing Department
  {
    name: "Robert Miller",
    email: "robert.miller@rockman.com",
    password: "password123",
    department: "Marketing",
    region: "Jakarta",
    level: 3,
    active: true,
  },
  {
    name: "Emily Garcia",
    email: "emily.garcia@rockman.com",
    password: "password123",
    department: "Marketing",
    region: "Bali",
    level: 2,
    active: true,
  },
  // Operations Department
  {
    name: "James Rodriguez",
    email: "james.rodriguez@rockman.com",
    password: "password123",
    department: "Operations",
    region: "Surabaya",
    level: 4,
    active: true,
  },
  {
    name: "Maria Martinez",
    email: "maria.martinez@rockman.com",
    password: "password123",
    department: "Operations",
    region: "Yogyakarta",
    level: 1,
    active: true,
  },
  // Sales Department
  {
    name: "Christopher Lee",
    email: "christopher.lee@rockman.com",
    password: "password123",
    department: "Sales",
    region: "Jakarta",
    level: 3,
    active: true,
  },
  {
    name: "Amanda Taylor",
    email: "amanda.taylor@rockman.com",
    password: "password123",
    department: "Sales",
    region: "Makassar",
    level: 2,
    active: true,
  },
  // Inactive user untuk testing
  {
    name: "Inactive User",
    email: "inactive@rockman.com",
    password: "password123",
    department: "IT",
    region: "Jakarta",
    level: 1,
    active: false,
  },
];

/**
 * Fungsi untuk hash password menggunakan bcrypt
 */
async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

/**
 * Fungsi utama untuk seeding users
 * Menggunakan upsert logic berdasarkan email
 */
export async function seedUsers() {
  try {
    console.log('🌱 Mulai seeding users...');

    let insertedCount = 0;
    let updatedCount = 0;

    for (const userData of usersData) {
      // Hash password
      const passwordHash = await hashPassword(userData.password);

      // Cek apakah user sudah ada berdasarkan email
      const existingUser = await db
        .select()
        .from(users)
        .where(eq(users.email, userData.email))
        .limit(1);

      if (existingUser.length === 0) {
        // Insert user baru jika belum ada
        await db
          .insert(users)
          .values({
            name: userData.name,
            email: userData.email,
            passwordHash: passwordHash,
            departmentId: null, // TODO: Map department name to departmentId
            region: userData.region,
            level: userData.level,
            active: userData.active,
          });

        console.log(`✅ User "${userData.name}" berhasil ditambahkan`);
        insertedCount++;
      } else {
        // Update user yang sudah ada
        await db
          .update(users)
          .set({
            name: userData.name,
            passwordHash: passwordHash,
            departmentId: null, // TODO: Map department name to departmentId
            region: userData.region,
            level: userData.level,
            active: userData.active,
            updatedAt: new Date(),
          })
          .where(eq(users.email, userData.email));

        console.log(`🔄 User "${userData.name}" berhasil diperbarui`);
        updatedCount++;
      }
    }

    // Tampilkan statistik
    const totalUsers = await db.select().from(users);
    const activeUsers = totalUsers.filter(user => user.active);
    const inactiveUsers = totalUsers.filter(user => !user.active);
    
    console.log(`\n📊 Statistik Users:`);
    console.log(`   - User baru ditambahkan: ${insertedCount}`);
    console.log(`   - User diperbarui: ${updatedCount}`);
    console.log(`   - Total user di database: ${totalUsers.length}`);
    console.log(`   - User aktif: ${activeUsers.length}`);
    console.log(`   - User tidak aktif: ${inactiveUsers.length}`);
    
    // Tampilkan distribusi per region
    const regions = [...new Set(totalUsers.map(user => user.region).filter(Boolean))];
    console.log(`   - Region: ${regions.join(', ')}`);
    
    console.log('🎉 Seeding users selesai!');
    
  } catch (error) {
    console.error('❌ Error saat seeding users:', error);
    throw error;
  }
}

/**
 * Fungsi untuk menghapus semua data users (untuk testing)
 */
export async function resetUsers() {
  try {
    console.log('🗑️ Menghapus semua data users...');
    
    await db.delete(users);
    
    console.log('✅ Semua data users berhasil dihapus');
  } catch (error) {
    console.error('❌ Error saat menghapus users:', error);
    throw error;
  }
}

// Jalankan seeding jika file dijalankan langsung
if (require.main === module) {
  seedUsers()
    .then(() => {
      console.log('✅ Seeding users berhasil');
      pool.end();
    })
    .catch((error) => {
      console.error('❌ Seeding users gagal:', error);
      pool.end();
      process.exit(1);
    });
}