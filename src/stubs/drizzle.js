/**
 * Drizzle ORM Stub untuk Client-Side
 * 
 * Menyediakan stub function untuk drizzle() yang diperlukan di client-side
 * tanpa mengeksekusi operasi database sebenarnya
 */

/**
 * Stub function untuk drizzle()
 * @param {*} connection - Connection parameter (diabaikan di client-side)
 * @returns {Object} Mock database object
 */
function drizzle(connection) {
  return {
    // Mock methods untuk database operations
    select: () => ({ from: () => ({ where: () => Promise.resolve([]) }) }),
    insert: () => ({ into: () => ({ values: () => Promise.resolve([]) }) }),
    update: () => ({ set: () => ({ where: () => Promise.resolve([]) }) }),
    delete: () => ({ from: () => ({ where: () => Promise.resolve([]) }) }),
    
    // Mock transaction method
    transaction: (callback) => Promise.resolve(callback(this)),
    
    // Mock query method
    query: {
      users: {
        findMany: () => Promise.resolve([]),
        findFirst: () => Promise.resolve(null),
        create: () => Promise.resolve({}),
        update: () => Promise.resolve({}),
        delete: () => Promise.resolve({})
      }
    }
  }
}

/**
 * Stub function untuk relations()
 * @param {*} table - Table reference (diabaikan di client-side)
 * @param {Function} callback - Relations callback function
 * @returns {Object} Mock relations object
 */
function relations(table, callback) {
  // Mock relations helpers
  const mockHelpers = {
    one: (targetTable, config) => ({ type: 'one', target: targetTable, config }),
    many: (targetTable, config) => ({ type: 'many', target: targetTable, config })
  };
  
  // Execute callback with mock helpers and return result
  return callback ? callback(mockHelpers) : {};
}

// Export sebagai named export dan default export untuk kompatibilitas
module.exports = {
  drizzle,
  relations,
  default: drizzle
}

// Untuk ES modules compatibility
module.exports.drizzle = drizzle
module.exports.relations = relations