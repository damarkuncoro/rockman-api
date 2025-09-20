// rockman-app/src/core/core.service.interface.ts
import { InferSelectModel, InferInsertModel } from "drizzle-orm"
import { PgTable } from "drizzle-orm/pg-core"

/**
 * Interface untuk Repository operations
 * Memungkinkan dependency injection dan testing yang lebih mudah
 * 
 * @template TTable - Tipe tabel yang extends PgTable
 */
export interface IRepository<TTable extends PgTable> {
  SELECT: {
    All(): Promise<InferSelectModel<TTable>[]>
    ById(id: number): Promise<InferSelectModel<TTable> | null>
  }
  INSERT: {
    One(data: InferInsertModel<TTable>): Promise<InferSelectModel<TTable>>
  }
  UPDATE: {
    One(id: number, data: Partial<InferInsertModel<TTable>>): Promise<InferSelectModel<TTable> | null>
  }
  DELETE: {
    One(id: number): Promise<boolean>
  }
}

/**
 * Interface untuk Service operations
 * Mendefinisikan kontrak untuk service layer
 * 
 * @template TTable - Tipe tabel yang extends PgTable
 */
export interface IService<TTable extends PgTable> {
  GET: {
    All(): Promise<InferSelectModel<TTable>[]>
    ById(id: number): Promise<InferSelectModel<TTable> | null>
  }
  POST: {
    Create(data: InferInsertModel<TTable>): Promise<InferSelectModel<TTable>>
  }
  PUT: {
    Update(id: number, data: Partial<InferInsertModel<TTable>>): Promise<InferSelectModel<TTable> | null>
  }
  DELETE: {
    Remove(id: number): Promise<boolean>
  }
}

/**
 * Base interface untuk service configuration
 * Memungkinkan konfigurasi tambahan untuk service
 */
export interface IServiceConfig {
  enableLogging?: boolean
  enableValidation?: boolean
  enableCaching?: boolean
}