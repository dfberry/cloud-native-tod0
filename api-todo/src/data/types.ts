import { ValidationError } from 'joi';

export type DbIntializeParams<T> = {
  reset?: boolean;
  initialData?: Partial<T>[];
};

export type CrudServiceResponse<T> = {
  data: T | T[] | unknown | null;
  error: Error | null | ValidationError | ValidationError[] | undefined;
  valid?: boolean;
};

export interface IDataClass<T> {
  add: (todo: Partial<T>) => Promise<CrudServiceResponse<T>>;
  get: (id: string) => Promise<CrudServiceResponse<T>>;
  getAll: () => Promise<CrudServiceResponse<T[]>>;
  update: (id: string, todo: Partial<T>) => Promise<CrudServiceResponse<T>>;
  delete: (id: string) => Promise<CrudServiceResponse<T>>;
  deleteAll: () => Promise<CrudServiceResponse<unknown>>;
  seed: (todos: T[]) => Promise<CrudServiceResponse<T[]>>;
}
