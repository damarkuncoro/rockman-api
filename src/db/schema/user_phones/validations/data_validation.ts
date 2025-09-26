/**
 * Validasi data untuk user phones
 * 
 * Domain: User Management - Phone Numbers
 * Responsibility: Validasi business logic untuk nomor telepon user
 * 
 * Mengikuti prinsip:
 * - SRP: Hanya menangani validasi data nomor telepon
 * - DRY: Reusable validation functions
 * - KISS: Validasi yang sederhana dan jelas
 * - SOLID: Separation of concerns untuk validation logic
 */

/**
 * Validasi apakah user dapat memiliki nomor telepon default
 * Memastikan hanya ada satu nomor telepon default per user
 * 
 * @param phones - Array nomor telepon user
 * @returns boolean - true jika valid (maksimal 1 default)
 */
export function validateDefaultPhone(phones: any[]): boolean {
  const defaultPhones = phones.filter(phone => phone.isDefault);
  return defaultPhones.length <= 1;
}

/**
 * Validasi format nomor telepon Indonesia
 * Mendukung format: +62xxx, 08xxx, atau 62xxx
 * 
 * @param phoneNumber - Nomor telepon yang akan divalidasi
 * @returns boolean - true jika format valid
 */
export function validateIndonesianPhoneNumber(phoneNumber: string): boolean {
  // Format: +62xxx, 08xxx, atau 62xxx
  // Minimal 10 digit, maksimal 15 digit setelah kode negara
  const phoneRegex = /^(\+62|62|0)8[1-9][0-9]{6,12}$/;
  return phoneRegex.test(phoneNumber);
}

/**
 * Validasi format nomor telepon internasional
 * Mendukung berbagai format internasional dengan kode negara
 * 
 * @param phoneNumber - Nomor telepon yang akan divalidasi
 * @param countryCode - Kode negara (contoh: +62, +1, +44)
 * @returns boolean - true jika format valid
 */
export function validateInternationalPhoneNumber(phoneNumber: string, countryCode: string): boolean {
  // Hapus spasi dan tanda hubung
  const cleanPhone = phoneNumber.replace(/[\s-]/g, '');
  
  // Validasi kode negara
  const countryCodeRegex = /^\+[1-9][0-9]{0,3}$/;
  if (!countryCodeRegex.test(countryCode)) {
    return false;
  }
  
  // Validasi nomor telepon (minimal 7 digit, maksimal 15 digit)
  const phoneRegex = /^[0-9]{7,15}$/;
  return phoneRegex.test(cleanPhone);
}

/**
 * Validasi duplikasi nomor telepon
 * Memastikan tidak ada nomor telepon yang sama untuk user yang sama
 * 
 * @param phones - Array nomor telepon user
 * @param newPhone - Nomor telepon baru yang akan ditambahkan
 * @param excludeId - ID nomor telepon yang dikecualikan (untuk update)
 * @returns boolean - true jika tidak ada duplikasi
 */
export function validatePhoneDuplication(phones: any[], newPhone: string, excludeId?: number): boolean {
  const duplicates = phones.filter(phone => 
    phone.phoneNumber === newPhone && phone.id !== excludeId
  );
  return duplicates.length === 0;
}

/**
 * Validasi label nomor telepon
 * Memastikan label tidak duplikat untuk user yang sama
 * 
 * @param phones - Array nomor telepon user
 * @param newLabel - Label baru yang akan ditambahkan
 * @param excludeId - ID nomor telepon yang dikecualikan (untuk update)
 * @returns boolean - true jika label tidak duplikat
 */
export function validatePhoneLabel(phones: any[], newLabel: string, excludeId?: number): boolean {
  const duplicates = phones.filter(phone => 
    phone.label.toLowerCase() === newLabel.toLowerCase() && phone.id !== excludeId
  );
  return duplicates.length === 0;
}