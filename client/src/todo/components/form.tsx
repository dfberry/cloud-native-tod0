import { useState, useEffect } from 'react';
import { NewTodo, Todo } from '../models';
import { UI_RULES } from '../../config';
export type { NewTodo };

interface Props {
    newSubmit: (newTodoItem: NewTodo) => Promise<RequestResult>;
    updateSubmit: (todoItem: Todo) => Promise<RequestResult>;
    todoToEdit?: Todo | undefined;
    setCurrentTodo: (todo: Todo | undefined) => void;
    requestError?: string;
}
interface RequestResult {
    error: string | null;
    data: Todo | null;
}

export default function TodoForm({ newSubmit, updateSubmit, todoToEdit, setCurrentTodo, requestError }: Props) {
    const [formTodo, setFormTodo] = useState<Todo | NewTodo>(todoToEdit || { id: 0, title: '', description: '' });
    const isEditing = !!todoToEdit;

    useEffect(() => {
        const isEditing = !!todoToEdit;
        if (isEditing) {
            setFormTodo(todoToEdit);
        } else {
            setFormTodo({ id: 0, title: '', description: '' });
        }
    }, [todoToEdit]);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const isEditing = !!todoToEdit;


        if (isEditing) {
            const response = await updateSubmit(formTodo as Todo);

            if (!response?.error) {
                setCurrentTodo(undefined);
            }

        } else {
            const response = await newSubmit({
                title: formTodo.title,
                description: formTodo.description,
            } as NewTodo
            );
            if (!response?.error) {
                setCurrentTodo(undefined);
            }
        }
        setFormTodo({ title: '', description: '' });
    }
    return (
        <div className="todoFormContainer">
            <div>
                <h1 >What exciting tasks are on your agenda today?</h1>
            </div>
            <form onSubmit={handleSubmit} data-testid="todo-form" className="todoForm">
                <div className="todoFormInputElements">
                    <input
                        id="todoTitle"
                        className="todoFormInputTitle"
                        name="title"
                        type="text"
                        maxLength={UI_RULES.MAX_TODO_TITLE_LENGTH}
                        value={formTodo.title}
                        placeholder="Title"
                        onChange={(e) => setFormTodo({ ...formTodo, title: e.target.value })}
                        data-testid="todo-form-input-title"
                    />
                    <textarea
                        id="todoDescription"
                        className="todoFormInputDescription"
                        name="description"
                        maxLength={UI_RULES.MAX_TODO_DESCRIPTION_LENGTH}
                        value={formTodo.description || ''}
                        placeholder="Description"
                        onChange={(e) => setFormTodo({ ...formTodo, description: e.target.value })}
                        data-testid="todo-form-input-description"
                    />
                </div>
                {requestError && (
                    <div data-testid="todo-error">
                        {requestError}
                    </div>
                )}
                <button type="submit" disabled={!formTodo.title} data-testid="todo-button">
                    {(isEditing) ? 'Update Todo' : 'Add Todo'}
                </button>
            </form>
        </div>
    );
} 
