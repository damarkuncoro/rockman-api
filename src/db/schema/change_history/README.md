# Change History Schema

## Overview

Schema untuk tracking perubahan data dalam aplikasi Rockman. Menggunakan struktur modular yang mengikuti prinsip SOLID dan DRY.

## Domain

**Change Tracking** - Bertanggung jawab untuk mencatat semua perubahan data yang terjadi dalam sistem.

## Structure

```
change_history/
├── index.ts          # Barrel exports
├── table.ts          # Table definition
├── relations.ts      # Database relations
├── type_safety.ts    # TypeScript types
├── validations.ts    # Zod schemas
└── README.md         # Documentation
```

## Files

### `table.ts`
- Definisi tabel `changeHistory` dengan kolom dan constraints
- Menggunakan Drizzle ORM untuk type-safe database operations

### `relations.ts`
- Relasi dengan tabel `users`
- Foreign key constraints dan referential integrity

### `type_safety.ts`
- TypeScript types yang di-infer dari schema
- `ChangeHistory` - untuk select operations
- `NewChangeHistory` - untuk insert operations

### `validations.ts`
- Zod schemas untuk validasi input
- Menggunakan shared schemas dari `../validation.ts` (DRY principle)
- `insertChangeHistorySchema` - untuk create operations
- `selectChangeHistorySchema` - untuk query operations
- `createChangeHistorySchema` - untuk API input

### `index.ts`
- Barrel pattern exports
- Single import point untuk semua change history exports

## Usage

```typescript
// Import semua yang diperlukan dari satu tempat
import {
  changeHistory,
  changeHistoryRelations,
  ChangeHistory,
  NewChangeHistory,
  insertChangeHistorySchema,
  createChangeHistorySchema,
} from "@/db/schema/change_history";

// Validasi input
const validatedData = createChangeHistorySchema.parse(inputData);

// Type-safe database operations
const newRecord: NewChangeHistory = {
  userId: 1,
  tableName: "users",
  recordId: 123,
  action: "update",
  oldValues: JSON.stringify(oldData),
  newValues: JSON.stringify(newData),
};
```

## Principles Applied

- **SRP (Single Responsibility Principle)**: Setiap file memiliki tanggung jawab yang spesifik
- **DRY (Don't Repeat Yourself)**: Menggunakan shared schemas dari validation.ts
- **SOLID**: Struktur yang modular dan mudah di-extend
- **Type Safety**: Full TypeScript support dengan inferred types
- **Barrel Pattern**: Clean imports melalui index.ts

## Related Schemas

- `users` - Relasi many-to-one untuk tracking user yang melakukan perubahan
- `validation.ts` - Shared validation schemas