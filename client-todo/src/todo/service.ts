import { NewTodo } from './models';

export const API_URL = `${import.meta.env.VITE_API_URL}/todo`;

export const addTodo = async (newTodo: NewTodo): Promise<Response> => {
    return await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTodo),
      });
    };
export const deleteTodo = async (id: number): Promise<Response> => {
    return await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });
    };