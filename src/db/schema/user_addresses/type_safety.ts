import { userAddresses } from "./table";

/**
 * TypeScript types untuk type safety user addresses
 * 
 * Domain: User Management
 * Responsibility: Menyediakan type safety untuk user addresses
 */
export type UserAddress = typeof userAddresses.$inferSelect;
export type NewUserAddress = typeof userAddresses.$inferInsert;