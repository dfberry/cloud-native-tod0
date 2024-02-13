import useSWR from 'swr';
import { ENV_URL } from '../config';
import { NewTodo, Todo } from './models';
export const API_BASE_URL = ENV_URL;

export const API_GET_ALL_TODOS = `${API_BASE_URL}/todos`;
export const API_ADD_TODO = `${API_BASE_URL}/todo`;
export const API_UPDATE_TODO = `${API_BASE_URL}/todo`;
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
    const getAllTodosOptions = {
        //revalidateOnFocus: false, // stop page flicker 
        //revalidateOnReconnect: false,
        //revalidateOnMount: false,
    };
    const { data, error, mutate, isLoading, isValidating } = useSWR(API_GET_ALL_TODOS, fetcher,getAllTodosOptions)


    const addTodo = async (newTodo: NewTodo) => {
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
        const returnedAddedTodo = await result.json()
        if (!result.ok) {
            return returnedAddedTodo;
        }
        mutate([...data, returnedAddedTodo?.data]);
        return returnedAddedTodo;
    };


    const updateTodo = async (updatedTodo: Todo) => {
        if (!updatedTodo.id) {
            return false;
        }
        const options = { 
            method: "PUT", 
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify({ todo: updatedTodo }) };
        const response = await fetch(`${API_UPDATE_TODO}/${updatedTodo.id}`, options);
        const returnedUpdatedTodo = await response.json()
        if (!returnedUpdatedTodo.ok) {
            return returnedUpdatedTodo;
        }     
        mutate(
            data.map(
                (thisTodo: Todo) => (thisTodo.id === returnedUpdatedTodo.data?.id ? returnedUpdatedTodo.data : thisTodo),
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
}