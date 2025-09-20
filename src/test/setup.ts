// Test setup file untuk Vitest
import { vi } from 'vitest'

// Mock database connection untuk testing
vi.mock('@/db/connection', () => ({
  db: {
    select: vi.fn(),
    insert: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  }
}))

// Global test utilities
global.testUtils = {
  createMockUser: () => ({
    id: 1,
    name: 'Test User',
    email: 'test@example.com',
    password: 'hashedpassword',
    createdAt: new Date(),
    updatedAt: new Date(),
  }),
  
  createMockUsers: (count: number) => {
    return Array.from({ length: count }, (_, i) => ({
      id: i + 1,
      name: `Test User ${i + 1}`,
      email: `test${i + 1}@example.com`,
      password: 'hashedpassword',
      createdAt: new Date(),
      updatedAt: new Date(),
    }))
  }
}

// Extend global types
declare global {
  var testUtils: {
    createMockUser: () => any
    createMockUsers: (count: number) => any[]
  }
}