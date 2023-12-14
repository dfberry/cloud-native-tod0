
import { expect, test, vi } from 'vitest'
import { fireEvent, render } from '@testing-library/react'
import Item, { Todo } from './item'
import '@testing-library/jest-dom';

test('item component deletes item', () => {

  // create todo
  const todo:Todo = { id: 1, title: 'Test Todo' };

  // mock delete function
  const mockDelete = vi.fn();

  // render the component
  const { getByTestId, getByRole } = render(<Item todo={todo} onDelete={mockDelete} />)

  // test that the item is rendered
  expect(getByTestId('item-id').textContent).toBe(todo.id.toString());
  expect(getByTestId('item-title').textContent).toBe(todo.title);

  // get button by role
  const button = getByRole('button', { name: /X/i });
  expect(button).toBeDefined();

  // click button
  fireEvent.click(button);

  // test that mockDelete was called
  expect(mockDelete).toHaveBeenCalledTimes(1);
  expect(mockDelete).toHaveBeenLastCalledWith(todo.id);
})



