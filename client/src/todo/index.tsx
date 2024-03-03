import TodoForm from './components/form';
import { useState } from 'react';
import List from './components/list';
import { Todo } from './models';
import { useTodos } from './useTodo';

export default function Todo() {
    const [currentTodo, setCurrentTodo] = useState<Todo | undefined>(undefined);
    const { data, error, isLoading, isValidating, addTodo, updateTodo, removeTodo } = useTodos();

    if (error) return <div >failed to load {JSON.stringify(error)}</div>
    if (!error && isLoading) return <div >loading...{JSON.stringify(isLoading)}</div>
    if (!error && isValidating) return <div >isValidating...{JSON.stringify(isValidating)}</div>

    const setThisTodo = (todo: Todo) => {
        console.log('index setCurrentTodo', todo)
        setCurrentTodo(todo);
    }


    return (
        <div >
            <TodoForm newSubmit={addTodo} setCurrentTodo={setCurrentTodo} updateSubmit={updateTodo} todoToEdit={currentTodo} requestError={error} />
            <div >
                { data!==undefined 
                    && data.length>0 
                    && <List todos={data} onDelete={removeTodo} setCurrentTodo={setThisTodo} />
                }
            </div>
        </div>
    )
}
