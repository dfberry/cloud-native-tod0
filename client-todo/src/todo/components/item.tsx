import { Todo } from '../models';

export type { Todo };

export interface ItemProps {
  todo: Todo;
  onDelete: (id: number) => void;
}

export default function Item({ todo, onDelete }: ItemProps) {

  return (
    <tr data-testid="item-row">
      <td data-testid="item-id">{todo.id}</td>
      <td data-testid="item-title">{todo.title}</td>
      <td data-testid="item-delete">
        <button onClick={() => onDelete(todo.id)} >X</button>
      </td>
    </tr>
  );
}