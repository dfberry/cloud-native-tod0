import { Todo } from '../todo.types';
import { IDataClass, DbIntializeParams, CrudServiceResponse } from '../types';
import { isValidPartial, TodoValidation } from '../todo.validation';
// create class with crud methods
class TodoInMemoryService implements IDataClass<Todo> {
  #todos: Todo[] = [];

  async init(params: DbIntializeParams<Todo>): Promise<void> {
    await this.deleteAll();

    if (params.initialData && params.initialData.length > 0) {
      await this.seed(params.initialData);
    }
  }

  async seed(
    incomingTodos: Partial<Todo>[]
  ): Promise<CrudServiceResponse<Todo[]>> {
    this.#todos = [];
    this.#todos = incomingTodos.map((todo, index) => ({
      id: (index + 1).toString(), // Assign a numeric id
      title: todo.title as string, // Assign a title
      description: todo.description, // Assign a description
      createdAt: new Date().toISOString(), // Assign the current date
      updatedAt: null, // Set updatedAt as null
    }));

    return Promise.resolve({ data: [...this.#todos], error: null });
  }
  async get(id: string): Promise<CrudServiceResponse<Todo>> {
    const todoFound = this.#todos.find((todo) => todo.id === id) || null;
    return Promise.resolve({ data: { ...todoFound }, error: null });
  }
  async getAll(): Promise<CrudServiceResponse<Todo[]>> {
    return Promise.resolve({ data: [...this.#todos], error: null });
  }

  async add(todo: Partial<Todo>): Promise<CrudServiceResponse<Todo>> {
    const { valid, error } = isValidPartial(todo);
    if (!valid) {
      return Promise.resolve({ data: null, error: error });
    }

    const newTodo: Todo = {
      id: (this.#todos.length + 1).toString(),
      title: todo.title as string,
      description: todo.description,
      createdAt: new Date().toISOString(),
      updatedAt: null,
    };

    this.#todos.push(newTodo);
    return Promise.resolve({ data: newTodo, error: null });
  }

  async update(
    id: string,
    todo: Partial<Todo>
  ): Promise<CrudServiceResponse<Todo>> {
    if (!id) {
      return Promise.resolve({
        data: null,
        error: new Error('Todo Service::update - id is required'),
      });
    }

    const { valid, error } = isValidPartial(todo);
    if (!valid) {
      return Promise.resolve({ data: null, error: error });
    }

    const index: number = this.#todos.findIndex((todo) => todo.id === id);
    if (index > -1) {
      const tempTodo = this.#todos[index];

      tempTodo.id = id;
      tempTodo.title = (
        (todo?.title as string) ? todo.title : tempTodo.title
      ) as string;
      tempTodo.description = (todo?.description as string)
        ? todo.description
        : tempTodo.description;
      tempTodo.updatedAt = new Date().toISOString();
      tempTodo.createdAt = tempTodo.createdAt;

      this.#todos[index] = tempTodo;
      return Promise.resolve({ data: tempTodo, error: null });
    } else {
      return Promise.resolve({ data: null, error: null });
    }
  }

  async delete(id: string): Promise<CrudServiceResponse<Todo>> {
    if (!id) {
      return Promise.resolve({
        data: null,
        error: new Error("Todo Service::delete - 'id is required"),
      });
    }

    const index: number = this.#todos.findIndex((todo) => todo.id === id);
    const item = this.#todos[index];

    if (index > -1) {
      this.#todos.splice(index, 1);
      return Promise.resolve({ data: item, error: null });
    } else {
      return Promise.resolve({
        data: null,
        error: new Error('Todo Service::delete - id not found'),
      });
    }
  }
  async deleteAll(): Promise<CrudServiceResponse<Todo[]>> {
    const length = this.#todos.length;
    this.#todos = [];
    return Promise.resolve({ data: { deletedCount: length }, error: null });
  }
}
export { TodoValidation, TodoInMemoryService };
