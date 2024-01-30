import mongoose from 'mongoose';
import { TodoSchema } from './todo.schema';
import { CrudServiceResponse, IDataClass } from '../types';
import { Todo } from '../todo.types';
import { isValidPartial } from '../todo.validation';
import CrudService from './crud.service';

export class TodoService implements IDataClass<Todo> {
  #service: CrudService<Todo>;

  constructor(connection: mongoose.Connection) {
    const ConnectedTodoModel = connection.model<Todo>('todo', TodoSchema);
    this.#service = new CrudService<Todo>(ConnectedTodoModel);
  }

  async get(id: string): Promise<CrudServiceResponse<Todo>> {
    if (!id) {
      return { data: null, error: new Error('id is required') };
    }

    return await this.#service.get(id);
  }

  async add(todo: Partial<Todo>): Promise<CrudServiceResponse<Todo>> {
    const { valid, error } = isValidPartial(todo);
    if (!valid) {
      return { data: null, error: error };
    }
    const addResponse = await this.#service.add(todo);
    return addResponse;
  }

  async update(
    id: string,
    todo: Partial<Todo>
  ): Promise<CrudServiceResponse<Todo>> {
    if (!id) {
      return { data: null, error: new Error('id is required') };
    }

    const { valid, error } = isValidPartial(todo);
    if (!valid) {
      return { data: null, error: error };
    }

    const updateResponse = await this.#service.update(id, {
      title: todo.title as string,
      description: todo.description as string,
      updatedAt: new Date().toISOString(),
    } as Todo);
    return updateResponse;
  }

  async delete(id: string): Promise<CrudServiceResponse<Todo>> {
    if (!id) {
      return { data: null, error: new Error('id is required') };
    }

    return await this.#service.delete(id);
  }
  async getAll(): Promise<CrudServiceResponse<Todo[]>> {
    return await this.#service.getAll();
  }
  async seed(
    incomingTodos: Partial<Todo>[]
  ): Promise<CrudServiceResponse<Todo[]>> {
    return await this.#service.seed(incomingTodos);
  }
  async deleteAll(): Promise<CrudServiceResponse<Todo[]>> {
    const deleteResponse = await this.#service.deleteAll();
    return deleteResponse;
  }
}
