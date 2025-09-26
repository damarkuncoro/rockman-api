/**
 * Validasi data untuk user addresses
 * 
 * Domain: User Management
 * Responsibility: Validasi business logic untuk user addresses
 */

/**
 * Validasi apakah user dapat memiliki alamat default
 */
export function validateDefaultAddress(addresses: any[]): boolean {
  const defaultAddresses = addresses.filter(addr => addr.isDefault);
  return defaultAddresses.length <= 1;
}

/**
 * Validasi format nomor telepon Indonesia
 */
export function validateIndonesianPhoneNumber(phoneNumber: string): boolean {
  // Format: +62xxx, 08xxx, atau 62xxx
  const phoneRegex = /^(\+62|62|0)8[1-9][0-9]{6,11}$/;
  return phoneRegex.test(phoneNumber);
}

/**
 * Validasi kode pos Indonesia
 */
export function validateIndonesianPostalCode(postalCode: string): boolean {
  // Kode pos Indonesia: 5 digit
  const postalRegex = /^[0-9]{5}$/;
  return postalRegex.test(postalCode);
}

/**
 * Validasi alamat lengkap
 */
export function validateCompleteAddress(addressLine1: string, city: string, province: string): boolean {
  return addressLine1.length >= 10 && city.length >= 2 && province.length >= 2;
}