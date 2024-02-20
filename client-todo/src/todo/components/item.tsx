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
    <tr data-testid={`item-row-${todo.id}`} >
      <td data-testid={`item-id-${todo.id}`} style={{ display: 'none' }}>{todo.id}</td>
      <td data-testid={`item-title-${todo.id}`}>{todo.title}</td>
      <td data-testid={`item-description-${todo.id}`}>{todo.description}</td>
      <td data-testid={`item-createdAt-${todo.id}`}>{formatDate(todo.createdAt)}</td>
      <td data-testid={`item-updatedAt-${todo.id}`}>{formatDate(todo.updatedAt)}</td>
      <td data-testid={`item-edit-${todo.id}`}>
        <button data-testid={`item-edit-${todo.id}`} onClick={() => {
          console.log('setCurrentTodo', todo)
          setCurrentTodo(todo);
        }} >&#9998;</button>
      </td>
      <td data-testid={`item-delete-${todo.id}`}>
        <button onClick={() => onDelete(todo.id)} >X</button>
      </td>
    </tr>
  );
}