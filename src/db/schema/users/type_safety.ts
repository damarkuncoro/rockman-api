import { users } from "./table";

/**
 * TypeScript types untuk type safety users
 * 
 * Domain: User Management
 * Responsibility: Menyediakan type safety untuk users
 */
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;