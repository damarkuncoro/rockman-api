import { relations } from "drizzle-orm";
import { userAddresses } from "./table";
import { users } from "../users";

/**
 * Relasi untuk tabel user_addresses
 */
export const userAddressesRelations = relations(userAddresses, ({ one }) => ({
	user: one(users, {
		fields: [userAddresses.userId],
		references: [users.id],
	}),
}));