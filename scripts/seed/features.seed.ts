import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { features } from '../../../rockman-tests/src/db/schema/features/index.js';
import { featureCategories } from '../../../rockman-tests/src/db/schema/feature_categories/index.js';
import { eq } from 'drizzle-orm';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
});
const db = drizzle(pool);

/**
 * Data seed untuk tabel features
 * Berisi fitur-fitur yang umum digunakan dalam aplikasi dengan kategori yang sesuai
 */
const featuresData = [
  // Authentication Features
  {
    name: 'Login',
    description: 'Kemampuan untuk masuk ke sistem',
    categorySlug: 'authentication'
  },
  {
    name: 'Logout',
    description: 'Kemampuan untuk keluar dari sistem',
    categorySlug: 'authentication'
  },
  {
    name: 'Register',
    description: 'Kemampuan untuk mendaftar akun baru',
    categorySlug: 'authentication'
  },
  {
    name: 'Reset Password',
    description: 'Kemampuan untuk mereset password',
    categorySlug: 'authentication'
  },
  {
    name: 'Two Factor Authentication',
    description: 'Kemampuan untuk menggunakan autentikasi dua faktor',
    categorySlug: 'authentication'
  },

  // User Management Features
  {
    name: 'View Users',
    description: 'Kemampuan untuk melihat daftar pengguna',
    categorySlug: 'user-management'
  },
  {
    name: 'Create User',
    description: 'Kemampuan untuk membuat pengguna baru',
    categorySlug: 'user-management'
  },
  {
    name: 'Edit User',
    description: 'Kemampuan untuk mengedit data pengguna',
    categorySlug: 'user-management'
  },
  {
    name: 'Delete User',
    description: 'Kemampuan untuk menghapus pengguna',
    categorySlug: 'user-management'
  },
  {
    name: 'Manage User Roles',
    description: 'Kemampuan untuk mengelola peran pengguna',
    categorySlug: 'user-management'
  },
  {
    name: 'View User Profile',
    description: 'Kemampuan untuk melihat profil pengguna',
    categorySlug: 'user-management'
  },
  {
    name: 'Edit User Profile',
    description: 'Kemampuan untuk mengedit profil pengguna',
    categorySlug: 'user-management'
  },

  // Content Management Features
  {
    name: 'View Content',
    description: 'Kemampuan untuk melihat konten',
    categorySlug: 'content-management'
  },
  {
    name: 'Create Content',
    description: 'Kemampuan untuk membuat konten baru',
    categorySlug: 'content-management'
  },
  {
    name: 'Edit Content',
    description: 'Kemampuan untuk mengedit konten',
    categorySlug: 'content-management'
  },
  {
    name: 'Delete Content',
    description: 'Kemampuan untuk menghapus konten',
    categorySlug: 'content-management'
  },
  {
    name: 'Publish Content',
    description: 'Kemampuan untuk mempublikasikan konten',
    categorySlug: 'content-management'
  },
  {
    name: 'Manage Media',
    description: 'Kemampuan untuk mengelola file media',
    categorySlug: 'content-management'
  },

  // Analytics & Reporting Features
  {
    name: 'View Analytics',
    description: 'Kemampuan untuk melihat analitik',
    categorySlug: 'analytics-reporting'
  },
  {
    name: 'Generate Reports',
    description: 'Kemampuan untuk membuat laporan',
    categorySlug: 'analytics-reporting'
  },
  {
    name: 'Export Data',
    description: 'Kemampuan untuk mengekspor data',
    categorySlug: 'analytics-reporting'
  },
  {
    name: 'View Dashboard',
    description: 'Kemampuan untuk melihat dashboard',
    categorySlug: 'analytics-reporting'
  },

  // Communication Features
  {
    name: 'Send Notifications',
    description: 'Kemampuan untuk mengirim notifikasi',
    categorySlug: 'communication'
  },
  {
    name: 'Send Email',
    description: 'Kemampuan untuk mengirim email',
    categorySlug: 'communication'
  },
  {
    name: 'Chat',
    description: 'Kemampuan untuk menggunakan fitur chat',
    categorySlug: 'communication'
  },
  {
    name: 'Manage Notifications',
    description: 'Kemampuan untuk mengelola notifikasi',
    categorySlug: 'communication'
  },

  // E-commerce Features
  {
    name: 'View Products',
    description: 'Kemampuan untuk melihat produk',
    categorySlug: 'e-commerce'
  },
  {
    name: 'Manage Products',
    description: 'Kemampuan untuk mengelola produk',
    categorySlug: 'e-commerce'
  },
  {
    name: 'Process Orders',
    description: 'Kemampuan untuk memproses pesanan',
    categorySlug: 'e-commerce'
  },
  {
    name: 'Manage Payments',
    description: 'Kemampuan untuk mengelola pembayaran',
    categorySlug: 'e-commerce'
  },
  {
    name: 'View Sales Reports',
    description: 'Kemampuan untuk melihat laporan penjualan',
    categorySlug: 'e-commerce'
  },

  // Integration Features
  {
    name: 'API Access',
    description: 'Kemampuan untuk mengakses API',
    categorySlug: 'integration'
  },
  {
    name: 'Webhook Management',
    description: 'Kemampuan untuk mengelola webhook',
    categorySlug: 'integration'
  },
  {
    name: 'Third Party Integration',
    description: 'Kemampuan untuk integrasi pihak ketiga',
    categorySlug: 'integration'
  },

  // System Administration Features
  {
    name: 'System Settings',
    description: 'Kemampuan untuk mengatur pengaturan sistem',
    categorySlug: 'system-administration'
  },
  {
    name: 'Database Management',
    description: 'Kemampuan untuk mengelola database',
    categorySlug: 'system-administration'
  },
  {
    name: 'Backup & Restore',
    description: 'Kemampuan untuk backup dan restore data',
    categorySlug: 'system-administration'
  },
  {
    name: 'System Monitoring',
    description: 'Kemampuan untuk monitoring sistem',
    categorySlug: 'system-administration'
  },
  {
    name: 'Audit Logs',
    description: 'Kemampuan untuk melihat audit logs',
    categorySlug: 'system-administration'
  },

  // Mobile Features
  {
    name: 'Push Notifications',
    description: 'Kemampuan untuk mengirim push notification',
    categorySlug: 'mobile-features'
  },
  {
    name: 'Offline Mode',
    description: 'Kemampuan untuk menggunakan mode offline',
    categorySlug: 'mobile-features'
  },
  {
    name: 'Location Services',
    description: 'Kemampuan untuk menggunakan layanan lokasi',
    categorySlug: 'mobile-features'
  },

  // Experimental Features
  {
    name: 'AI Assistant',
    description: 'Kemampuan untuk menggunakan asisten AI',
    categorySlug: 'experimental'
  },
  {
    name: 'Beta Features',
    description: 'Kemampuan untuk mengakses fitur beta',
    categorySlug: 'experimental'
  }
];

/**
 * Fungsi untuk mendapatkan categoryId berdasarkan slug
 */
async function getCategoryIdBySlug(slug: string): Promise<number | undefined> {
  const category = await db
    .select()
    .from(featureCategories)
    .where(eq(featureCategories.slug, slug))
    .limit(1);
  
  return category[0]?.id;
}

/**
 * Fungsi untuk melakukan seeding data features
 * Menggunakan upsert untuk menghindari duplikasi data
 */
export async function seedFeatures() {
  try {
    console.log('🌱 Mulai seeding features...');

    // Cache untuk categoryId agar tidak query berulang
    const categoryCache = new Map<string, number>();

    for (const featureData of featuresData) {
      // Ambil categoryId dari cache atau database
      let categoryId = categoryCache.get(featureData.categorySlug);
      
      if (!categoryId) {
        categoryId = await getCategoryIdBySlug(featureData.categorySlug);
        if (categoryId) {
          categoryCache.set(featureData.categorySlug, categoryId);
        }
      }

      if (!categoryId) {
        console.warn(`⚠️ Kategori "${featureData.categorySlug}" tidak ditemukan untuk fitur "${featureData.name}"`);
        continue;
      }

      // Cek apakah fitur sudah ada berdasarkan nama
      const existingFeature = await db
        .select()
        .from(features)
        .where(eq(features.name, featureData.name))
        .limit(1);

      if (existingFeature.length === 0) {
        // Insert fitur baru jika belum ada
        await db
          .insert(features)
          .values({
            name: featureData.name,
            description: featureData.description,
            categoryId: categoryId
          });

        console.log(`✅ Fitur "${featureData.name}" berhasil ditambahkan`);
      } else {
        // Update fitur yang sudah ada
        await db
          .update(features)
          .set({
            description: featureData.description,
            categoryId: categoryId
          })
          .where(eq(features.name, featureData.name));

        console.log(`🔄 Fitur "${featureData.name}" berhasil diperbarui`);
      }
    }

    console.log('🎉 Seeding features selesai!');
    
    // Tampilkan ringkasan
    const totalFeatures = await db
      .select()
      .from(features);
    
    console.log(`📊 Total fitur di database: ${totalFeatures.length}`);
    
  } catch (error) {
    console.error('❌ Error saat seeding features:', error);
    throw error;
  }
}

/**
 * Fungsi untuk menjalankan seeding jika file dijalankan langsung
 */
if (import.meta.url === `file://${process.argv[1]}`) {
  seedFeatures()
    .then(() => {
      console.log('✅ Seeding berhasil');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Seeding gagal:', error);
      process.exit(1);
    })
    .finally(() => {
      pool.end();
    });
}