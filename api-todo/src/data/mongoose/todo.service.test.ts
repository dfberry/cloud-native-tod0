/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  mockTodoMongoService,
  NEW_TODO,
  UPDATED_TODO_1,
  UPDATED_TODO_2,
  ID,
  INITIAL_PARTIAL_DATA,
} from './data.mocks';
import { Todo } from '../todo.types';

describe(`Mongo happy path`, () => {
  const todoService = mockTodoMongoService;
  let id: string;
  let testtodo: Todo;

  beforeAll(async () => {
    await todoService.seed(INITIAL_PARTIAL_DATA);
  });

  it('should add a todo', async () => {
    const { data, error } = await todoService.add(NEW_TODO);

    const returnedTodo: Todo = data as Todo;

    expect(error).toEqual(null);
    expect(returnedTodo).not.toEqual(null);
    expect(Object.keys(returnedTodo).length).toEqual(5);
    expect(returnedTodo.title).toEqual(NEW_TODO.title);
    expect(returnedTodo.description).toEqual(NEW_TODO.description);
    expect(returnedTodo.id).not.toBeNull();
    expect(returnedTodo.createdAt).not.toBeNull();
    expect(returnedTodo.updatedAt).toBeNull();

    id = returnedTodo.id;
    testtodo = returnedTodo;
  });

  it('should get a todo', async () => {
    const id = ID;

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

  it('should initial update a todo (without updatedAt value)', async () => {
    const { data, error } = await todoService.update(
      testtodo.id,
      UPDATED_TODO_1
    );
    const returnedTodo: Todo = data as Todo;

    testtodo = returnedTodo;

    expect(error).toEqual(null);
    expect(Object.keys(returnedTodo).length).toEqual(5);
    expect(returnedTodo.id).toEqual(UPDATED_TODO_1.id);
    expect(returnedTodo.title).toEqual(UPDATED_TODO_1.title);
    expect(returnedTodo.description).toEqual(UPDATED_TODO_1.description);
    expect(returnedTodo.createdAt).toEqual(UPDATED_TODO_1.createdAt);
    expect(returnedTodo.updatedAt).not.toBeNull();
  });
  it('should subsequent update a todo (with updatedAt)', async () => {
    const { data, error } = await todoService.update(
      testtodo.id,
      UPDATED_TODO_2
    );
    const returnedTodo: Todo = data as Todo;

    expect(error).toEqual(null);
    expect(Object.keys(returnedTodo).length).toEqual(5);
    expect(returnedTodo.id).toEqual(UPDATED_TODO_2.id);
    expect(returnedTodo.title).toEqual(UPDATED_TODO_2.title);
    expect(returnedTodo.description).toEqual(UPDATED_TODO_2.description);
    expect(returnedTodo.createdAt).toEqual(UPDATED_TODO_2.createdAt);
    expect(returnedTodo.updatedAt).not.toBeNull();
  });

  it('should delete a todo', async () => {
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
