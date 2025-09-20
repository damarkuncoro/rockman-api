# Access Logs Schema

## Overview

Schema untuk mencatat dan monitoring akses ke fitur sistem. Digunakan untuk audit trail, compliance, dan monitoring aktivitas user.

## Domain

**Access Monitoring** - Bertanggung jawab untuk mencatat semua akses ke fitur sistem dan menyediakan audit trail.

## File Structure

```
access_logs/
├── index.ts              # Barrel exports (entry point)
├── table.ts              # Database table definition
├── relations.ts          # Database relations
├── type_safety.ts        # TypeScript type definitions
├── data_validations.ts   # Zod schemas untuk data validation
├── api_validations.ts    # API-specific validation schemas
└── README.md            # Documentation
```

## Architecture Principles

### Single Responsibility Principle (SRP)
- **table.ts**: Hanya definisi tabel database
- **relations.ts**: Hanya definisi relasi antar tabel
- **type_safety.ts**: Hanya type definitions
- **data_validations.ts**: Hanya validasi data layer
- **api_validations.ts**: Hanya validasi API layer

### Domain-Driven Design (DDD)
- Semua file dalam domain "Access Monitoring"
- Clear separation antara data layer dan API layer
- Konsisten dengan ubiquitous language

### SOLID Principles
- **S**: Setiap file memiliki satu tanggung jawab
- **O**: Extensible tanpa memodifikasi existing code
- **D**: Dependency inversion melalui clean imports

## Usage

### Import dari Module

```typescript
// Recommended: Import dari index.ts
import { 
  accessLogs, 
  accessLogsRelations,
  AccessLog,
  NewAccessLog,
  createAccessLogSchema 
} from "@/db/schema/access_logs";

// Avoid: Direct imports
import { accessLogs } from "@/db/schema/access_logs/table";
```

### Database Operations

```typescript
// Create access log
const newLog: NewAccessLog = {
  userId: 1,
  featureId: 5,
  path: "/api/users",
  method: "GET",
  decision: "allow"
};

// Validation
const validatedData = createAccessLogSchema.parse(newLog);
```

## Database Schema

| Field | Type | Description |
|-------|------|-------------|
| id | serial | Primary key |
| userId | integer | Reference to users.id (nullable) |
| roleId | integer | Reference to roles.id (nullable) |
| featureId | integer | Reference to features.id (nullable) |
| path | varchar(255) | Request path |
| method | varchar(10) | HTTP method |
| decision | varchar(10) | 'allow' or 'deny' |
| reason | text | Optional reason for decision |
| createdAt | timestamp | Auto-generated timestamp |

## Relations

- **user**: Many-to-One dengan users table
- **role**: Many-to-One dengan roles table  
- **feature**: Many-to-One dengan features table

## Validation Rules

### Insert Schema
- userId: Optional positive integer
- roleId: Optional positive integer
- featureId: Optional positive integer
- path: Required string (1-255 chars)
- method: Optional string (max 10 chars)
- decision: Required enum ("allow" | "deny")
- reason: Optional string

## Best Practices

1. **Always use the barrel import** dari index.ts
2. **Validate data** menggunakan provided schemas
3. **Follow naming conventions** sesuai domain language
4. **Maintain separation** antara data dan API validations
5. **Document changes** di README ini saat ada perubahan struktur