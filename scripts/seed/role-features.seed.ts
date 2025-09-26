import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { eq, and } from "drizzle-orm";
import { roleFeatures } from "../../../rockman-tests/src/db/schema/role_features";
import { roles } from "../../../rockman-tests/src/db/schema/roles";
import { features } from "../../../rockman-tests/src/db/schema/features";

// Inisialisasi koneksi database
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool);

/**
 * Data sampel untuk tabel role_features
 * Mapping roles ke features dengan permission CRUD yang spesifik
 */
const roleFeaturesData = [
  // Super Admin - Full access ke semua fitur
  {
    roleName: "Super Admin",
    featureName: "User Management",
    canCreate: true,
    canRead: true,
    canUpdate: true,
    canDelete: true
  },
  {
    roleName: "Super Admin",
    featureName: "Role Management",
    canCreate: true,
    canRead: true,
    canUpdate: true,
    canDelete: true
  },
  {
    roleName: "Super Admin",
    featureName: "System Configuration",
    canCreate: true,
    canRead: true,
    canUpdate: true,
    canDelete: true
  },
  {
    roleName: "Super Admin",
    featureName: "Audit Logs",
    canCreate: true,
    canRead: true,
    canUpdate: true,
    canDelete: true
  },

  // Admin - Akses luas tapi tidak bisa delete critical data
  {
    roleName: "Admin",
    featureName: "User Management",
    canCreate: true,
    canRead: true,
    canUpdate: true,
    canDelete: false
  },
  {
    roleName: "Admin",
    featureName: "Role Management",
    canCreate: false,
    canRead: true,
    canUpdate: true,
    canDelete: false
  },
  {
    roleName: "Admin",
    featureName: "System Configuration",
    canCreate: false,
    canRead: true,
    canUpdate: true,
    canDelete: false
  },
  {
    roleName: "Admin",
    featureName: "Audit Logs",
    canCreate: false,
    canRead: true,
    canUpdate: false,
    canDelete: false
  },

  // HR Manager - Full access ke HR features
  {
    roleName: "HR Manager",
    featureName: "User Management",
    canCreate: true,
    canRead: true,
    canUpdate: true,
    canDelete: false
  },
  {
    roleName: "HR Manager",
    featureName: "Employee Performance",
    canCreate: true,
    canRead: true,
    canUpdate: true,
    canDelete: false
  },
  {
    roleName: "HR Manager",
    featureName: "Payroll Management",
    canCreate: true,
    canRead: true,
    canUpdate: true,
    canDelete: false
  },
  {
    roleName: "HR Manager",
    featureName: "Attendance Tracking",
    canCreate: true,
    canRead: true,
    canUpdate: true,
    canDelete: false
  },

  // Finance Manager - Full access ke Finance features
  {
    roleName: "Finance Manager",
    featureName: "Financial Reports",
    canCreate: true,
    canRead: true,
    canUpdate: true,
    canDelete: false
  },
  {
    roleName: "Finance Manager",
    featureName: "Budget Planning",
    canCreate: true,
    canRead: true,
    canUpdate: true,
    canDelete: false
  },
  {
    roleName: "Finance Manager",
    featureName: "Expense Management",
    canCreate: true,
    canRead: true,
    canUpdate: true,
    canDelete: false
  },
  {
    roleName: "Finance Manager",
    featureName: "Invoice Management",
    canCreate: true,
    canRead: true,
    canUpdate: true,
    canDelete: false
  },

  // IT Support - Technical features
  {
    roleName: "IT Support",
    featureName: "System Configuration",
    canCreate: false,
    canRead: true,
    canUpdate: true,
    canDelete: false
  },
  {
    roleName: "IT Support",
    featureName: "Backup Management",
    canCreate: true,
    canRead: true,
    canUpdate: true,
    canDelete: false
  },
  {
    roleName: "IT Support",
    featureName: "Security Settings",
    canCreate: false,
    canRead: true,
    canUpdate: true,
    canDelete: false
  },
  {
    roleName: "IT Support",
    featureName: "User Management",
    canCreate: false,
    canRead: true,
    canUpdate: false,
    canDelete: false
  },

  // Sales Manager - Sales features
  {
    roleName: "Sales Manager",
    featureName: "Sales Reports",
    canCreate: true,
    canRead: true,
    canUpdate: true,
    canDelete: false
  },
  {
    roleName: "Sales Manager",
    featureName: "Customer Management",
    canCreate: true,
    canRead: true,
    canUpdate: true,
    canDelete: false
  },
  {
    roleName: "Sales Manager",
    featureName: "Lead Management",
    canCreate: true,
    canRead: true,
    canUpdate: true,
    canDelete: false
  },
  {
    roleName: "Sales Manager",
    featureName: "Sales Analytics",
    canCreate: false,
    canRead: true,
    canUpdate: false,
    canDelete: false
  },

  // Marketing Manager - Marketing features
  {
    roleName: "Marketing Manager",
    featureName: "Marketing Analytics",
    canCreate: true,
    canRead: true,
    canUpdate: true,
    canDelete: false
  },
  {
    roleName: "Marketing Manager",
    featureName: "Campaign Management",
    canCreate: true,
    canRead: true,
    canUpdate: true,
    canDelete: false
  },
  {
    roleName: "Marketing Manager",
    featureName: "Content Management",
    canCreate: true,
    canRead: true,
    canUpdate: true,
    canDelete: false
  },
  {
    roleName: "Marketing Manager",
    featureName: "Social Media Management",
    canCreate: true,
    canRead: true,
    canUpdate: true,
    canDelete: false
  },

  // Operations Manager - Operations features
  {
    roleName: "Operations Manager",
    featureName: "Inventory Management",
    canCreate: true,
    canRead: true,
    canUpdate: true,
    canDelete: false
  },
  {
    roleName: "Operations Manager",
    featureName: "Supply Chain Management",
    canCreate: true,
    canRead: true,
    canUpdate: true,
    canDelete: false
  },
  {
    roleName: "Operations Manager",
    featureName: "Quality Control",
    canCreate: true,
    canRead: true,
    canUpdate: true,
    canDelete: false
  },
  {
    roleName: "Operations Manager",
    featureName: "Production Planning",
    canCreate: true,
    canRead: true,
    canUpdate: true,
    canDelete: false
  },

  // Manager - General management features
  {
    roleName: "Manager",
    featureName: "Employee Performance",
    canCreate: false,
    canRead: true,
    canUpdate: true,
    canDelete: false
  },
  {
    roleName: "Manager",
    featureName: "Team Management",
    canCreate: true,
    canRead: true,
    canUpdate: true,
    canDelete: false
  },
  {
    roleName: "Manager",
    featureName: "Project Management",
    canCreate: true,
    canRead: true,
    canUpdate: true,
    canDelete: false
  },
  {
    roleName: "Manager",
    featureName: "Task Management",
    canCreate: true,
    canRead: true,
    canUpdate: true,
    canDelete: false
  },

  // Supervisor - Limited management features
  {
    roleName: "Supervisor",
    featureName: "Team Management",
    canCreate: false,
    canRead: true,
    canUpdate: true,
    canDelete: false
  },
  {
    roleName: "Supervisor",
    featureName: "Task Management",
    canCreate: true,
    canRead: true,
    canUpdate: true,
    canDelete: false
  },
  {
    roleName: "Supervisor",
    featureName: "Attendance Tracking",
    canCreate: false,
    canRead: true,
    canUpdate: true,
    canDelete: false
  },
  {
    roleName: "Supervisor",
    featureName: "Performance Monitoring",
    canCreate: false,
    canRead: true,
    canUpdate: false,
    canDelete: false
  },

  // Employee - Basic features
  {
    roleName: "Employee",
    featureName: "Profile Management",
    canCreate: false,
    canRead: true,
    canUpdate: true,
    canDelete: false
  },
  {
    roleName: "Employee",
    featureName: "Task Management",
    canCreate: false,
    canRead: true,
    canUpdate: true,
    canDelete: false
  },
  {
    roleName: "Employee",
    featureName: "Time Tracking",
    canCreate: true,
    canRead: true,
    canUpdate: true,
    canDelete: false
  },
  {
    roleName: "Employee",
    featureName: "Leave Management",
    canCreate: true,
    canRead: true,
    canUpdate: false,
    canDelete: false
  },

  // Auditor - Read-only access to audit features
  {
    roleName: "Auditor",
    featureName: "Audit Logs",
    canCreate: false,
    canRead: true,
    canUpdate: false,
    canDelete: false
  },
  {
    roleName: "Auditor",
    featureName: "Compliance Reports",
    canCreate: false,
    canRead: true,
    canUpdate: false,
    canDelete: false
  },
  {
    roleName: "Auditor",
    featureName: "Financial Reports",
    canCreate: false,
    canRead: true,
    canUpdate: false,
    canDelete: false
  },
  {
    roleName: "Auditor",
    featureName: "User Management",
    canCreate: false,
    canRead: true,
    canUpdate: false,
    canDelete: false
  },

  // Guest - Very limited access
  {
    roleName: "Guest",
    featureName: "Profile Management",
    canCreate: false,
    canRead: true,
    canUpdate: false,
    canDelete: false
  },
  {
    roleName: "Guest",
    featureName: "Dashboard",
    canCreate: false,
    canRead: true,
    canUpdate: false,
    canDelete: false
  },
];

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
 * Fungsi helper untuk mendapatkan feature ID berdasarkan nama
 */
async function getFeatureIdByName(featureName: string): Promise<number | undefined> {
  const feature = await db
    .select()
    .from(features)
    .where(eq(features.name, featureName))
    .limit(1);
  
  return feature[0]?.id;
}

/**
 * Fungsi utama untuk seeding role_features
 * Menggunakan upsert logic berdasarkan kombinasi roleId dan featureId
 */
export async function seedRoleFeatures() {
  try {
    console.log('🌱 Mulai seeding role_features...');

    let insertedCount = 0;
    let updatedCount = 0;
    let skippedCount = 0;

    // Cache untuk roleId dan featureId agar tidak query berulang
    const roleCache = new Map<string, number>();
    const featureCache = new Map<string, number>();

    for (const roleFeatureData of roleFeaturesData) {
      // Ambil roleId dari cache atau database
      let roleId = roleCache.get(roleFeatureData.roleName);
      if (!roleId) {
        roleId = await getRoleIdByName(roleFeatureData.roleName);
        if (roleId) {
          roleCache.set(roleFeatureData.roleName, roleId);
        }
      }

      // Ambil featureId dari cache atau database
      let featureId = featureCache.get(roleFeatureData.featureName);
      if (!featureId) {
        featureId = await getFeatureIdByName(roleFeatureData.featureName);
        if (featureId) {
          featureCache.set(roleFeatureData.featureName, featureId);
        }
      }

      if (!roleId) {
        console.warn(`⚠️ Role "${roleFeatureData.roleName}" tidak ditemukan, skip permission`);
        skippedCount++;
        continue;
      }

      if (!featureId) {
        console.warn(`⚠️ Feature "${roleFeatureData.featureName}" tidak ditemukan, skip permission`);
        skippedCount++;
        continue;
      }

      // Cek apakah role_feature sudah ada berdasarkan kombinasi roleId dan featureId
      const existingRoleFeature = await db
        .select()
        .from(roleFeatures)
        .where(
          and(
            eq(roleFeatures.roleId, roleId),
            eq(roleFeatures.featureId, featureId)
          )
        )
        .limit(1);

      if (existingRoleFeature.length === 0) {
        // Insert role_feature baru jika belum ada
        await db
          .insert(roleFeatures)
          .values({
            roleId: roleId,
            featureId: featureId,
            canCreate: roleFeatureData.canCreate,
            canRead: roleFeatureData.canRead,
            canUpdate: roleFeatureData.canUpdate,
            canDelete: roleFeatureData.canDelete,
          });

        console.log(`✅ Permission "${roleFeatureData.roleName}" -> "${roleFeatureData.featureName}" berhasil ditambahkan`);
        insertedCount++;
      } else {
        // Update permission yang sudah ada
        await db
          .update(roleFeatures)
          .set({
            canCreate: roleFeatureData.canCreate,
            canRead: roleFeatureData.canRead,
            canUpdate: roleFeatureData.canUpdate,
            canDelete: roleFeatureData.canDelete,
          })
          .where(
            and(
              eq(roleFeatures.roleId, roleId),
              eq(roleFeatures.featureId, featureId)
            )
          );

        console.log(`🔄 Permission "${roleFeatureData.roleName}" -> "${roleFeatureData.featureName}" berhasil diperbarui`);
        updatedCount++;
      }
    }

    console.log('🎉 Seeding role_features selesai!');
    
    // Tampilkan ringkasan
    const totalRoleFeatures = await db.select().from(roleFeatures);
    
    // Hitung statistik permission
    const permissionStats = totalRoleFeatures.reduce((acc, rf) => {
      if (rf.canCreate) acc.create++;
      if (rf.canRead) acc.read++;
      if (rf.canUpdate) acc.update++;
      if (rf.canDelete) acc.delete++;
      return acc;
    }, { create: 0, read: 0, update: 0, delete: 0 });
    
    // Hitung unique roles dan features
    const uniqueRoles = new Set(totalRoleFeatures.map(rf => rf.roleId)).size;
    const uniqueFeatures = new Set(totalRoleFeatures.map(rf => rf.featureId)).size;
    
    console.log(`📊 Ringkasan Seeding Role Features:`);
    console.log(`   - Permission baru ditambahkan: ${insertedCount}`);
    console.log(`   - Permission diperbarui: ${updatedCount}`);
    console.log(`   - Permission dilewati: ${skippedCount}`);
    console.log(`   - Total role-feature permissions: ${totalRoleFeatures.length}`);
    console.log(`   - Unique roles dengan permission: ${uniqueRoles}`);
    console.log(`   - Unique features dengan permission: ${uniqueFeatures}`);
    
    console.log(`   - Distribusi permission:`);
    console.log(`     🟢 CREATE: ${permissionStats.create} permissions`);
    console.log(`     🔵 READ: ${permissionStats.read} permissions`);
    console.log(`     🟡 UPDATE: ${permissionStats.update} permissions`);
    console.log(`     🔴 DELETE: ${permissionStats.delete} permissions`);
    
  } catch (error) {
    console.error('❌ Error saat seeding role_features:', error);
    throw error;
  }
}

/**
 * Fungsi untuk menghapus semua data role_features (untuk testing)
 */
export async function resetRoleFeatures() {
  try {
    console.log('🗑️ Menghapus semua data role_features...');
    
    await db.delete(roleFeatures);
    
    console.log('✅ Semua data role_features berhasil dihapus');
  } catch (error) {
    console.error('❌ Error saat menghapus role_features:', error);
    throw error;
  }
}

// Jalankan seeding jika file dijalankan langsung
if (require.main === module) {
  seedRoleFeatures()
    .then(() => {
      console.log('✅ Seeding role_features berhasil');
      pool.end();
    })
    .catch((error) => {
      console.error('❌ Seeding role_features gagal:', error);
      pool.end();
      process.exit(1);
    });
}