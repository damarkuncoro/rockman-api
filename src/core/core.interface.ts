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
    All: () => Promise<any[]>;
    ById: (id: number) => Promise<any | null>;
  };
  INSERT: {
    One: (data: any) => Promise<any>;
  };
  UPDATE: {
    One: (id: number, data: any) => Promise<any | null>;
  };
  DELETE: {
    One: (id: number) => Promise<boolean>;
  };
}

export interface IService<TTable extends PgTable> {
  GET: {
    All: () => Promise<any[]>;
    ById: (id: number) => Promise<any | null>;
  };
  POST: {
    Create: (data: any) => Promise<any>;
  };
  PUT: {
    Update: (id: number, data: any) => Promise<any | null>;
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