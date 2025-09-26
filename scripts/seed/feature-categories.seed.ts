import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { featureCategories } from '../../../rockman-tests/src/db/schema/feature_categories/index.js';
import { eq } from 'drizzle-orm';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
});
const db = drizzle(pool);

/**
 * Data seed untuk tabel feature_categories
 * Berisi kategori-kategori fitur yang umum digunakan dalam aplikasi
 */
const featureCategoriesData = [
  {
    name: 'Authentication',
    slug: 'authentication',
    description: 'Fitur-fitur terkait autentikasi dan keamanan pengguna',
    color: '#3B82F6',
    icon: 'IconShield',
    isActive: true,
    sortOrder: 1
  },
  {
    name: 'User Management',
    slug: 'user-management',
    description: 'Pengelolaan pengguna, profil, dan pengaturan akun',
    color: '#10B981',
    icon: 'IconUsers',
    isActive: true,
    sortOrder: 2
  },
  {
    name: 'Content Management',
    slug: 'content-management',
    description: 'Pengelolaan konten, artikel, dan media',
    color: '#F59E0B',
    icon: 'IconFileText',
    isActive: true,
    sortOrder: 3
  },
  {
    name: 'Analytics & Reporting',
    slug: 'analytics-reporting',
    description: 'Analitik, laporan, dan dashboard statistik',
    color: '#8B5CF6',
    icon: 'IconChartBar',
    isActive: true,
    sortOrder: 4
  },
  {
    name: 'Communication',
    slug: 'communication',
    description: 'Fitur komunikasi seperti chat, notifikasi, dan email',
    color: '#EF4444',
    icon: 'IconMessage',
    isActive: true,
    sortOrder: 5
  },
  {
    name: 'E-commerce',
    slug: 'e-commerce',
    description: 'Fitur perdagangan elektronik dan pembayaran',
    color: '#06B6D4',
    icon: 'IconShoppingCart',
    isActive: true,
    sortOrder: 6
  },
  {
    name: 'Integration',
    slug: 'integration',
    description: 'Integrasi dengan layanan dan API eksternal',
    color: '#84CC16',
    icon: 'IconPlug',
    isActive: true,
    sortOrder: 7
  },
  {
    name: 'System Administration',
    slug: 'system-administration',
    description: 'Pengaturan sistem, konfigurasi, dan maintenance',
    color: '#6B7280',
    icon: 'IconSettings',
    isActive: true,
    sortOrder: 8
  },
  {
    name: 'Mobile Features',
    slug: 'mobile-features',
    description: 'Fitur khusus untuk aplikasi mobile',
    color: '#F97316',
    icon: 'IconDeviceMobile',
    isActive: true,
    sortOrder: 9
  },
  {
    name: 'Experimental',
    slug: 'experimental',
    description: 'Fitur eksperimental yang sedang dalam pengembangan',
    color: '#EC4899',
    icon: 'IconFlask',
    isActive: false,
    sortOrder: 10
  }
];

/**
 * Fungsi untuk melakukan seeding data feature_categories
 * Menggunakan upsert untuk menghindari duplikasi data
 */
export async function seedFeatureCategories() {
  try {
    console.log('🌱 Mulai seeding feature_categories...');

    for (const categoryData of featureCategoriesData) {
      // Cek apakah kategori sudah ada berdasarkan slug
      const existingCategory = await db
        .select()
        .from(featureCategories)
        .where(eq(featureCategories.slug, categoryData.slug))
        .limit(1);

      if (existingCategory.length === 0) {
        // Insert kategori baru jika belum ada
        const inserted = await db
          .insert(featureCategories)
          .values(categoryData)
          .returning();

        console.log(`✅ Kategori "${categoryData.name}" berhasil ditambahkan`);
      } else {
        // Update kategori yang sudah ada
        await db
          .update(featureCategories)
          .set({
            name: categoryData.name,
            description: categoryData.description,
            color: categoryData.color,
            icon: categoryData.icon,
            isActive: categoryData.isActive,
            sortOrder: categoryData.sortOrder,
            updatedAt: new Date()
          })
          .where(eq(featureCategories.slug, categoryData.slug));

        console.log(`🔄 Kategori "${categoryData.name}" berhasil diperbarui`);
      }
    }

    console.log('🎉 Seeding feature_categories selesai!');
    
    // Tampilkan ringkasan
    const totalCategories = await db
      .select()
      .from(featureCategories);
    
    console.log(`📊 Total kategori di database: ${totalCategories.length}`);
    
  } catch (error) {
    console.error('❌ Error saat seeding feature_categories:', error);
    throw error;
  }
}

/**
 * Fungsi untuk menjalankan seeding jika file dijalankan langsung
 */
if (import.meta.url === `file://${process.argv[1]}`) {
  seedFeatureCategories()
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