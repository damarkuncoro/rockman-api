

/**
 * ===================================================================
 * CORE SYSTEM MODULE - ROCKMAN ARCHITECTURE
 * ===================================================================
 * 
 * Domain: System Architecture & Module Registry
 * 
 * Tanggung Jawab:
 * - Central registry untuk semua service modules
 * - Dynamic module registration dan access
 * - Namespace management untuk aplikasi
 * - Dependency injection container sederhana
 * 
 * Prinsip Desain:
 * - DRY: Single source of truth untuk module registry
 * - KISS: Interface sederhana untuk register dan access modules
 * - SOLID: 
 *   - SRP: Hanya menangani module registration
 *   - OCP: Extensible untuk module baru tanpa modifikasi
 *   - DIP: Abstraksi untuk dependency management
 * 
 * Contoh Penggunaan:
 * 
 * // Register service module
 * SYSTEM.register('users', {
 *   create: (data) => userService.POST.Create(data),
 *   getAll: () => userService.GET.All(),
 *   getById: (id) => userService.GET.ById(id)
 * })
 * 
 * // Access registered module
 * const users = await SYSTEM.users.getAll()
 * const user = await SYSTEM.users.getById(1)
 * 
 * // Register utility module
 * SYSTEM.register('auth', {
 *   hash: (password) => bcrypt.hash(password, 10),
 *   compare: (password, hash) => bcrypt.compare(password, hash),
 *   generateToken: (payload) => jwt.sign(payload, secret)
 * })
 * 
 * // Use utility functions
 * const hashedPassword = await SYSTEM.auth.hash('password123')
 * const isValid = await SYSTEM.auth.compare('password123', hashedPassword)
 * 
 * ===================================================================
 */



/**
 * Interface untuk methods yang dapat diregistrasi ke SYSTEM
 */
interface SystemMethods {
  [key: string]: (...args: unknown[]) => unknown
}

/**
 * SYSTEM Registry - Central namespace untuk semua modules
 * 
 * Registry ini menyediakan akses terpusat ke semua service methods
 * yang telah diregistrasi dalam aplikasi. Memungkinkan dependency
 * injection dan loose coupling antar modules.
 * 
 * @example
 * // Setelah registrasi modules
 * SYSTEM.register('products', productMethods)
 * const product = await SYSTEM.products.getById(123)
 * await SYSTEM.products.update(123, { price: 99.99 })
 */
const SYSTEM = {} as Record<string, unknown> & {
  register: (name: string, methods: SystemMethods) => void
}

/**
 * Utility untuk registrasi modul ke SYSTEM registry
 * 
 * Mendaftarkan methods dari suatu module ke dalam SYSTEM namespace
 * untuk akses global yang terorganisir.
 * 
 * @param name - Nama modul yang akan diregistrasi (harus unique)
 * @param methods - Object berisi methods yang akan diregistrasi
 * 
 * @example
 * // Register service methods
 * SYSTEM.register('users', {
 *   create: async (data) => {
 *     const user = await userService.POST.Create(data)
 *     console.log(`User created: ${user.name}`)
 *     return user
 *   },
 *   getAll: () => userService.GET.All(),
 *   getById: (id) => userService.GET.ById(id),
 *   update: (id, data) => userService.PUT.Update(id, data),
 *   delete: (id) => userService.DELETE.Remove(id)
 * })
 * 
 * @example
 * // Register utility functions
 * SYSTEM.register('crypto', {
 *   hash: async (text) => {
 *     const salt = await bcrypt.genSalt(10)
 *     return bcrypt.hash(text, salt)
 *   },
 *   compare: (text, hash) => bcrypt.compare(text, hash),
 *   generateId: () => Math.random().toString(36).substr(2, 9)
 * })
 * 
 * // Usage after registration
 * const hashedPassword = await SYSTEM.crypto.hash('mypassword')
 * const isValid = await SYSTEM.crypto.compare('mypassword', hashedPassword)
 */
SYSTEM.register = (name: string, methods: SystemMethods) => {
  SYSTEM[name] = { ...methods }
}

// Export SYSTEM sebagai namespace utama untuk aplikasi
// Memungkinkan akses global ke semua registered modules
export default SYSTEM