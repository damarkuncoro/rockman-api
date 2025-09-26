import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { eq, and } from "drizzle-orm";
import { userRoles } from "../../../rockman-tests/src/db/schema/user_roles";
import { users } from "../../../rockman-tests/src/db/schema/users";
import { roles } from "../../../rockman-tests/src/db/schema/roles";

// Inisialisasi koneksi database
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool);

/**
 * Data sampel untuk tabel user_roles
 * Mapping users ke roles berdasarkan email dan nama role
 */
const userRolesData = [
  // Super Admin
  {
    userEmail: "admin@rockman.com",
    roleName: "Super Admin"
  },

  // IT Department
  {
    userEmail: "john.doe@rockman.com",
    roleName: "IT Support"
  },
  {
    userEmail: "john.doe@rockman.com", 
    roleName: "Manager" // John juga manager
  },
  {
    userEmail: "jane.smith@rockman.com",
    roleName: "IT Support"
  },

  // Finance Department
  {
    userEmail: "michael.johnson@rockman.com",
    roleName: "Finance Manager"
  },
  {
    userEmail: "michael.johnson@rockman.com",
    roleName: "Manager" // Michael juga manager
  },
  {
    userEmail: "sarah.wilson@rockman.com",
    roleName: "Employee"
  },

  // HR Department
  {
    userEmail: "david.brown@rockman.com",
    roleName: "HR Manager"
  },
  {
    userEmail: "david.brown@rockman.com",
    roleName: "Supervisor" // David juga supervisor
  },
  {
    userEmail: "lisa.davis@rockman.com",
    roleName: "Employee"
  },

  // Marketing Department
  {
    userEmail: "robert.miller@rockman.com",
    roleName: "Marketing Manager"
  },
  {
    userEmail: "robert.miller@rockman.com",
    roleName: "Supervisor" // Robert juga supervisor
  },
  {
    userEmail: "emily.garcia@rockman.com",
    roleName: "Employee"
  },

  // Operations Department
  {
    userEmail: "james.rodriguez@rockman.com",
    roleName: "Operations Manager"
  },
  {
    userEmail: "james.rodriguez@rockman.com",
    roleName: "Manager" // James juga manager
  },
  {
    userEmail: "maria.martinez@rockman.com",
    roleName: "Employee"
  },

  // Sales Department
  {
    userEmail: "christopher.lee@rockman.com",
    roleName: "Sales Manager"
  },
  {
    userEmail: "christopher.lee@rockman.com",
    roleName: "Supervisor" // Christopher juga supervisor
  },
  {
    userEmail: "amanda.taylor@rockman.com",
    roleName: "Employee"
  },

  // Inactive user (tetap diberi role untuk testing)
  {
    userEmail: "inactive@rockman.com",
    roleName: "Guest"
  },

  // Additional role assignments untuk testing multiple roles
  {
    userEmail: "michael.johnson@rockman.com",
    roleName: "Auditor" // Finance manager juga auditor
  },
  {
    userEmail: "david.brown@rockman.com",
    roleName: "Auditor" // HR manager juga auditor
  },
];

/**
 * Fungsi helper untuk mendapatkan user ID berdasarkan email
 */
async function getUserIdByEmail(email: string): Promise<number | undefined> {
  const user = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);
  
  return user[0]?.id;
}

/**
 * Fungsi helper untuk mendapatkan role ID berdasarkan nama
 */
async function getRoleIdByName(roleName: string): Promise<number | undefined> {
  const role = await db
    .select()
    .from(roles)
    .where(eq(roles.name, roleName))
    .limit(1);
  
  return role[0]?.id;
}

/**
 * Fungsi utama untuk seeding user_roles
 * Menggunakan upsert logic berdasarkan kombinasi userId dan roleId
 */
export async function seedUserRoles() {
  try {
    console.log('🌱 Mulai seeding user_roles...');

    let insertedCount = 0;
    let skippedCount = 0;
    let existingCount = 0;

    // Cache untuk userId dan roleId agar tidak query berulang
    const userCache = new Map<string, number>();
    const roleCache = new Map<string, number>();

    for (const userRoleData of userRolesData) {
      // Ambil userId dari cache atau database
      let userId = userCache.get(userRoleData.userEmail);
      if (!userId) {
        userId = await getUserIdByEmail(userRoleData.userEmail);
        if (userId) {
          userCache.set(userRoleData.userEmail, userId);
        }
      }

      // Ambil roleId dari cache atau database
      let roleId = roleCache.get(userRoleData.roleName);
      if (!roleId) {
        roleId = await getRoleIdByName(userRoleData.roleName);
        if (roleId) {
          roleCache.set(userRoleData.roleName, roleId);
        }
      }

      if (!userId) {
        console.warn(`⚠️ User "${userRoleData.userEmail}" tidak ditemukan, skip assignment`);
        skippedCount++;
        continue;
      }

      if (!roleId) {
        console.warn(`⚠️ Role "${userRoleData.roleName}" tidak ditemukan, skip assignment`);
        skippedCount++;
        continue;
      }

      // Cek apakah user_role sudah ada berdasarkan kombinasi userId dan roleId
      const existingUserRole = await db
        .select()
        .from(userRoles)
        .where(
          and(
            eq(userRoles.userId, userId),
            eq(userRoles.roleId, roleId)
          )
        )
        .limit(1);

      if (existingUserRole.length === 0) {
        // Insert user_role baru jika belum ada
        await db
          .insert(userRoles)
          .values({
            userId: userId,
            roleId: roleId,
          });

        console.log(`✅ User "${userRoleData.userEmail}" assigned to role "${userRoleData.roleName}"`);
        insertedCount++;
      } else {
        console.log(`🔄 User "${userRoleData.userEmail}" sudah memiliki role "${userRoleData.roleName}"`);
        existingCount++;
      }
    }

    console.log('🎉 Seeding user_roles selesai!');
    
    // Tampilkan ringkasan
    const totalUserRoles = await db.select().from(userRoles);
    
    // Hitung statistik
    const uniqueUsers = new Set(totalUserRoles.map(ur => ur.userId)).size;
    const uniqueRoles = new Set(totalUserRoles.map(ur => ur.roleId)).size;
    
    console.log(`📊 Ringkasan Seeding User Roles:`);
    console.log(`   - Assignment baru ditambahkan: ${insertedCount}`);
    console.log(`   - Assignment sudah ada: ${existingCount}`);
    console.log(`   - Assignment dilewati: ${skippedCount}`);
    console.log(`   - Total user-role assignments: ${totalUserRoles.length}`);
    console.log(`   - Unique users dengan role: ${uniqueUsers}`);
    console.log(`   - Unique roles yang diassign: ${uniqueRoles}`);
    
    // Tampilkan distribusi role per user
    const userRoleCount = totalUserRoles.reduce((acc, ur) => {
      acc[ur.userId] = (acc[ur.userId] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);
    
    const multiRoleUsers = Object.values(userRoleCount).filter(count => count > 1).length;
    console.log(`   - Users dengan multiple roles: ${multiRoleUsers}`);
    
  } catch (error) {
    console.error('❌ Error saat seeding user_roles:', error);
    throw error;
  }
}

/**
 * Fungsi untuk menghapus semua data user_roles (untuk testing)
 */
export async function resetUserRoles() {
  try {
    console.log('🗑️ Menghapus semua data user_roles...');
    
    await db.delete(userRoles);
    
    console.log('✅ Semua data user_roles berhasil dihapus');
  } catch (error) {
    console.error('❌ Error saat menghapus user_roles:', error);
    throw error;
  }
}

// Jalankan seeding jika file dijalankan langsung
if (require.main === module) {
  seedUserRoles()
    .then(() => {
      console.log('✅ Seeding user_roles berhasil');
      pool.end();
    })
    .catch((error) => {
      console.error('❌ Seeding user_roles gagal:', error);
      pool.end();
      process.exit(1);
    });
}