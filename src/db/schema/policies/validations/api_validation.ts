import { z } from "zod";
import { idSchema } from "../../common/schemas";

/**
 * Schema validasi API untuk policies
 * 
 * Domain: RBAC/ABAC - API Layer
 * Responsibility: Validasi input API dan request handling untuk policies
 */

/**
 * API validation schema untuk create policy
 */
export const createPolicySchema = z.object({
  featureId: idSchema,
  attribute: z.enum(["department", "region", "level"]),
  operator: z.enum(["==", "!=", ">", ">=", "<", "<=", "in"]),
  value: z.string().min(1),
});

/**
 * API input types untuk request handling
 */
export type CreatePolicyInput = z.infer<typeof createPolicySchema>;