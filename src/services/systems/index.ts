/**
 * Systems Services Index
 * 
 * Domain: Service Layer
 * Responsibility: Mengimpor dan mengorganisir semua system services
 * 
 * Mengikuti prinsip:
 * - SRP: Hanya menangani import dan export services
 * - DRY: Central point untuk semua system services
 * - KISS: Simple barrel export pattern
 */

// Import semua system services
import "./password"

// Re-export SYSTEM untuk akses global
export { default as SYSTEM } from "@/core/core.system"