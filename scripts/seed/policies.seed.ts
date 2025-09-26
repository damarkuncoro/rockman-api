import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { eq, and } from "drizzle-orm";
import { policies } from "../../../rockman-tests/src/db/schema/policies";
import { features } from "../../../rockman-tests/src/db/schema/features";

// Inisialisasi koneksi database
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool);

/**
 * Data sampel untuk tabel policies
 * Kebijakan akses berbasis atribut untuk ABAC (Attribute-Based Access Control)
 */
const policiesData = [
  // Policies berdasarkan Department
  {
    featureName: "User Management",
    attribute: "department",
    operator: "==",
    value: "HR",
    description: "Hanya HR yang bisa mengelola user"
  },
  {
    featureName: "Financial Reports",
    attribute: "department", 
    operator: "==",
    value: "Finance",
    description: "Hanya Finance yang bisa akses laporan keuangan"
  },
  {
    featureName: "System Configuration",
    attribute: "department",
    operator: "==", 
    value: "IT",
    description: "Hanya IT yang bisa konfigurasi sistem"
  },
  {
    featureName: "Marketing Analytics",
    attribute: "department",
    operator: "==",
    value: "Marketing", 
    description: "Hanya Marketing yang bisa akses analytics"
  },
  {
    featureName: "Sales Reports",
    attribute: "department",
    operator: "==",
    value: "Sales",
    description: "Hanya Sales yang bisa akses laporan penjualan"
  },

  // Policies berdasarkan Level (seniority)
  {
    featureName: "Employee Performance",
    attribute: "level",
    operator: ">=",
    value: "3",
    description: "Minimal level 3 untuk akses performa karyawan"
  },
  {
    featureName: "Budget Planning",
    attribute: "level",
    operator: ">=",
    value: "4",
    description: "Minimal level 4 untuk perencanaan budget"
  },
  {
    featureName: "Strategic Planning",
    attribute: "level",
    operator: ">=",
    value: "5",
    description: "Minimal level 5 untuk perencanaan strategis"
  },
  {
    featureName: "Audit Logs",
    attribute: "level",
    operator: ">=",
    value: "4",
    description: "Minimal level 4 untuk akses audit logs"
  },

  // Policies berdasarkan Region
  {
    featureName: "Regional Reports",
    attribute: "region",
    operator: "==",
    value: "Jakarta",
    description: "Laporan khusus region Jakarta"
  },
  {
    featureName: "Branch Management",
    attribute: "region",
    operator: "in",
    value: "Jakarta,Surabaya,Bandung",
    description: "Manajemen cabang untuk region utama"
  },

  // Policies kombinasi (contoh untuk fitur sensitif)
  {
    featureName: "Payroll Management",
    attribute: "department",
    operator: "==",
    value: "HR",
    description: "Payroll hanya untuk HR"
  },
  {
    featureName: "Payroll Management", 
    attribute: "level",
    operator: ">=",
    value: "3",
    description: "Payroll minimal level 3"
  },

  // Policies untuk compliance
  {
    featureName: "Compliance Reports",
    attribute: "department",
    operator: "in",
    value: "Finance,HR,IT",
    description: "Compliance reports untuk department tertentu"
  },
  {
    featureName: "Data Export",
    attribute: "level",
    operator: ">=",
    value: "4",
    description: "Export data minimal level 4"
  },

  // Policies untuk security
  {
    featureName: "Security Settings",
    attribute: "department",
    operator: "==",
    value: "IT",
    description: "Security settings hanya IT"
  },
  {
    featureName: "Security Settings",
    attribute: "level", 
    operator: ">=",
    value: "4",
    description: "Security settings minimal level 4"
  },

  // Policies untuk backup & recovery
  {
    featureName: "Backup Management",
    attribute: "department",
    operator: "==",
    value: "IT",
    description: "Backup management hanya IT"
  },
  {
    featureName: "Data Recovery",
    attribute: "level",
    operator: ">=",
    value: "5",
    description: "Data recovery minimal level 5"
  },
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
 * Fungsi utama untuk seeding policies
 * Menggunakan upsert logic berdasarkan kombinasi featureId, attribute, operator, value
 */
export async function seedPolicies() {
  try {
    console.log('🌱 Mulai seeding policies...');

    let insertedCount = 0;
    let updatedCount = 0;
    let skippedCount = 0;

    // Cache untuk featureId agar tidak query berulang
    const featureCache = new Map<string, number>();

    for (const policyData of policiesData) {
      // Ambil featureId dari cache atau database
      let featureId = featureCache.get(policyData.featureName);
      
      if (!featureId) {
        featureId = await getFeatureIdByName(policyData.featureName);
        if (featureId) {
          featureCache.set(policyData.featureName, featureId);
        }
      }

      if (!featureId) {
        console.warn(`⚠️ Feature "${policyData.featureName}" tidak ditemukan, skip policy`);
        skippedCount++;
        continue;
      }

      // Cek apakah policy sudah ada berdasarkan kombinasi unik
      const existingPolicy = await db
        .select()
        .from(policies)
        .where(
          and(
            eq(policies.featureId, featureId),
            eq(policies.attribute, policyData.attribute),
            eq(policies.operator, policyData.operator),
            eq(policies.value, policyData.value)
          )
        )
        .limit(1);

      if (existingPolicy.length === 0) {
        // Insert policy baru jika belum ada
        await db
          .insert(policies)
          .values({
            featureId: featureId,
            attribute: policyData.attribute,
            operator: policyData.operator,
            value: policyData.value,
          });

        console.log(`✅ Policy "${policyData.featureName}" - ${policyData.attribute} ${policyData.operator} ${policyData.value} berhasil ditambahkan`);
        insertedCount++;
      } else {
        // Policy sudah ada, tidak perlu update karena data sama
        console.log(`🔄 Policy "${policyData.featureName}" - ${policyData.attribute} ${policyData.operator} ${policyData.value} sudah ada`);
        updatedCount++;
      }
    }

    console.log('🎉 Seeding policies selesai!');
    
    // Tampilkan ringkasan
    const totalPolicies = await db.select().from(policies);
    
    // Hitung distribusi berdasarkan attribute
    const attributeDistribution = totalPolicies.reduce((acc, policy) => {
      acc[policy.attribute] = (acc[policy.attribute] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Hitung distribusi berdasarkan operator
    const operatorDistribution = totalPolicies.reduce((acc, policy) => {
      acc[policy.operator] = (acc[policy.operator] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    console.log(`📊 Ringkasan Seeding Policies:`);
    console.log(`   - Policy baru ditambahkan: ${insertedCount}`);
    console.log(`   - Policy sudah ada: ${updatedCount}`);
    console.log(`   - Policy dilewati (feature tidak ada): ${skippedCount}`);
    console.log(`   - Total policy di database: ${totalPolicies.length}`);
    
    console.log(`   - Distribusi berdasarkan attribute:`);
    Object.entries(attributeDistribution).forEach(([attr, count]) => {
      console.log(`     📋 ${attr}: ${count} policies`);
    });
    
    console.log(`   - Distribusi berdasarkan operator:`);
    Object.entries(operatorDistribution).forEach(([op, count]) => {
      console.log(`     🔧 ${op}: ${count} policies`);
    });
    
  } catch (error) {
    console.error('❌ Error saat seeding policies:', error);
    throw error;
  }
}

/**
 * Fungsi untuk menghapus semua data policies (untuk testing)
 */
export async function resetPolicies() {
  try {
    console.log('🗑️ Menghapus semua data policies...');
    
    await db.delete(policies);
    
    console.log('✅ Semua data policies berhasil dihapus');
  } catch (error) {
    console.error('❌ Error saat menghapus policies:', error);
    throw error;
  }
}

// Jalankan seeding jika file dijalankan langsung
if (require.main === module) {
  seedPolicies()
    .then(() => {
      console.log('✅ Seeding policies berhasil');
      pool.end();
    })
    .catch((error) => {
      console.error('❌ Seeding policies gagal:', error);
      pool.end();
      process.exit(1);
    });
}