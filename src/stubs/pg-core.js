/**
 * Stub untuk drizzle-orm/pg-core di client-side
 * Menyediakan mock functions untuk schema definitions
 */

// Mock column builders
const createColumnBuilder = (type) => ({
  primaryKey: () => createColumnBuilder(type),
  notNull: () => createColumnBuilder(type),
  unique: () => createColumnBuilder(type),
  default: (value) => createColumnBuilder(type),
  defaultNow: () => createColumnBuilder(type),
  references: (callback, options) => createColumnBuilder(type),
});

// Mock table builder
const mockTable = {};

// Export semua functions yang dibutuhkan schema
export const pgTable = (name, columns) => mockTable;
export const serial = (name) => createColumnBuilder('serial');
export const integer = (name) => createColumnBuilder('integer');
export const varchar = (name, options) => createColumnBuilder('varchar');
export const text = (name) => createColumnBuilder('text');
export const boolean = (name) => createColumnBuilder('boolean');
export const timestamp = (name, options) => createColumnBuilder('timestamp');
export const json = (name) => createColumnBuilder('json');

// Export PgTable type untuk core interfaces
export const PgTable = mockTable;

// Default export
export default {
  pgTable,
  serial,
  integer,
  varchar,
  text,
  boolean,
  timestamp,
  json,
  PgTable
};