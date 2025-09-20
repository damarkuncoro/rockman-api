// rockman-app/src/core/core.repository.ts
import { InferInsertModel, InferSelectModel, eq } from "drizzle-orm"
import { PgTable } from "drizzle-orm/pg-core"
import db from "../db"
import { IRepository } from "./core.interface"

/**
 * Generic Repository class untuk operasi CRUD database
 * Menggunakan Drizzle ORM dengan type safety
 * Mengimplementasi IRepository interface
 * 
 * @template TTable - Tipe tabel yang extends PgTable
 */
export class Repository<TTable extends PgTable> implements IRepository<TTable> {
  private table: TTable

  /**
   * Constructor untuk inisialisasi repository dengan tabel
   * @param table - Instance tabel Drizzle ORM
   */
  constructor(table: TTable) {
    this.table = table
  }

  /**
   * Operasi SELECT untuk mengambil data dari database
   */
  SELECT = {
    /**
     * Mengambil semua data dari tabel
     * @returns Promise array dari semua record
     */
    All: async (): Promise<InferSelectModel<TTable>[]> => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return await db.select().from(this.table as any) as InferSelectModel<TTable>[]
    },
    
    /**
     * Mengambil data berdasarkan ID
     * @param id - ID record yang dicari
     * @returns Promise record atau null jika tidak ditemukan
     */
    ById: async (id: number): Promise<InferSelectModel<TTable> | null> => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const rows = await db.select().from(this.table as any).where(eq((this.table as any).id, id))
        return rows.length > 0 ? (rows[0] as InferSelectModel<TTable>) : null
      } catch (error: any) {
        // Handle PostgreSQL specific errors
        if (error.code === '22003') {
          throw new Error(`ID value ${id} is out of range for PostgreSQL integer type`)
        }
        // Re-throw other database errors
        throw new Error(`Failed query: ${error.message || 'Unknown database error'}`)
      }
    }
  }

  /**
   * Operasi INSERT untuk menambah data ke database
   */
  INSERT = {
    /**
     * Menambah satu record baru
     * @param values - Data yang akan diinsert
     * @returns Promise record yang baru dibuat
     */
    One: async (values: InferInsertModel<TTable>): Promise<InferSelectModel<TTable>> => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const rows = await db.insert(this.table as any).values(values).returning() as any[]
        
        if (!rows || rows.length === 0) {
          throw new Error('Insert operation failed: No data returned')
        }
        
        return rows[0] as InferSelectModel<TTable>
      } catch (error) {
        console.error('INSERT.One error:', error)
        throw error
      }
    }
  }

  /**
   * Operasi UPDATE untuk mengubah data di database
   */
  UPDATE = {
    /**
     * Mengupdate satu record berdasarkan ID
     * @param id - ID record yang akan diupdate
     * @param values - Data yang akan diupdate (partial)
     * @returns Promise record yang sudah diupdate atau null jika tidak ditemukan
     */
    One: async (id: number, values: Partial<InferInsertModel<TTable>>): Promise<InferSelectModel<TTable> | null> => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const rows = await db.update(this.table as any).set(values).where(eq((this.table as any).id, id)).returning() as any[]
      return rows.length > 0 ? rows[0] as InferSelectModel<TTable> : null
    }
  }

  /**
   * Operasi DELETE untuk menghapus data dari database
   */
  DELETE = {
    /**
     * Menghapus satu record berdasarkan ID
     * @param id - ID record yang akan dihapus
     * @returns Promise boolean status penghapusan
     */
    One: async (id: number): Promise<boolean> => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = await db.delete(this.table as any).where(eq((this.table as any).id, id)).returning() as any[]
      return result.length > 0
    }
  }
}
