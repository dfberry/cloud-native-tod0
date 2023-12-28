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
            <div>
                <h1 >What do you have to do?</h1>
            </div>
            <form ref={formRef} onSubmit={handleSubmit} data-testid="todo-form">
                <div>
                    <input
                        id="todoTitle"
                        name="title"
                        type="text"
                        value={newTodo.title}
                        placeholder="Title"
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        data-testid="todo-form-input-title"
                    />
                </div>
                {requestError && (
                    <div data-testid="todo-error">
                        {requestError}
                    </div>
                )}
                <button type="submit" disabled={!newTodo.title} data-testid="todo-button">Add Todo</button>
            </form>
        </div>
    );
} 
