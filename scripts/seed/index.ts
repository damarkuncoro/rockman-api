import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { seedFeatureCategories } from './feature-categories.seed.js';
import { seedFeatures } from './features.seed.js';
import { seedUsers } from './users.seed.js';
import { seedRoles } from './roles.seed.js';
import { seedPolicies } from './policies.seed.js';
import { seedUserRoles } from './user-roles.seed.js';
import { seedRoleFeatures } from './role-features.seed.js';
import { seedRouteFeatures } from './route-features.seed.js';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
});
const db = drizzle(pool);

/**
 * Script utama untuk menjalankan semua seeding database
 * Menjalankan seeding dengan urutan yang benar untuk menjaga referential integrity
 * 
 * Urutan seeding:
 * 1. Feature Categories (parent table)
 * 2. Features (child table yang referensi ke feature_categories)
 * 3. Users (independent table)
 * 4. Roles (independent table)
 * 5. Policies (referensi ke features)
 * 6. User Roles (junction table: users + roles)
 * 7. Role Features (junction table: roles + features)
 * 8. Route Features (referensi ke features)
 */

/**
 * Fungsi untuk menjalankan semua seeding
 */
async function runAllSeeds() {
  console.log('🚀 Memulai database seeding...');
  console.log('=====================================');
  
  try {
    // Test koneksi database
    console.log('🔍 Testing database connection...');
    await db.execute('SELECT 1');
    console.log('✅ Database connection successful');
    console.log('');

    // 1. Seed Feature Categories (harus pertama karena menjadi parent)
    console.log('📂 Step 1: Seeding Feature Categories');
    console.log('-------------------------------------');
    await seedFeatureCategories();
    console.log('');

    // 2. Seed Features (setelah categories karena membutuhkan categoryId)
    console.log('⚡ Step 2: Seeding Features');
    console.log('---------------------------');
    await seedFeatures();
    console.log('');

    // 3. Seed Users (independent table)
    console.log('👥 Step 3: Seeding Users');
    console.log('------------------------');
    await seedUsers();
    console.log('');

    // 4. Seed Roles (independent table)
    console.log('🔐 Step 4: Seeding Roles');
    console.log('------------------------');
    await seedRoles();
    console.log('');

    // 5. Seed Policies (referensi ke features)
    console.log('📋 Step 5: Seeding Policies');
    console.log('---------------------------');
    await seedPolicies();
    console.log('');

    // 6. Seed User Roles (junction table: users + roles)
    console.log('🔗 Step 6: Seeding User Roles');
    console.log('------------------------------');
    await seedUserRoles();
    console.log('');

    // 7. Seed Role Features (junction table: roles + features)
    console.log('⚙️ Step 7: Seeding Role Features');
    console.log('---------------------------------');
    await seedRoleFeatures();
    console.log('');

    // 8. Seed Route Features (referensi ke features)
    console.log('🛣️ Step 8: Seeding Route Features');
    console.log('----------------------------------');
    await seedRouteFeatures();
    console.log('');

    // TODO: Tambahkan seeding untuk tabel lainnya jika diperlukan
    // - Sessions (biasanya tidak perlu di-seed)
    // - Access Logs (data audit, tidak perlu di-seed)
    // - Policy Violations (data audit, tidak perlu di-seed)
    // - Change History (data audit, tidak perlu di-seed)

    console.log('🎉 Semua seeding berhasil diselesaikan!');
    console.log('=====================================');
    
    // Tampilkan ringkasan
    await showSeedingSummary();
    
  } catch (error) {
    console.error('❌ Error saat menjalankan seeding:', error);
    throw error;
  }
}

/**
 * Fungsi untuk menampilkan ringkasan hasil seeding
 */
async function showSeedingSummary() {
  try {
    console.log('📊 Ringkasan Database Seeding');
    console.log('==============================');

    // Count feature categories
    const categoriesResult = await db.execute('SELECT COUNT(*) as count FROM feature_categories');
    const categoriesCount = categoriesResult.rows[0]?.count || 0;
    console.log(`📂 Feature Categories: ${categoriesCount} records`);

    // Count features
    const featuresResult = await db.execute('SELECT COUNT(*) as count FROM features');
    const featuresCount = featuresResult.rows[0]?.count || 0;
    console.log(`⚡ Features: ${featuresCount} records`);

    // Count users
    const usersResult = await db.execute('SELECT COUNT(*) as count FROM users');
    const usersCount = usersResult.rows[0]?.count || 0;
    console.log(`👥 Users: ${usersCount} records`);

    // Count roles
    const rolesResult = await db.execute('SELECT COUNT(*) as count FROM roles');
    const rolesCount = rolesResult.rows[0]?.count || 0;
    console.log(`🔐 Roles: ${rolesCount} records`);

    // Count policies
    const policiesResult = await db.execute('SELECT COUNT(*) as count FROM policies');
    const policiesCount = policiesResult.rows[0]?.count || 0;
    console.log(`📋 Policies: ${policiesCount} records`);

    // Count user roles
    const userRolesResult = await db.execute('SELECT COUNT(*) as count FROM user_roles');
    const userRolesCount = userRolesResult.rows[0]?.count || 0;
    console.log(`🔗 User Roles: ${userRolesCount} records`);

    // Count role features
    const roleFeaturesResult = await db.execute('SELECT COUNT(*) as count FROM role_features');
    const roleFeaturesCount = roleFeaturesResult.rows[0]?.count || 0;
    console.log(`⚙️ Role Features: ${roleFeaturesCount} records`);

    // Count route features
    const routeFeaturesResult = await db.execute('SELECT COUNT(*) as count FROM route_features');
    const routeFeaturesCount = routeFeaturesResult.rows[0]?.count || 0;
    console.log(`🛣️ Route Features: ${routeFeaturesCount} records`);

    // Count features per category
    const categoryStatsResult = await db.execute(`
      SELECT 
        fc.name as category_name,
        COUNT(f.id) as feature_count
      FROM feature_categories fc
      LEFT JOIN features f ON fc.id = f.category_id
      GROUP BY fc.id, fc.name
      ORDER BY fc.sort_order
    `);

    console.log('');
    console.log('📈 Features per Category:');
    console.log('-------------------------');
    for (const row of categoryStatsResult.rows) {
      console.log(`  ${row.category_name}: ${row.feature_count} features`);
    }

    // Show role distribution
    const roleStatsResult = await db.execute(`
      SELECT 
        r.name as role_name,
        COUNT(ur.user_id) as user_count,
        COUNT(rf.feature_id) as feature_count
      FROM roles r
      LEFT JOIN user_roles ur ON r.id = ur.role_id
      LEFT JOIN role_features rf ON r.id = rf.role_id
      GROUP BY r.id, r.name
      ORDER BY r.name
    `);

    console.log('');
    console.log('👥 Role Distribution:');
    console.log('--------------------');
    for (const row of roleStatsResult.rows) {
      console.log(`  ${row.role_name}: ${row.user_count} users, ${row.feature_count} permissions`);
    }

    console.log('');
    console.log('✅ Database seeding completed successfully!');
    
  } catch (error) {
    console.error('❌ Error saat menampilkan ringkasan:', error);
  }
}

/**
 * Fungsi untuk reset semua data seeding (untuk development)
 * HATI-HATI: Ini akan menghapus semua data!
 */
async function resetAllSeeds() {
  console.log('⚠️  RESET MODE: Menghapus semua data seeding...');
  console.log('================================================');
  
  try {
    // Hapus dalam urutan terbalik untuk menjaga referential integrity
    console.log('🗑️  Menghapus route_features...');
    await db.execute('DELETE FROM route_features');
    
    console.log('🗑️  Menghapus role_features...');
    await db.execute('DELETE FROM role_features');
    
    console.log('🗑️  Menghapus user_roles...');
    await db.execute('DELETE FROM user_roles');
    
    console.log('🗑️  Menghapus policies...');
    await db.execute('DELETE FROM policies');
    
    console.log('🗑️  Menghapus users...');
    await db.execute('DELETE FROM users');
    
    console.log('🗑️  Menghapus roles...');
    await db.execute('DELETE FROM roles');
    
    console.log('🗑️  Menghapus features...');
    await db.execute('DELETE FROM features WHERE category_id IS NOT NULL');
    
    console.log('🗑️  Menghapus feature_categories...');
    await db.execute('DELETE FROM feature_categories');
    
    // Reset auto-increment sequences
    console.log('🔄 Reset sequences...');
    await db.execute('ALTER SEQUENCE features_id_seq RESTART WITH 1');
    await db.execute('ALTER SEQUENCE feature_categories_id_seq RESTART WITH 1');
    await db.execute('ALTER SEQUENCE feature_categories_sort_order_seq RESTART WITH 1');
    await db.execute('ALTER SEQUENCE users_id_seq RESTART WITH 1');
    await db.execute('ALTER SEQUENCE roles_id_seq RESTART WITH 1');
    await db.execute('ALTER SEQUENCE policies_id_seq RESTART WITH 1');
    await db.execute('ALTER SEQUENCE user_roles_id_seq RESTART WITH 1');
    await db.execute('ALTER SEQUENCE role_features_id_seq RESTART WITH 1');
    await db.execute('ALTER SEQUENCE route_features_id_seq RESTART WITH 1');
    
    console.log('✅ Reset selesai!');
    
  } catch (error) {
    console.error('❌ Error saat reset:', error);
    throw error;
  }
}

/**
 * Main function untuk menjalankan script
 */
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  try {
    switch (command) {
      case 'reset':
        await resetAllSeeds();
        break;
      case 'seed':
      default:
        await runAllSeeds();
        break;
    }
  } catch (error) {
    console.error('❌ Script gagal:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

/**
 * Jalankan script jika dipanggil langsung
 */
if (import.meta.url === `file://${process.argv[1]}`) {
  main()
    .then(() => {
      console.log('🏁 Script selesai');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Script error:', error);
      process.exit(1);
    });
}

// Export functions untuk digunakan di tempat lain
export {
  runAllSeeds,
  resetAllSeeds,
  showSeedingSummary
};