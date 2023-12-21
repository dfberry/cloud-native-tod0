import { Todo } from '../models';

export type { Todo };

export interface ItemProps {
  todo: Todo;
  onDelete: (id: number) => void;
}

export default function Item({ todo, onDelete }: ItemProps) {

  return (
    <tr className="border-b border-gray-300" data-testid="item-row">
      <td className="px-2 font-bold" data-testid="item-id">{todo.id}</td>
      <td className="px-2" data-testid="item-title">{todo.title}</td>
      <td className="px-2" data-testid="item-delete">
        <button onClick={() => onDelete(todo.id)} className="px-2 py-1 bg-blue-500 text-white border-none rounded cursor-pointer text-xs">X</button>
      </td>
    </tr>
  );
}