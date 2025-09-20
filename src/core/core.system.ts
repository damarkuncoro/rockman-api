

import bcrypt from "bcryptjs"

/**
 * Core System Module
 * 
 * Domain: System Architecture
 * Responsibility: Registry untuk semua service modules
 * 
 * Mengikuti prinsip:
 * - SRP: Hanya menangani registrasi modul
 * - DRY: Central registry untuk semua services
 * - KISS: Interface sederhana untuk register dan access
 */

const SYSTEM: any = {}

/**
 * Utility untuk registrasi modul ke SYSTEM
 * @param name - Nama modul yang akan diregistrasi
 * @param methods - Object berisi methods yang akan diregistrasi
 */
SYSTEM.register = (name: string, methods: Record<string, (...args: any[]) => any>) => {
  SYSTEM[name] = { ...methods }
}

// Export SYSTEM sebagai namespace utama
export default SYSTEM