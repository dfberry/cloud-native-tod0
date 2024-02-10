import TodoForm from './components/form';
import List from './components/list';
import { useTodos } from './useTodo';

export default function Todo() {

    const { data, error, isLoading, isValidating, addTodo, removeTodo } = useTodos();

    if (error) return <div >failed to load {JSON.stringify(error)}</div>
    if (!error && isLoading) return <div >loading...{JSON.stringify(isLoading)}</div>
    if (!error && isValidating) return <div >isValidating...{JSON.stringify(isValidating)}</div>

    return (
        <div >
            <TodoForm onSubmit={addTodo} requestError={error} />
            <div >
                { data!==undefined 
                    && data.length>0 
                    && <List todos={data} onDelete={removeTodo} />
                }
            </div>
        </div>
    )
}
