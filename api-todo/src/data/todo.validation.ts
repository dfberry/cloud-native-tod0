import Joi from 'joi';
import initialData from './todo.initial.json';
import { Todo } from './todo.types';
import { toError } from '../utils/error';

export const INITIAL_PARTIAL_DATA: Partial<Todo>[] = initialData;

export { initialData };

export const MAX_LENGTH_TITLE = 50;
export const MAX_LENGTH_DESCRIPTION = 500;

export const todoSchema = Joi.object({
  id: Joi.alternatives().try(Joi.number().greater(0), Joi.string()).required(),
  title: Joi.string().min(1).max(MAX_LENGTH_TITLE).required(),
  description: Joi.string().min(1).max(MAX_LENGTH_DESCRIPTION).required(),
  createdAt: Joi.date().iso().required(),
  updatedAt: Joi.date().iso().allow(null),
}).unknown(false);

// Title is only required field
export const updateTodoSchema = Joi.object({
  id: Joi.alternatives().try(Joi.number().greater(0), Joi.string()),
  title: Joi.string().min(1).max(MAX_LENGTH_TITLE).required(),
  description: Joi.string().min(1).max(MAX_LENGTH_DESCRIPTION),
  createdAt: Joi.date().iso(),
  updatedAt: Joi.date().iso(),
}).unknown(false);

export const todoPartialSchema = Joi.object({
  title: Joi.string().min(1).max(MAX_LENGTH_TITLE).required(),
  description: Joi.string().min(1).max(MAX_LENGTH_DESCRIPTION),
}).unknown(false);

export interface TodoValidation {
  valid: boolean;
  error: Error | null;
  todo: Todo | Partial<Todo> | null;
}

export const isValidPartial = (todo: Partial<Todo>): TodoValidation => {
  const { error } = updateTodoSchema.validate(todo);
  if (error) {
    if (error.details) {
      const messages = error.details.map((item) => item.message);
      return {
        valid: false,
        error: toError(messages.join(', ')),
        todo: null,
      };
    }
  }
  return { valid: true, error: null, todo };
};

export const isValidAll = (todo: Todo): TodoValidation => {
  const { error } = todoSchema.validate(todo);
  if (error) {
    // if error is a ValidationErrorItem, join all messages together
    if (error.details) {
      const messages = error.details.map((item) => item.message);
      return {
        valid: false,
        error: toError(messages.join(', ')),
        todo: null,
      };
    }
  }
  return { valid: true, error: null, todo };
};
