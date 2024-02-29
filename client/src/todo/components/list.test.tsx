
import { expect, test } from 'vitest'
import { render } from '@testing-library/react'
import List, { Todo } from './list'
import '@testing-library/jest-dom';

test('renders List with todos', () => {
    // Mock todos data
    const todos = [
      { id: 1, title: 'Todo 1' },
      { id: 2, title: 'Todo 2' },
    ];
  
    // Render the List component with the mock todos data
    const { getAllByTestId } = render(<List todos={todos} onDelete={() => {}} setCurrentTodo={() => {}}/>);
  
    // Get all elements with the 'item-row' test id
    const items = getAllByTestId(/item-row.*/);
  
    // Check if the number of rendered items matches the number of todos
    expect(items).toHaveLength(todos.length);
  
    // Check if each item has the correct text content
    todos.forEach((todo, index) => {
      expect(items[index]).toHaveTextContent(todo.title);
    });
  });
  
  test('does not render List when todos is empty', () => {
    // Mock empty todos data
    const todos:Todo[] = [];
  
    // Render the List component with the empty todos data
    const { queryByTestId } = render(<List todos={todos} onDelete={() => {}} setCurrentTodo={() => {}}/>);
  
    // Try to get an element with the 'list' test id
    const list = queryByTestId('list');
  
    // Check if the list element is not in the document
    expect(list).not.toBeInTheDocument();
  });