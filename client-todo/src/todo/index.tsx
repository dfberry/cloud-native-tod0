import { useState } from 'react';
import useSWR, { mutate } from 'swr';
import TodoForm from './components/form';
import List from './components/list';
import { NewTodo, Todo } from './models';
import { API_URL, addTodo, deleteTodo } from './service';
import { fetcher } from './api';

export default function Todo() {
    const [requestError, setRequestError] = useState('');
    const { data, error, isLoading } = useSWR(API_URL, fetcher)

    async function handleSubmit(newTodoItem: NewTodo) {
        setRequestError('');

        try {
            const result = await addTodo(newTodoItem);

            if (!result.ok) throw new Error(`result: ${result.status} ${result.statusText}`);
            const savedTodo = await result.json();
            mutate(API_URL, [...data, savedTodo], false);

        } catch (error: unknown) {
            setRequestError(String(error));
        }
    }

    async function handleDelete(id: number) {
        setRequestError('');
        try {
            const result = await deleteTodo(id);
            if (!result.ok) throw new Error(`result: ${result.status} ${result.statusText}`);
            mutate(API_URL, data.filter((todo: Todo) => todo.id !== id), false);
        } catch (error: unknown) {
            setRequestError(String(error));
        }
    }

    if (error && requestError) return <div className="border-red-500 p-2">failed to load {error ? JSON.stringify(error) : requestError}</div>
    if (isLoading) return <div className="border-gray-500 p-2">loading...{JSON.stringify(isLoading)}</div>

    return (
        <div className="p-10 font-sans">
            <TodoForm onSubmit={handleSubmit} requestError={requestError} />
            <div className="border-gray-500 mt-5 rounded">
                <List todos={data} onDelete={handleDelete} />
            </div>
        </div>
    )
}
