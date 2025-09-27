import { userPhonesService } from '@/services/database/user_phones/user_phones.service';
import { userAddressesService } from '@/services/database/user_addresses/user_addresses.service';
import { PgTable } from 'drizzle-orm/pg-core';

export interface IServiceRegistry {
  userPhones: typeof userPhonesService;
  userAddresses: typeof userAddressesService;
  [key: string]: unknown;
}

export interface IRepository<TTable extends PgTable> {
  SELECT: {
    All: () => Promise<TTable["$inferSelect"][]>;
    ById: (id: number) => Promise<TTable["$inferSelect"] | null>;
  };
  INSERT: {
    One: (
      data: TTable["$inferInsert"]
    ) => Promise<TTable["$inferSelect"]>;
  };
  UPDATE: {
    One: (
      id: number,
      data: Partial<TTable["$inferInsert"]>
    ) => Promise<TTable["$inferSelect"] | null>;
  };
  DELETE: {
    One: (id: number) => Promise<boolean>;
  };
}

export interface IService<TTable extends PgTable> {
  GET: {
    All: () => Promise<TTable["$inferSelect"][]>;
    ById: (id: number) => Promise<TTable["$inferSelect"] | null>;
  };
  POST: {
    Create: (
      data: TTable["$inferInsert"]
    ) => Promise<TTable["$inferSelect"]>;
  };
  PUT: {
    Update: (
      id: number,
      data: Partial<TTable["$inferInsert"]>
    ) => Promise<TTable["$inferSelect"] | null>;
  };
  DELETE: {
    Remove: (id: number) => Promise<boolean>;
  };
}

export interface IServiceConfig {
  enableLogging?: boolean;
  enableValidation?: boolean;
  enableCaching?: boolean;
}