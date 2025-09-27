import { IService, IServiceRegistry } from './core.interface';
import { PgTable } from 'drizzle-orm/pg-core';

type ServiceRegistration<TTable extends PgTable> = {
  [K in string]: IService<TTable>;
};

class ServiceRegistry {
  [key: string]: unknown;
  private services: Map<string, IService<PgTable>> = new Map();

  register<TTable extends PgTable>(
    name: string,
    service: IService<TTable>
  ): void {
    if (this.services.has(name)) {
      console.warn(
        `[SERVICE Registry] Service '${name}' sudah terdaftar. Mengganti dengan instance baru.`
      );
    }
    this.services.set(name, service);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (this as any)[name] = service;
    if (
      typeof process !== 'undefined' &&
      process.env?.NODE_ENV === 'development'
    ) {
      console.log(`[SERVICE Registry] Service '${name}' berhasil didaftarkan`);
    }
  }

  get<TTable extends PgTable>(name: string): IService<TTable> | undefined {
    return this.services.get(name) as IService<TTable> | undefined;
  }

  unregister(name: string): boolean {
    const existed = this.services.has(name);
    if (existed) {
      this.services.delete(name);
      delete (this as Record<string, unknown>)[name];
      if (
        typeof process !== 'undefined' &&
        process.env?.NODE_ENV === 'development'
      ) {
        console.log(`[SERVICE Registry] Service '${name}' berhasil dihapus`);
      }
    }
    return existed;
  }

  list(): string[] {
    return Array.from(this.services.keys());
  }

  has(name: string): boolean {
    return this.services.has(name);
  }

  clear(): void {
    const serviceNames = this.list();
    this.services.clear();
    serviceNames.forEach((name) => {
      delete (this as Record<string, unknown>)[name];
    });
    if (
      typeof process !== 'undefined' &&
      process.env?.NODE_ENV === 'development'
    ) {
      console.log('[SERVICE Registry] Semua services berhasil dihapus');
    }
  }

  stats(): { total: number; services: string[] } {
    const services = this.list();
    return {
      total: services.length,
      services,
    };
  }
}

const serviceRegistry = new ServiceRegistry();

export const SERVICE = serviceRegistry as unknown as IServiceRegistry & ServiceRegistry;

export default SERVICE;
export type { ServiceRegistration };