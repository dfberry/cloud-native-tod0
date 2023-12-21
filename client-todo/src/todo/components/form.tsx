import { FormEvent, KeyboardEvent, ChangeEvent, useRef, useState } from 'react';
import { NewTodo } from '../models';

export type { NewTodo };

interface Props {
    onSubmit: (newTodoItem: NewTodo) => void;
    requestError?: string;
}
export default function TodoForm({ onSubmit, requestError }: Props) {
    const formRef = useRef<HTMLFormElement>(null);
    const [newTodo, setNewTodo] = useState<NewTodo>({ title: '' });

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const title = formData.get('title')?.toString() || null;

        if (title !== null) {

            onSubmit({
                title
            });
            if (formRef.current) {
                formRef.current.reset();
            }
            // Reset the newTodo state
            setNewTodo({ title: '' });
        }
    }

    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            if (formRef.current) {
                formRef.current.dispatchEvent(new Event('submit', { cancelable: true }));
            }
        }
    };
    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        setNewTodo({
            title: event.target.value,
        });
    };
    return (
        <div >
            <div className="pb-5">
                <h1 className="text-center text-gray-700" >What do you have to do?</h1>
            </div>
            <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col items-start" data-testid="todo-form">
                <div className="w-full">
                    <input
                        id="todoTitle"
                        name="title"
                        type="text"
                        value={newTodo.title}
                        placeholder="Title"
                        className="p-2 w-full bg-black text-white box-border"
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        data-testid="todo-form-input-title"
                    />
                </div>
                {requestError && (
                    <div className="mt-2 text-red-500" data-testid="todo-error">
                        {requestError}
                    </div>
                )}
                <button type="submit" disabled={!newTodo.title} className="mt-2 px-2 py-1 bg-blue-500 text-white border-none rounded cursor-pointer text-xs" data-testid="todo-button">Add Todo</button>
            </form>
        </div>
    );
} 
