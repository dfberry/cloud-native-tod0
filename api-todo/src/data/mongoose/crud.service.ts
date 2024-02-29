import { Model } from 'mongoose';
import { CrudServiceResponse } from '../types';

export default class CrudService<T> {
  #model: Model<T>;

  constructor(model: Model<T>) {
    this.#model = model;
  }

  // Add
  async add(doc: Partial<T>): Promise<CrudServiceResponse<T>> {
    try {
      const improvedDoc = {
        ...doc,
        createdAt: new Date().toISOString(),
        updatedAt: null,
      };
      const data = await this.#model.create(improvedDoc);

      return { data: data?.toJSON(), error: data?.errors };
    } catch (error) {
      return { data: null, error: new Error(`Crud service:add - ${error}`) };
    }
  }

  // Read
  async get(id: string): Promise<CrudServiceResponse<T>> {
    try {
      const data = await this.#model.findById(id);

      return { data: data?.toJSON(), error: data?.errors };
    } catch (error) {
      return { data: null, error: new Error(`Crud service:get - ${error}`) };
    }
  }

  // Update
  async update(
    id: string,
    update: T
  ): Promise<CrudServiceResponse<T>> {
    try {
      const improvedDoc = { ...update, updatedAt: new Date().toISOString() };

      const data = await this.#model.findByIdAndUpdate(id, improvedDoc, {
        new: true,
      });

      return { data: data?.toJSON(), error: data?.errors };
    } catch (error) {
      return { data: null, error: new Error(`Crud service:update - ${error}`) };
    }
  }

  // Delete
  async delete(id: string): Promise<CrudServiceResponse<T>> {
    try {
      const data = await this.#model.findByIdAndDelete(id);

      return { data: data?.toJSON(), error: data?.errors };
    } catch (error) {
      return { data: null, error: new Error(`Crud service:delete - ${error}`) };
    }
  }

  // Get All
  async getAll(): Promise<CrudServiceResponse<T[]>> {
    try {
      const data = await this.#model.find();
      return data ? { data, error: null } : { data: null, error: null };
    } catch (error) {
      return { data: null, error: new Error(`Crud service:getAll - ${error}`) };
    }
  }

  // Delete All
  async deleteAll(): Promise<CrudServiceResponse<unknown>> {
    try {
      const deleteAllResponse = await this.#model.deleteMany({});
      return { data: deleteAllResponse, error: null };
    } catch (error) {
      return {
        data: null,
        error: new Error(`Crud service:deleteAll - ${error}`),
      };
    }
  }

  // Seed
  async seed(docs: T[] | Partial<T>[]): Promise<CrudServiceResponse<T[]>> {
    try {
      const result = await this.#model.insertMany(docs);
      return { data: result, error: null };
    } catch (error) {
      return { data: null, error: new Error(`Crud service:seed - ${error}`)};
    }
  }
}
