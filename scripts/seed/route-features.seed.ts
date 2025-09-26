import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { eq, and, isNull } from "drizzle-orm";
import { routeFeatures } from "../../../rockman-tests/src/db/schema/route_features";
import { features } from "../../../rockman-tests/src/db/schema/features";

// Inisialisasi koneksi database
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool);

/**
 * Data sampel untuk tabel route_features
 * Mapping route API ke features yang diperlukan untuk akses
 */
const routeFeaturesData = [
  // User Management Routes
  { path: "/api/v1/users", method: "GET", featureName: "User Management" },
  { path: "/api/v1/users", method: "POST", featureName: "User Management" },
  { path: "/api/v1/users/:id", method: "GET", featureName: "User Management" },
  { path: "/api/v1/users/:id", method: "PUT", featureName: "User Management" },
  { path: "/api/v1/users/:id", method: "DELETE", featureName: "User Management" },
  { path: "/api/v1/users/profile", method: "GET", featureName: "Profile Management" },
  { path: "/api/v1/users/profile", method: "PUT", featureName: "Profile Management" },

  // Role Management Routes
  { path: "/api/v1/roles", method: "GET", featureName: "Role Management" },
  { path: "/api/v1/roles", method: "POST", featureName: "Role Management" },
  { path: "/api/v1/roles/:id", method: "GET", featureName: "Role Management" },
  { path: "/api/v1/roles/:id", method: "PUT", featureName: "Role Management" },
  { path: "/api/v1/roles/:id", method: "DELETE", featureName: "Role Management" },

  // Feature Management Routes
  { path: "/api/v1/features", method: "GET", featureName: "System Configuration" },
  { path: "/api/v1/features", method: "POST", featureName: "System Configuration" },
  { path: "/api/v1/features/:id", method: "GET", featureName: "System Configuration" },
  { path: "/api/v1/features/:id", method: "PUT", featureName: "System Configuration" },
  { path: "/api/v1/features/:id", method: "DELETE", featureName: "System Configuration" },

  // HR Routes
  { path: "/api/v1/employees", method: "GET", featureName: "Employee Performance" },
  { path: "/api/v1/employees", method: "POST", featureName: "Employee Performance" },
  { path: "/api/v1/employees/:id", method: "PUT", featureName: "Employee Performance" },
  { path: "/api/v1/payroll", method: "GET", featureName: "Payroll Management" },
  { path: "/api/v1/payroll", method: "POST", featureName: "Payroll Management" },
  { path: "/api/v1/attendance", method: "GET", featureName: "Attendance Tracking" },
  { path: "/api/v1/attendance", method: "POST", featureName: "Attendance Tracking" },

  // Finance Routes
  { path: "/api/v1/reports/financial", method: "GET", featureName: "Financial Reports" },
  { path: "/api/v1/budget", method: "GET", featureName: "Budget Planning" },
  { path: "/api/v1/budget", method: "POST", featureName: "Budget Planning" },
  { path: "/api/v1/expenses", method: "GET", featureName: "Expense Management" },
  { path: "/api/v1/expenses", method: "POST", featureName: "Expense Management" },
  { path: "/api/v1/invoices", method: "GET", featureName: "Invoice Management" },
  { path: "/api/v1/invoices", method: "POST", featureName: "Invoice Management" },

  // IT Routes
  { path: "/api/v1/system/config", method: "GET", featureName: "System Configuration" },
  { path: "/api/v1/system/config", method: "PUT", featureName: "System Configuration" },
  { path: "/api/v1/backup", method: "GET", featureName: "Backup Management" },
  { path: "/api/v1/backup", method: "POST", featureName: "Backup Management" },
  { path: "/api/v1/security", method: "GET", featureName: "Security Settings" },
  { path: "/api/v1/security", method: "PUT", featureName: "Security Settings" },

  // Sales Routes
  { path: "/api/v1/reports/sales", method: "GET", featureName: "Sales Reports" },
  { path: "/api/v1/customers", method: "GET", featureName: "Customer Management" },
  { path: "/api/v1/customers", method: "POST", featureName: "Customer Management" },
  { path: "/api/v1/customers/:id", method: "PUT", featureName: "Customer Management" },
  { path: "/api/v1/leads", method: "GET", featureName: "Lead Management" },
  { path: "/api/v1/leads", method: "POST", featureName: "Lead Management" },
  { path: "/api/v1/analytics/sales", method: "GET", featureName: "Sales Analytics" },

  // Marketing Routes
  { path: "/api/v1/analytics/marketing", method: "GET", featureName: "Marketing Analytics" },
  { path: "/api/v1/campaigns", method: "GET", featureName: "Campaign Management" },
  { path: "/api/v1/campaigns", method: "POST", featureName: "Campaign Management" },
  { path: "/api/v1/campaigns/:id", method: "PUT", featureName: "Campaign Management" },
  { path: "/api/v1/content", method: "GET", featureName: "Content Management" },
  { path: "/api/v1/content", method: "POST", featureName: "Content Management" },
  { path: "/api/v1/social-media", method: "GET", featureName: "Social Media Management" },
  { path: "/api/v1/social-media", method: "POST", featureName: "Social Media Management" },

  // Operations Routes
  { path: "/api/v1/inventory", method: "GET", featureName: "Inventory Management" },
  { path: "/api/v1/inventory", method: "POST", featureName: "Inventory Management" },
  { path: "/api/v1/inventory/:id", method: "PUT", featureName: "Inventory Management" },
  { path: "/api/v1/supply-chain", method: "GET", featureName: "Supply Chain Management" },
  { path: "/api/v1/supply-chain", method: "POST", featureName: "Supply Chain Management" },
  { path: "/api/v1/quality-control", method: "GET", featureName: "Quality Control" },
  { path: "/api/v1/quality-control", method: "POST", featureName: "Quality Control" },
  { path: "/api/v1/production", method: "GET", featureName: "Production Planning" },
  { path: "/api/v1/production", method: "POST", featureName: "Production Planning" },

  // Management Routes
  { path: "/api/v1/teams", method: "GET", featureName: "Team Management" },
  { path: "/api/v1/teams", method: "POST", featureName: "Team Management" },
  { path: "/api/v1/teams/:id", method: "PUT", featureName: "Team Management" },
  { path: "/api/v1/projects", method: "GET", featureName: "Project Management" },
  { path: "/api/v1/projects", method: "POST", featureName: "Project Management" },
  { path: "/api/v1/projects/:id", method: "PUT", featureName: "Project Management" },
  { path: "/api/v1/tasks", method: "GET", featureName: "Task Management" },
  { path: "/api/v1/tasks", method: "POST", featureName: "Task Management" },
  { path: "/api/v1/tasks/:id", method: "PUT", featureName: "Task Management" },

  // Employee Routes
  { path: "/api/v1/time-tracking", method: "GET", featureName: "Time Tracking" },
  { path: "/api/v1/time-tracking", method: "POST", featureName: "Time Tracking" },
  { path: "/api/v1/time-tracking/:id", method: "PUT", featureName: "Time Tracking" },
  { path: "/api/v1/leave", method: "GET", featureName: "Leave Management" },
  { path: "/api/v1/leave", method: "POST", featureName: "Leave Management" },
  { path: "/api/v1/performance", method: "GET", featureName: "Performance Monitoring" },

  // Audit Routes
  { path: "/api/v1/audit/logs", method: "GET", featureName: "Audit Logs" },
  { path: "/api/v1/compliance/reports", method: "GET", featureName: "Compliance Reports" },

  // Dashboard Routes
  { path: "/api/v1/dashboard", method: "GET", featureName: "Dashboard" },
  { path: "/api/v1/dashboard/stats", method: "GET", featureName: "Dashboard" },

  // Notification Routes
  { path: "/api/v1/notifications", method: "GET", featureName: "Notification Management" },
  { path: "/api/v1/notifications", method: "POST", featureName: "Notification Management" },
  { path: "/api/v1/notifications/:id", method: "PUT", featureName: "Notification Management" },

  // File Management Routes
  { path: "/api/v1/files", method: "GET", featureName: "File Management" },
  { path: "/api/v1/files", method: "POST", featureName: "File Management" },
  { path: "/api/v1/files/:id", method: "DELETE", featureName: "File Management" },

  // Integration Routes
  { path: "/api/v1/integrations", method: "GET", featureName: "API Integration" },
  { path: "/api/v1/integrations", method: "POST", featureName: "API Integration" },
  { path: "/api/v1/integrations/:id", method: "PUT", featureName: "API Integration" },
];

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
 * Fungsi utama untuk seeding route_features
 * Menggunakan upsert logic berdasarkan kombinasi path, method, dan featureId
 */
export async function seedRouteFeatures() {
  try {
    console.log('🌱 Mulai seeding route_features...');

    let insertedCount = 0;
    let updatedCount = 0;
    let skippedCount = 0;

    // Cache untuk featureId agar tidak query berulang
    const featureCache = new Map<string, number>();

    for (const routeFeatureData of routeFeaturesData) {
      // Ambil featureId dari cache atau database
      let featureId = featureCache.get(routeFeatureData.featureName);
      if (!featureId) {
        featureId = await getFeatureIdByName(routeFeatureData.featureName);
        if (featureId) {
          featureCache.set(routeFeatureData.featureName, featureId);
        }
      }

      if (!featureId) {
        console.warn(`⚠️ Feature "${routeFeatureData.featureName}" tidak ditemukan, skip route mapping`);
        skippedCount++;
        continue;
      }

      // Cek apakah route_feature sudah ada berdasarkan kombinasi path, method, dan featureId
      const whereConditions = [
        eq(routeFeatures.path, routeFeatureData.path),
        eq(routeFeatures.featureId, featureId)
      ];

      // Tambahkan kondisi method jika ada
      if (routeFeatureData.method) {
        whereConditions.push(eq(routeFeatures.method, routeFeatureData.method));
      } else {
        whereConditions.push(isNull(routeFeatures.method));
      }

      const existingRouteFeature = await db
        .select()
        .from(routeFeatures)
        .where(and(...whereConditions))
        .limit(1);

      if (existingRouteFeature.length === 0) {
        // Insert route_feature baru jika belum ada
        await db
          .insert(routeFeatures)
          .values({
            path: routeFeatureData.path,
            method: routeFeatureData.method || null,
            featureId: featureId,
          });

        console.log(`✅ Route mapping "${routeFeatureData.method || 'ALL'} ${routeFeatureData.path}" -> "${routeFeatureData.featureName}" berhasil ditambahkan`);
        insertedCount++;
      } else {
        // Route feature sudah ada, tidak perlu update karena data statis
        console.log(`🔄 Route mapping "${routeFeatureData.method || 'ALL'} ${routeFeatureData.path}" -> "${routeFeatureData.featureName}" sudah ada`);
        updatedCount++;
      }
    }

    console.log('🎉 Seeding route_features selesai!');
    
    // Tampilkan ringkasan
    const totalRouteFeatures = await db.select().from(routeFeatures);
    
    // Hitung statistik berdasarkan method
    const methodStats = totalRouteFeatures.reduce((acc, rf) => {
      const method = rf.method || 'ALL';
      acc[method] = (acc[method] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    // Hitung unique paths dan features
    const uniquePaths = new Set(totalRouteFeatures.map(rf => rf.path)).size;
    const uniqueFeatures = new Set(totalRouteFeatures.map(rf => rf.featureId)).size;
    
    console.log(`📊 Ringkasan Seeding Route Features:`);
    console.log(`   - Route mapping baru ditambahkan: ${insertedCount}`);
    console.log(`   - Route mapping sudah ada: ${updatedCount}`);
    console.log(`   - Route mapping dilewati: ${skippedCount}`);
    console.log(`   - Total route-feature mappings: ${totalRouteFeatures.length}`);
    console.log(`   - Unique paths: ${uniquePaths}`);
    console.log(`   - Unique features: ${uniqueFeatures}`);
    
    console.log(`   - Distribusi berdasarkan HTTP method:`);
    Object.entries(methodStats)
      .sort(([,a], [,b]) => b - a)
      .forEach(([method, count]) => {
        const emoji = method === 'GET' ? '🔍' : method === 'POST' ? '➕' : method === 'PUT' ? '✏️' : method === 'DELETE' ? '🗑️' : '🌐';
        console.log(`     ${emoji} ${method}: ${count} routes`);
      });
    
  } catch (error) {
    console.error('❌ Error saat seeding route_features:', error);
    throw error;
  }
}

/**
 * Fungsi untuk menghapus semua data route_features (untuk testing)
 */
export async function resetRouteFeatures() {
  try {
    console.log('🗑️ Menghapus semua data route_features...');
    
    await db.delete(routeFeatures);
    
    console.log('✅ Semua data route_features berhasil dihapus');
  } catch (error) {
    console.error('❌ Error saat menghapus route_features:', error);
    throw error;
  }
}

// Jalankan seeding jika file dijalankan langsung
if (require.main === module) {
  seedRouteFeatures()
    .then(() => {
      console.log('✅ Seeding route_features berhasil');
      pool.end();
    })
    .catch((error) => {
      console.error('❌ Seeding route_features gagal:', error);
      pool.end();
      process.exit(1);
    });
}