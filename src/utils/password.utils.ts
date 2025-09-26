import SYSTEM from '@/core/core.system'

/**
 * Interface untuk data yang mengandung password
 */
interface PasswordData {
  password: string
  [key: string]: unknown
}

/**
 * Memproses data yang mengandung password dengan melakukan hashing
 * @param data - Data yang mengandung password plain text
 * @returns Promise<PasswordData> - Data dengan password yang sudah di-hash
 */
export async function processPasswordInData(data: PasswordData): Promise<PasswordData> {
  try {
    if (!data.password) {
      throw new Error('Password tidak boleh kosong')
    }

    // Hash password menggunakan SYSTEM.password.GENERATE
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const hashedPassword = await (SYSTEM as any).password.GENERATE(data.password)
    
    // Return data dengan password yang sudah di-hash
    return {
      ...data,
      password: hashedPassword
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    throw new Error(`Gagal memproses password: ${errorMessage}`)
  }
}

/**
 * Mengecek apakah data mengandung password yang valid
 * @param data - Data yang akan dicek
 * @returns boolean - True jika mengandung password valid
 */
export function hasValidPassword(data: unknown): data is PasswordData {
  return Boolean(data) && 
         typeof data === 'object' && 
         data !== null &&
         'password' in data && 
         typeof (data as Record<string, unknown>).password === 'string' && 
         ((data as Record<string, unknown>).password as string).length > 0
}

/**
 * Menghapus password plain text dari data untuk keamanan
 * @param data - Data yang mengandung password
 * @returns object - Data tanpa password plain text
 */
export function sanitizePasswordFromData(data: PasswordData): Omit<PasswordData, 'password'> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: _, ...sanitizedData } = data
  return sanitizedData
}

/**
 * Generate password random dengan kombinasi huruf, angka, dan simbol
 * @param length - Panjang password yang diinginkan (minimal 4)
 * @returns string - Password random
 */
export function generateRandomPassword(length: number = 8): string {
  // Validasi panjang minimal
  if (length < 4) {
    throw new Error('Panjang password minimal 4 karakter')
  }

  const lowercase = 'abcdefghijklmnopqrstuvwxyz'
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const numbers = '0123456789'
  const symbols = '!@#$%^&*'
  
  const allChars = lowercase + uppercase + numbers + symbols
  let password = ''
  
  // Pastikan minimal ada 1 dari setiap kategori
  password += lowercase[Math.floor(Math.random() * lowercase.length)]
  password += uppercase[Math.floor(Math.random() * uppercase.length)]
  password += numbers[Math.floor(Math.random() * numbers.length)]
  password += symbols[Math.floor(Math.random() * symbols.length)]
  
  // Isi sisa karakter secara random
  for (let i = 4; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)]
  }
  
  // Shuffle password untuk randomize posisi
  return password.split('').sort(() => Math.random() - 0.5).join('')
}

/**
 * Generate password dengan kekuatan tertentu
 * @param strength - Tingkat kekuatan: 'weak' | 'medium' | 'strong'
 * @returns string - Password sesuai tingkat kekuatan
 */
export function generatePasswordByStrength(strength: 'weak' | 'medium' | 'strong' = 'medium'): string {
  const lengthMap = {
    weak: 6,
    medium: 8,
    strong: 12
  }
  
  return generateRandomPassword(lengthMap[strength])
}