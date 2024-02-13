import Joi from 'joi';
import initialData from './todo.initial.json';
import { Todo } from './todo.types';

export const INITIAL_PARTIAL_DATA: Partial<Todo>[] = initialData;

export { initialData };

export const MAX_LENGTH_TITLE = 50;
export const MAX_LENGTH_DESCRIPTION = 500;

// Title is only required field
export const updateTodoSchema = Joi.object({
  id: Joi.alternatives().try(Joi.number().greater(0), Joi.string()).required(),
  title: Joi.string().min(1).max(MAX_LENGTH_TITLE).required(),
  description: Joi.string().min(1).max(MAX_LENGTH_DESCRIPTION),
  createdAt: Joi.date().iso().required(),
  updatedAt: Joi.date().iso().allow(null), // FIXED: initial update won't have updatedAt value
}).unknown(false);

export const newTodoSchema = Joi.object({
  title: Joi.string().min(1).max(MAX_LENGTH_TITLE).required(),
  description: Joi.string().min(1).max(MAX_LENGTH_DESCRIPTION),
}).unknown(false);

export interface TodoValidation {
  valid: boolean;
  error: Error | null;
  todo: Todo | Partial<Todo> | null;
}

export const isValidPartial = (todo: Partial<Todo>): TodoValidation => {
    const { error } = newTodoSchema.validate(todo);
    if (error) {
      if (error.details) {
        const messages = error.details.map((item) => item.message).join(', ');
        const returnObj = {
          valid: false,
          error: new Error(`todo.validation failed:isValidPartial ${messages}`),
          todo: null,
        };
        return returnObj;
      }
    }
    return { valid: true, error: null, todo };
};

export const isValidAll = (todo: Todo): TodoValidation => {
  const { error } = updateTodoSchema.validate(todo);
  if (error) {
    // if error is a ValidationErrorItem, join all messages together
    if (error.details) {
      const messages = error.details.map((item) => item.message);
      return {
        valid: false,
        error: new Error(`todo.validation failed:isValidAll ${messages}`),
        todo: null,
      };
    }
  }
  return { valid: true, error: null, todo };
};
