/**
 * SERVICE Registry - Global Service Management
 * 
 * Domain: Core Infrastructure - Service Registry Pattern
 * Responsibility: Mengelola registrasi dan akses ke semua services secara terpusat
 * 
 * Mengikuti prinsip:
 * - SRP: Hanya menangani registrasi dan manajemen services
 * - DRY: Centralized service access pattern
 * - KISS: Simple interface untuk registrasi dan akses
 * - SOLID: Dependency injection dan loose coupling
 * 
 * Pattern: SERVICE.serviceName.method()
 * Example: SERVICE.user.GET.All()
 */

import { IService } from './core.interface'
import { PgTable } from 'drizzle-orm/pg-core'

/**
 * Interface untuk SERVICE registry
 * Mendukung dynamic property access untuk services
 */
interface IServiceRegistry {
  [key: string]: unknown
}

/**
 * Type untuk registrasi service dengan generic table type
 */
type ServiceRegistration<TTable extends PgTable> = {
  [K in string]: IService<TTable>
}

/**
 * ServiceRegistry Class - Implementasi registry pattern untuk services
 * Menyediakan centralized access ke semua services dalam aplikasi
 */
class ServiceRegistry {
  private services: Map<string, IService<PgTable>> = new Map()

  /**
   * Mendaftarkan service baru ke registry
   * @param name - Nama service (key untuk akses)
   * @param service - Instance service yang akan didaftarkan
   * 
   * @example
   * // Registrasi users service
   * SERVICE.register('user', usersService)
   * 
   * // Registrasi products service
   * SERVICE.register('product', productsService)
   */
  register<TTable extends PgTable>(
    name: string, 
    service: IService<TTable>
  ): void {
    if (this.services.has(name)) {
      console.warn(`[SERVICE Registry] Service '${name}' sudah terdaftar. Mengganti dengan instance baru.`)
    }
    
    this.services.set(name, service)
    
    // Dynamic property assignment untuk akses langsung
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(this as any)[name] = service
    
    if (typeof process !== 'undefined' && process.env?.NODE_ENV === 'development') {
      console.log(`[SERVICE Registry] Service '${name}' berhasil didaftarkan`)
    }
  }

  /**
   * Mengambil service berdasarkan nama
   * @param name - Nama service yang dicari
   * @returns Service instance atau undefined jika tidak ditemukan
   * 
   * @example
   * const userService = SERVICE.get('user')
   * if (userService) {
   *   const users = await userService.GET.All()
   * }
   */
  get<TTable extends PgTable>(name: string): IService<TTable> | undefined {
    return this.services.get(name) as IService<TTable> | undefined
  }

  /**
   * Menghapus service dari registry
   * @param name - Nama service yang akan dihapus
   * @returns true jika berhasil dihapus, false jika service tidak ditemukan
   * 
   * @example
   * const removed = SERVICE.unregister('user')
   * console.log(removed ? 'Service dihapus' : 'Service tidak ditemukan')
   */
  unregister(name: string): boolean {
    const existed = this.services.has(name)
    if (existed) {
      this.services.delete(name)
      // Hapus dynamic property
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (this as any)[name]
      
      if (typeof process !== 'undefined' && process.env?.NODE_ENV === 'development') {
        console.log(`[SERVICE Registry] Service '${name}' berhasil dihapus`)
      }
    }
    return existed
  }

  /**
   * Mendapatkan daftar nama semua services yang terdaftar
   * @returns Array nama services
   * 
   * @example
   * const serviceNames = SERVICE.list()
   * console.log('Registered services:', serviceNames)
   */
  list(): string[] {
    return Array.from(this.services.keys())
  }

  /**
   * Mengecek apakah service dengan nama tertentu sudah terdaftar
   * @param name - Nama service yang dicek
   * @returns true jika service terdaftar, false jika tidak
   * 
   * @example
   * if (SERVICE.has('user')) {
   *   console.log('User service tersedia')
   * }
   */
  has(name: string): boolean {
    return this.services.has(name)
  }

  /**
   * Menghapus semua services dari registry
   * Berguna untuk testing atau cleanup
   * 
   * @example
   * SERVICE.clear() // Hapus semua services
   */
  clear(): void {
    const serviceNames = this.list()
    
    // Hapus semua services dari Map
    this.services.clear()
    
    // Hapus semua dynamic properties
    serviceNames.forEach((name) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (this as any)[name]
    })
    
    if (typeof process !== 'undefined' && process.env?.NODE_ENV === 'development') {
      console.log('[SERVICE Registry] Semua services berhasil dihapus')
    }
  }

  /**
   * Mendapatkan statistik registry
   * @returns Object dengan informasi total services dan daftar nama
   * 
   * @example
   * const stats = SERVICE.stats()
   * console.log(`Total services: ${stats.total}`)
   * console.log('Services:', stats.services)
   */
  stats(): { total: number; services: string[] } {
    const services = this.list()
    return {
      total: services.length,
      services
    }
  }
}

/**
 * Global SERVICE instance
 * Digunakan di seluruh aplikasi untuk akses ke services
 * 
 * @example
 * // Registrasi service
 * SERVICE.register('user', usersService)
 * 
 * // Akses service
 * const users = await SERVICE.user.GET.All()
 * const user = await SERVICE.user.GET.ById(1)
 */
export const SERVICE = new ServiceRegistry()

/**
 * Default export untuk kemudahan import
 */
export default SERVICE

/**
 * Export types untuk TypeScript support
 */
export type { IServiceRegistry, ServiceRegistration }