/* eslint-disable @typescript-eslint/no-unused-vars */
import { TodoInMemoryService } from './todo.service';
import { initialData } from '../todo.validation';
import { Todo } from '../todo.types';

describe(`In memory happy path`, () => {
  const todoService = new TodoInMemoryService();
  let id: string;
  let testtodo: Todo;

  beforeAll(async () => {
    await todoService.seed(initialData);
  });

  it('should add a todo', async () => {
    const todo: Partial<Todo> = {
      title: 'inmem Test Todo',
      description: 'inmem Test Todo Description',
    };

    const { data, error } = await todoService.add(todo);

    const returnedTodo: Todo = data as Todo;

    expect(error).toEqual(null);
    expect(Object.keys(returnedTodo).length).toEqual(5);
    expect(returnedTodo).not.toEqual(null);
    expect(returnedTodo.title).toEqual(todo.title);
    expect(returnedTodo.description).toEqual(todo.description);
    expect(returnedTodo.id).not.toBeNull();
    expect(returnedTodo.createdAt).not.toBeNull();
    expect(returnedTodo.updatedAt).toBeNull();

    id = returnedTodo.id;
    testtodo = returnedTodo;
  });

  it('should get a todo', async () => {
    const { data, error } = await todoService.get(id);

    const returnedTodo: Todo = data as Todo;

    expect(error).toEqual(null);
    expect(Object.keys(returnedTodo).length).toEqual(5);
    expect(returnedTodo.id).toEqual(id);
    expect(returnedTodo.title).toEqual(testtodo.title);
    expect(returnedTodo.description).toEqual(testtodo.description);
    expect(returnedTodo.createdAt).not.toBeNull();
    expect(returnedTodo.updatedAt).toBeNull();
  });

  it('should update a todo', async () => {
    const update = {
      title: 'todo service test up - ' + testtodo.title,
      description: 'todo service test up - ' + testtodo.description,
    };

    const { data, error } = await todoService.update(testtodo.id, update);
    const returnedTodo: Todo = data as Todo;

    expect(error).toEqual(null);
    expect(Object.keys(returnedTodo).length).toEqual(5);
    expect(returnedTodo.id).toEqual(testtodo.id);
    expect(returnedTodo.title).toEqual(update.title);
    expect(returnedTodo.description).toEqual(update.description);
    expect(returnedTodo.createdAt).not.toBeNull();
    expect(returnedTodo.updatedAt).not.toBeNull();
  });

  it('should delete a todo', async () => {
    const id = '1';

    const { error } = await todoService.delete(id);
    expect(error).toBeNull();
  });

  it('should get all todos', async () => {
    const { data, error } = await todoService.getAll();

    const returnedTodos: Todo[] = data as Todo[];

    expect(error).toEqual(null);
    expect(returnedTodos.length).toEqual(3);
  });
});
