/**
 * Mock data untuk users
 * Digunakan sementara ketika database PostgreSQL tidak tersedia
 * 
 * Domain: User Management
 * Responsibility: Menyediakan sample data users untuk testing dan development
 */

export interface MockUser {
  id: number;
  name: string;
  email: string;
  active: boolean;
  department: string | null;
  region: string | null;
  level: number | null;
  rolesUpdatedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Sample data users untuk testing
 * Data ini mensimulasikan struktur tabel users dari database
 */
export const mockUsers: MockUser[] = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@company.com",
    active: true,
    department: "Engineering",
    region: "Jakarta",
    level: 3,
    rolesUpdatedAt: "2024-01-15T10:30:00Z",
    createdAt: "2024-01-01T08:00:00Z",
    updatedAt: "2024-01-15T10:30:00Z"
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane.smith@company.com",
    active: true,
    department: "Marketing",
    region: "Surabaya",
    level: 2,
    rolesUpdatedAt: "2024-01-10T14:20:00Z",
    createdAt: "2024-01-02T09:15:00Z",
    updatedAt: "2024-01-10T14:20:00Z"
  },
  {
    id: 3,
    name: "Ahmad Rahman",
    email: "ahmad.rahman@company.com",
    active: true,
    department: "Sales",
    region: "Bandung",
    level: 1,
    rolesUpdatedAt: "2024-01-12T16:45:00Z",
    createdAt: "2024-01-03T10:30:00Z",
    updatedAt: "2024-01-12T16:45:00Z"
  },
  {
    id: 4,
    name: "Sarah Wilson",
    email: "sarah.wilson@company.com",
    active: false,
    department: "HR",
    region: "Jakarta",
    level: 4,
    rolesUpdatedAt: "2024-01-08T11:15:00Z",
    createdAt: "2024-01-04T13:20:00Z",
    updatedAt: "2024-01-08T11:15:00Z"
  },
  {
    id: 5,
    name: "Michael Chen",
    email: "michael.chen@company.com",
    active: true,
    department: "Engineering",
    region: "Medan",
    level: 5,
    rolesUpdatedAt: "2024-01-14T09:30:00Z",
    createdAt: "2024-01-05T07:45:00Z",
    updatedAt: "2024-01-14T09:30:00Z"
  },
  {
    id: 6,
    name: "Lisa Anderson",
    email: "lisa.anderson@company.com",
    active: true,
    department: "Finance",
    region: "Yogyakarta",
    level: 3,
    rolesUpdatedAt: "2024-01-11T15:10:00Z",
    createdAt: "2024-01-06T12:00:00Z",
    updatedAt: "2024-01-11T15:10:00Z"
  },
  {
    id: 7,
    name: "David Kumar",
    email: "david.kumar@company.com",
    active: true,
    department: "Operations",
    region: "Semarang",
    level: 2,
    rolesUpdatedAt: "2024-01-13T13:25:00Z",
    createdAt: "2024-01-07T14:30:00Z",
    updatedAt: "2024-01-13T13:25:00Z"
  },
  {
    id: 8,
    name: "Maria Garcia",
    email: "maria.garcia@company.com",
    active: true,
    department: "Marketing",
    region: "Bali",
    level: 1,
    rolesUpdatedAt: "2024-01-09T17:40:00Z",
    createdAt: "2024-01-08T16:15:00Z",
    updatedAt: "2024-01-09T17:40:00Z"
  },
  {
    id: 9,
    name: "Robert Taylor",
    email: "robert.taylor@company.com",
    active: false,
    department: "IT Support",
    region: "Makassar",
    level: 2,
    rolesUpdatedAt: "2024-01-07T12:50:00Z",
    createdAt: "2024-01-09T11:20:00Z",
    updatedAt: "2024-01-07T12:50:00Z"
  },
  {
    id: 10,
    name: "Emma Thompson",
    email: "emma.thompson@company.com",
    active: true,
    department: "Design",
    region: "Jakarta",
    level: 3,
    rolesUpdatedAt: "2024-01-16T08:15:00Z",
    createdAt: "2024-01-10T09:45:00Z",
    updatedAt: "2024-01-16T08:15:00Z"
  }
];

/**
 * Utility functions untuk mock data operations
 */
export const mockUserOperations = {
  /**
   * Mengambil semua users
   * @returns Promise array semua mock users
   */
  getAllUsers: async (): Promise<MockUser[]> => {
    // Simulasi delay network
    await new Promise(resolve => setTimeout(resolve, 100));
    return mockUsers;
  },

  /**
   * Mengambil user berdasarkan ID
   * @param id - ID user yang dicari
   * @returns Promise user atau null jika tidak ditemukan
   */
  getUserById: async (id: number): Promise<MockUser | null> => {
    // Simulasi delay network
    await new Promise(resolve => setTimeout(resolve, 50));
    return mockUsers.find(user => user.id === id) || null;
  },

  /**
   * Mengambil users berdasarkan status active
   * @param active - Status active yang dicari
   * @returns Promise array users dengan status tersebut
   */
  getUsersByActiveStatus: async (active: boolean): Promise<MockUser[]> => {
    // Simulasi delay network
    await new Promise(resolve => setTimeout(resolve, 75));
    return mockUsers.filter(user => user.active === active);
  },

  /**
   * Mengambil users berdasarkan department
   * @param department - Department yang dicari
   * @returns Promise array users dari department tersebut
   */
  getUsersByDepartment: async (department: string): Promise<MockUser[]> => {
    // Simulasi delay network
    await new Promise(resolve => setTimeout(resolve, 75));
    return mockUsers.filter(user => user.department === department);
  }
};