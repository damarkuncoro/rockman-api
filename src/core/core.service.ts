// rockman-app/src/core/core.service.ts
import { InferSelectModel, InferInsertModel } from "drizzle-orm"
import { PgTable } from "drizzle-orm/pg-core"
import { IRepository, IService, IServiceConfig } from "./core.interface"

/**
 * Generic Service class untuk business logic layer
 * Menggunakan dependency injection untuk repository
 * Mengikuti prinsip SOLID dan Domain-Driven Design
 * 
 * @template TTable - Tipe tabel yang extends PgTable
 */
export class Service<TTable extends PgTable> implements IService<TTable> {
  protected repository: IRepository<TTable>
  protected config: IServiceConfig

  /**
   * Constructor dengan dependency injection
   * @param repository - Instance repository yang akan digunakan
   * @param config - Konfigurasi service (optional)
   */
  constructor(repository: IRepository<TTable>, config: IServiceConfig = {}) {
    this.repository = repository
    this.config = {
      enableLogging: false,
      enableValidation: true,
      enableCaching: false,
      ...config
    }
  }

  /**
   * GET operations untuk mengambil data
   * Menggunakan repository yang di-inject
   */
  GET = {
    /**
     * Mengambil semua data
     * @returns Promise array dari semua record
     */
    All: async (): Promise<InferSelectModel<TTable>[]> => {
      if (this.config.enableLogging) {
        console.log('Service.GET.All() called')
      }
      return this.repository.SELECT.All()
    },
    
    /**
     * Mengambil data berdasarkan ID
     * @param id - ID record yang dicari
     * @returns Promise record atau null jika tidak ditemukan
     */
    ById: async (id: number): Promise<InferSelectModel<TTable> | null> => {
      if (this.config.enableLogging) {
        console.log(`Service.GET.ById(${id}) called`)
      }
      return this.repository.SELECT.ById(id)
    }
  }

  /**
   * POST operations untuk membuat data baru
   * Menggunakan repository yang di-inject
   */
  POST = {
    /**
     * Membuat record baru
     * @param data - Data yang akan dibuat
     * @returns Promise record yang baru dibuat
     */
    Create: async (data: InferInsertModel<TTable>): Promise<InferSelectModel<TTable>> => {
      if (this.config.enableLogging) {
        console.log('Service.POST.Create() called', data)
      }
      return this.repository.INSERT.One(data)
    }
  }

  /**
   * PUT operations untuk mengupdate data
   * Menggunakan repository yang di-inject
   */
  PUT = {
    /**
     * Update record berdasarkan ID
     * @param id - ID record yang akan diupdate
     * @param data - Data yang akan diupdate
     * @returns Promise record yang sudah diupdate atau null jika tidak ditemukan
     */
    Update: async (id: number, data: Partial<InferInsertModel<TTable>>): Promise<InferSelectModel<TTable> | null> => {
      if (this.config.enableLogging) {
        console.log(`Service.PUT.Update(${id}) called`, data)
      }
      return this.repository.UPDATE.One(id, data)
    }
  }

  /**
   * DELETE operations untuk menghapus data
   * Menggunakan repository yang di-inject
   */
  DELETE = {
    /**
     * Hapus record berdasarkan ID
     * @param id - ID record yang akan dihapus
     * @returns Promise boolean status penghapusan
     */
    Remove: async (id: number): Promise<boolean> => {
      if (this.config.enableLogging) {
        console.log(`Service.DELETE.Remove(${id}) called`)
      }
      return this.repository.DELETE.One(id)
    }
  }
}