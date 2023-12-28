import { Todo } from '../models';
import Item from './item';

export type { Todo };

interface Props {
  todos: Todo[];
  onDelete: (id: number) => void;
}

export default function List({ todos, onDelete }: Props) {
  return (

    todos.length > 0 && (
      <table style={{ width: '100%', marginTop: '20px', borderCollapse: 'collapse' }} data-testid="list">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {todos.map((todo) => (
            <Item
              key={todo.id}
              todo={todo}
              onDelete={onDelete}
            />
          ))}
        </tbody>
      </table>
    )
  )
}