import { vi } from 'vitest'
import { render } from '../../../test/utilities'
import TodoForm from './form'
import '@testing-library/jest-dom';
test('renders form without error', async () => {

    // mock add function
    const mockAdd = vi.fn();
    const mockUpdate = vi.fn();
    const mockSetCurrentTodo = vi.fn();
    const todoToEdit = undefined;
    const requestError = undefined;

    // render the component
    const { queryByTestId } = render(<TodoForm newSubmit={mockAdd} updateSubmit={mockUpdate} setCurrentTodo={mockSetCurrentTodo} todoToEdit={todoToEdit} requestError={requestError}/>);

    // Check form doens't render error div
    const errorDiv = queryByTestId('todo-error');

    // Check request error is rendered
    expect(errorDiv).not.toBeUndefined();
})

test('renders form with error', async () => {

    // set incoming request error
    const mockAdd = vi.fn();
    const mockUpdate = vi.fn();
    const mockSetCurrentTodo = vi.fn();
    const todoToEdit = undefined;
    const requestError = "test error";

    // render the component
    const { queryByTestId } = render(<TodoForm newSubmit={mockAdd} updateSubmit={mockUpdate} setCurrentTodo={mockSetCurrentTodo} todoToEdit={todoToEdit} requestError={requestError}/>);

    // Check form doens't render error div
    const errorDiv = queryByTestId('todo-error');

    // Check request error is rendered
    expect(errorDiv?.textContent).toBe(requestError);
})

test('renders button disabled', async () => {

    // mock add function
    const mockAdd = vi.fn();
    const mockUpdate = vi.fn();
    const mockSetCurrentTodo = vi.fn();
    const todoToEdit = undefined;
    const requestError = undefined;

    // render the component
    const { queryByTestId } = render(<TodoForm newSubmit={mockAdd} updateSubmit={mockUpdate} setCurrentTodo={mockSetCurrentTodo} todoToEdit={todoToEdit} requestError={requestError}/>);

    const buttonEmpty = queryByTestId('todo-button');
    expect(buttonEmpty).toBeDefined();
    expect(buttonEmpty).toBeDisabled();
})  
test('renders button enabled when in edit mode', async () => {

    const mockAdd = vi.fn();
    const mockUpdate = vi.fn();
    const mockSetCurrentTodo = vi.fn();
    const todoToEdit = { id: 1, title: 'test', description: 'test', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()};
    const requestError = undefined;

    // render the component
    const { user, getByTestId } = render(<TodoForm newSubmit={mockAdd} updateSubmit={mockUpdate} setCurrentTodo={mockSetCurrentTodo} todoToEdit={todoToEdit} requestError={requestError}/>);

    // get the button and input
    const button = getByTestId('todo-button');
    const input = getByTestId('todo-form-input-title');

    // type in the input
    await user.type(input, 'hello world');
    
    // check button is enabled
    expect(button).toBeEnabled();

})

test('accepts input text for new todo', async () => {

    // new title
    const title = 'Test Todo';

    // mock add function
    const mockAdd = vi.fn();
    const mockUpdate = vi.fn();
    const mockSetCurrentTodo = vi.fn();
    const todoToEdit = undefined;
    const requestError = undefined;


    // render the component
    const { user, getByTestId } = render(<TodoForm newSubmit={mockAdd} updateSubmit={mockUpdate} setCurrentTodo={mockSetCurrentTodo} todoToEdit={todoToEdit} requestError={requestError}/>);

    // Fill in the input
    const input = getByTestId('todo-form-input-title');
    await user.type(input, title);

    // Check that the input is filled in
    const inputFilledIn = getByTestId('todo-form-input-title');
    expect(inputFilledIn).toHaveValue(title);
}) 


test('submit form by button for new todo', async () => {

    // new title
    const title = 'Test Todo';

    // mock add function
    const mockAdd = vi.fn();
    const mockUpdate = vi.fn();
    const mockSetCurrentTodo = vi.fn();
    const todoToEdit = undefined;
    const requestError = undefined;

    // render the component
    const { user, getByTestId } = render(<TodoForm newSubmit={mockAdd} updateSubmit={mockUpdate} setCurrentTodo={mockSetCurrentTodo} todoToEdit={todoToEdit} requestError={requestError}/>);

    // Fill in the input
    const input = getByTestId('todo-form-input-title');
    await user.type(input, title);

    // submit form by button click
    const button = getByTestId('todo-button');
    await user.click(button);

    // todo submitted to parent via onSubmit
    expect(mockAdd).toHaveBeenCalledTimes(1);
    expect(mockAdd).toHaveBeenCalledWith({ title, description: ''});
}) 

test('submit form by keypress enter for new todo', async () => {

    // new title
    const title = 'Test Todo';

    // mock add function
    const mockAdd = vi.fn();
    const mockUpdate = vi.fn();
    const mockSetCurrentTodo = vi.fn();
    const todoToEdit = undefined;
    const requestError = undefined;

    // render the component
    const { user, getByTestId } = render(<TodoForm newSubmit={mockAdd} updateSubmit={mockUpdate} setCurrentTodo={mockSetCurrentTodo} todoToEdit={todoToEdit} requestError={requestError}/>);

    // Fill in the input
    const input = getByTestId('todo-form-input-title');
    await user.type(input, title);

    // submit form by keypress
    await user.type(input, '{enter}');

    // todo submitted to parent via onSubmit
    expect(mockAdd).toHaveBeenCalledTimes(1);
    expect(mockAdd).toHaveBeenCalledWith({ title, description: '' });
}) 
