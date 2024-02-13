import { Todo } from '../models';

export type { Todo };

export interface ItemProps {
  todo: Todo;
  onDelete: (id: number) => void;
  setCurrentTodo: (todo: Todo) => void;
}

export default function Item({ todo, onDelete, setCurrentTodo }: ItemProps) {

  function formatDate(date: string | null | undefined): string {
    if (date && (typeof date === 'string' || typeof date === 'number')) {
      return new Date(date).toLocaleDateString();
    } else {
      return 'N/A';
    }
  }

  return (
    <tr data-testid="item-row" >
      <td data-testid="item-id" style={{ display: 'none' }}>{todo.id}</td>
      <td data-testid="item-title">{todo.title}</td>
      <td data-testid="item-description">{todo.description}</td>
      <td data-testid="item-createdAt">{formatDate(todo.createdAt)}</td>
      <td data-testid="item-updatedAt">{formatDate(todo.updatedAt)}</td>
      <td data-testid="item-delete">
        <button onClick={() => {
          console.log('setCurrentTodo', todo)
          setCurrentTodo(todo);
        }} >&#9998;</button>
      </td>
      <td data-testid="item-delete">
        <button onClick={() => onDelete(todo.id)} >X</button>
      </td>
    </tr>
  );
}