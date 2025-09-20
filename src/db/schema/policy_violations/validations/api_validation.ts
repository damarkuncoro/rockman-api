import { z } from "zod";
import { insertPolicyViolationDataSchema } from "./data_validation";

/**
 * Schema validasi API untuk policy violations
 * 
 * Domain: Policy Violation Monitoring - API Layer
 * Responsibility: Validasi input API dan request handling untuk policy violations
 */

/**
 * API validation schema untuk create policy violation
 */
export const createPolicyViolationSchema = z.object({
  userId: z.number().int().positive().optional(),
  featureId: z.number().int().positive().optional(),
  policyId: z.number().int().positive().optional(),
  attribute: z.string().min(1, "Attribute diperlukan").max(100, "Attribute maksimal 100 karakter"),
  expectedValue: z.string().min(1, "Expected value diperlukan"),
  actualValue: z.string().optional(),
});

/**
 * API input types untuk request handling
 */
export type CreatePolicyViolationInput = z.infer<typeof createPolicyViolationSchema>;