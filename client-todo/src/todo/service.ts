import { NewTodo } from './models';
import { ENV_URL } from '../config';

export const API_BASE_URL = ENV_URL;

export const API_GET_ALL_TODOS = `${API_BASE_URL}/todos`;
export const API_ADD_TODO = `${API_BASE_URL}/todo`;
export const API_DELETE_TODO = `${API_BASE_URL}/todo`;

export const listTodos = async (): Promise<Response> => {
  return await fetch(API_GET_ALL_TODOS);

}
export const addTodo = async (newTodo: NewTodo): Promise<Response> => {
  return await fetch(API_ADD_TODO, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({todo: newTodo}),
  });
};
export const deleteTodo = async (id: number): Promise<Response> => {
  return await fetch(`${API_DELETE_TODO}${id}`, {
    method: 'DELETE',
  });
};
export const isServerAvailable = async (): Promise<boolean> => {
  try {
    const response = await fetch(ENV_URL);
    return response.ok; // Returns true if the status is 2xx, false otherwise.
  } catch (error) {
    console.error('Error checking server availability:', error);
    return false;
  }
};