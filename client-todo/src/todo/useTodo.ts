import useSWR from 'swr';
import { ENV_URL } from '../config';
import { NewTodo, Todo } from './models';
export const API_BASE_URL = ENV_URL;

export const API_GET_ALL_TODOS = `${API_BASE_URL}/todos`;
export const API_ADD_TODO = `${API_BASE_URL}/todo`;
export const API_DELETE_TODO = `${API_BASE_URL}/todo`;

export const useTodos = () => {

    const fetcher = async (...args: [input: RequestInfo, init?: RequestInit]) => {
        const response = await fetch(...args)
        const { data, error } = await response.json();

        console.log('fetcher', data, error);

        if (error) {
            throw new Error(error.message);
        }
        return data;
    }
    const { data, error, mutate, isLoading, isValidating } = useSWR(API_GET_ALL_TODOS, fetcher)


    const addTodo = async (newTodo: NewTodo): Promise<void> => {
        if (!newTodo) {
            console.log('addTodo', 'newTodo is undefined');
        }
        const result = await fetch(API_ADD_TODO, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ todo: newTodo }),
        });
        if (!result.ok) {
            throw new Error(`result: ${result.status} ${result.statusText}`);
        }


        const { data: returnedTodo } = await result.json();
        console.log('addTodo', returnedTodo);
        mutate([...data, returnedTodo]);
        return returnedTodo;
    };


    const updateTodo = async (updatedTodo: Todo) => {
        if (!data) {
            console.log('updateTodo', 'id is undefined');
            return false;
        }
        const response = await fetcher(API_ADD_TODO, { body: JSON.stringify({ todo: updatedTodo }) });
        if (!response.ok) {
            throw new Error('An error occurred while adding the todo.');
        }
        const returnedUpdatedTodo = await response.json()
        console.log('updateTodo', returnedUpdatedTodo);
        mutate(
            data.map(
                (thisTodo: Todo) => (thisTodo.id === updatedTodo.id ? updatedTodo : thisTodo),
                false
            )
        );
        return returnedUpdatedTodo;
    };

    const removeTodo = async (id: number) => {
        if (!id) {
            console.log('removeTodo', 'id is undefined');
            return false;
        }
        const result = await fetch(`${API_DELETE_TODO}/${id}`, {
            method: 'DELETE',
        });
        if (!result.ok) {
            throw new Error(`result: ${result.status} ${result.statusText}`);
        }
        const returnedDeletedTodo = await result.json();
        console.log('removeTodo', returnedDeletedTodo);
        mutate(data.filter((item: Todo) => item.id === id, false));
        return returnedDeletedTodo;
    };

    return { data, error, addTodo, isLoading, updateTodo, removeTodo, isValidating };
};