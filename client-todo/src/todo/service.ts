import { NewTodo } from './models';

const ENV_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
if (!ENV_URL) {
  console.log('VITE_API_URL is not defined');
}

export const API_BASE_URL = ENV_URL;
export const API_URL = `${ENV_URL}/todo`;

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
export const isServerAvailable = async (): Promise<boolean> => {
  try {
    console.log('Checking server availability...' + ENV_URL)
    const response = await fetch(ENV_URL);
    console.log('Server response:', response);
    return response.ok; // Returns true if the status is 2xx, false otherwise.
  } catch (error) {
    console.error('Error checking server availability:', error);
    return false;
  }
};