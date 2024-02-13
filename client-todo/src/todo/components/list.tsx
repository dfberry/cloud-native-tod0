import { Todo } from '../models';
import Item from './item';

export type { Todo };

interface Props {
  todos: Todo[];
  onDelete: (id: number) => void;
  setCurrentTodo: (todo: Todo) => void;
}

export default function List({ todos, onDelete, setCurrentTodo }: Props) {
  return (

    todos.length > 0 && (
      <table style={{ width: '100%', marginTop: '20px', borderCollapse: 'collapse' }} data-testid="list">
        <thead>
          <tr>
            <th style={{ display: 'none' }}>Id</th>
            <th>Title</th>
            <th>Description</th>
            <th>Created At</th>
            <th>Updated At</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {todos.map((todo) => (
            <Item
              key={todo.id}
              todo={todo}
              onDelete={onDelete}
              setCurrentTodo={setCurrentTodo}
            />
          ))}
        </tbody>
      </table>
    )
  )
}