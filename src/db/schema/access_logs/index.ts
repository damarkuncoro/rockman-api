/**
 * Access Logs Schema Module
 * 
 * Domain: Access Monitoring
 * Responsibility: Centralized exports untuk access logs schema
 * 
 * @description Barrel pattern untuk:
 * - Clean imports dari luar module
 * - Separation of concerns
 * - Konsistensi API module
 * - Kemudahan maintenance
 */

// Table Definition
export { accessLogs } from "./table";

// Relations
export { accessLogsRelations } from "./relations";

// Type Safety
export type { AccessLog, NewAccessLog } from "./type_safety";

// Data Validations
export { 
  insertAccessLogSchema, 
  selectAccessLogSchema 
} from "./validations/data_validation";

// API Validations
export { 
  createAccessLogSchema,
  type CreateAccessLogInput 
} from "./validations/api_validation";