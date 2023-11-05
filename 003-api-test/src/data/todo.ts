import Joi, { ValidationErrorItem } from 'joi';

export interface Todo {
  id: number;
  title: string;
}

export interface PartialTodo {
  id?: unknown;
  title?: unknown;
}

const todoSchema = Joi.object({
  id: Joi.number().greater(0).required(),
  title: Joi.string().min(1).max(1000).required(),
}).unknown(false);

const todoPartialSchema = Joi.object({
  id: Joi.number().greater(0),
  title: Joi.string().min(1).max(1000).required(),
}).unknown(false);

export interface TodoValidation {
  valid: boolean;
  error: Error | null | string | ValidationErrorItem[];
  todo: Todo | PartialTodo | null;
}

export const validateTodo = (
  todo: PartialTodo,
  isNewTodo: boolean = false
): TodoValidation => {
  const schema = isNewTodo ? todoPartialSchema : todoSchema;
  const { error } = schema.validate(todo);
  if (error) {
    return {
      valid: false,
      error: error.details,
      todo: null,
    };
  }
  return { valid: true, error: null, todo };
};

export const initialData = [
  { id: 1, title: 'First Todo' },
  { id: 2, title: 'Second Todo' },
  { id: 3, title: 'Third Todo' },
];

let todos: Todo[] = initialData;
export const setTodos = (incomingTodos: Todo[]) => {
  todos = incomingTodos;
};

export const getAllTodos = (): Todo[] => {
  return todos;
};
export const addTodo = (todo: PartialTodo): Todo => {
  const newTodo: Todo = {
    id: todos.length + 1,
    title: todo.title as string,
  };

  todos.push(newTodo);
  return newTodo;
};

export const updateTodo = (id: number, todo: Todo): Todo | null => {
  const index: number = todos.findIndex((todo) => todo.id === id);
  if (index > -1) {
    todos[index] = { ...todo, id };
    return todos[index];
  } else {
    return null;
  }
};

export const deleteTodo = (id: number): number | null => {
  const index: number = todos.findIndex((todo) => todo.id === id);

  if (index > -1) {
    todos.splice(index, 1);

    return id;
  } else {
    return null;
  }
};
