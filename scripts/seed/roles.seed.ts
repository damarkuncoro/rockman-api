import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { eq } from "drizzle-orm";
import { roles } from "../../../rockman-tests/src/db/schema/roles";

// Inisialisasi koneksi database
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool);

/**
 * Data sampel untuk tabel roles
 * Role standar dalam sistem RBAC dengan hierarki yang jelas
 */
const rolesData = [
  {
    name: "Super Admin",
    grantsAll: true,
    description: "Akses penuh ke seluruh sistem tanpa batasan"
  },
  {
    name: "Admin",
    grantsAll: false,
    description: "Administrator dengan akses luas tapi terbatas"
  },
  {
    name: "Manager",
    grantsAll: false,
    description: "Manajer dengan akses ke fitur manajemen"
  },
  {
    name: "Supervisor",
    grantsAll: false,
    description: "Supervisor dengan akses terbatas untuk pengawasan"
  },
  {
    name: "Employee",
    grantsAll: false,
    description: "Karyawan dengan akses dasar"
  },
  {
    name: "HR Manager",
    grantsAll: false,
    description: "Manajer HR dengan akses ke fitur HR"
  },
  {
    name: "Finance Manager",
    grantsAll: false,
    description: "Manajer Finance dengan akses ke fitur keuangan"
  },
  {
    name: "IT Support",
    grantsAll: false,
    description: "Support IT dengan akses ke fitur teknis"
  },
  {
    name: "Sales Manager",
    grantsAll: false,
    description: "Manajer Sales dengan akses ke fitur penjualan"
  },
  {
    name: "Marketing Manager",
    grantsAll: false,
    description: "Manajer Marketing dengan akses ke fitur pemasaran"
  },
  {
    name: "Operations Manager",
    grantsAll: false,
    description: "Manajer Operasional dengan akses ke fitur operasional"
  },
  {
    name: "Auditor",
    grantsAll: false,
    description: "Auditor dengan akses read-only untuk audit"
  },
  {
    name: "Guest",
    grantsAll: false,
    description: "Tamu dengan akses sangat terbatas"
  },
];

/**
 * Fungsi utama untuk seeding roles
 * Menggunakan upsert logic berdasarkan nama role
 */
export async function seedRoles() {
  try {
    console.log('🌱 Mulai seeding roles...');

    let insertedCount = 0;
    let updatedCount = 0;

    for (const roleData of rolesData) {
      // Cek apakah role sudah ada berdasarkan nama
      const existingRole = await db
        .select()
        .from(roles)
        .where(eq(roles.name, roleData.name))
        .limit(1);

      if (existingRole.length === 0) {
        // Insert role baru jika belum ada
        await db
          .insert(roles)
          .values({
            name: roleData.name,
            grantsAll: roleData.grantsAll,
          });

        console.log(`✅ Role "${roleData.name}" berhasil ditambahkan`);
        insertedCount++;
      } else {
        // Update role yang sudah ada
        await db
          .update(roles)
          .set({
            grantsAll: roleData.grantsAll,
          })
          .where(eq(roles.name, roleData.name));

        console.log(`🔄 Role "${roleData.name}" berhasil diperbarui`);
        updatedCount++;
      }
    }

    console.log('🎉 Seeding roles selesai!');
    
    // Tampilkan ringkasan
    const totalRoles = await db.select().from(roles);
    const superAdminRoles = totalRoles.filter(role => role.grantsAll);
    const regularRoles = totalRoles.filter(role => !role.grantsAll);
    
    console.log(`📊 Ringkasan Seeding Roles:`);
    console.log(`   - Role baru ditambahkan: ${insertedCount}`);
    console.log(`   - Role diperbarui: ${updatedCount}`);
    console.log(`   - Total role di database: ${totalRoles.length}`);
    console.log(`   - Super Admin roles: ${superAdminRoles.length}`);
    console.log(`   - Regular roles: ${regularRoles.length}`);
    
    // Tampilkan daftar role
    console.log(`   - Daftar roles:`);
    totalRoles.forEach(role => {
      const badge = role.grantsAll ? '🔑' : '👤';
      console.log(`     ${badge} ${role.name}`);
    });
    
  } catch (error) {
    console.error('❌ Error saat seeding roles:', error);
    throw error;
  }
}

/**
 * Fungsi untuk menghapus semua data roles (untuk testing)
 */
export async function resetRoles() {
  try {
    console.log('🗑️ Menghapus semua data roles...');
    
    await db.delete(roles);
    
    console.log('✅ Semua data roles berhasil dihapus');
  } catch (error) {
    console.error('❌ Error saat menghapus roles:', error);
    throw error;
  }
}

/**
 * Fungsi helper untuk mendapatkan role ID berdasarkan nama
 */
export async function getRoleIdByName(roleName: string): Promise<number | undefined> {
  const role = await db
    .select()
    .from(roles)
    .where(eq(roles.name, roleName))
    .limit(1);
  
  return role[0]?.id;
}

// Jalankan seeding jika file dijalankan langsung
if (require.main === module) {
  seedRoles()
    .then(() => {
      console.log('✅ Seeding roles berhasil');
      pool.end();
    })
    .catch((error) => {
      console.error('❌ Seeding roles gagal:', error);
      pool.end();
      process.exit(1);
    });
}