import { vi } from 'vitest'
import { render } from '../../../test/utilities'
import TodoForm from './form'
import '@testing-library/jest-dom';
test('renders form without error', async () => {

    // mock add function
    const mockAdd = vi.fn();

    // render the component
    const { queryByTestId } = render(<TodoForm onSubmit={mockAdd} />);

    // Check form doens't render error div
    const errorDiv = queryByTestId('todo-error');

    // Check request error is rendered
    expect(errorDiv).not.toBeUndefined();
})

test('renders form with error', async () => {

    // set incoming request error
    const requestError = 'test error';

    // mock add function
    const mockAdd = vi.fn();

    // render the component
    const { getByTestId } = render(<TodoForm onSubmit={mockAdd} requestError={requestError} />);

    // Check request error is rendered
    expect(getByTestId('todo-error').textContent).toBe(requestError);
})

test('renders button disabled', async () => {

    // mock add function
    const mockAdd = vi.fn();

    // render the component
    const { getByTestId } = render(<TodoForm onSubmit={mockAdd}/>);

    const buttonEmpty = getByTestId('todo-button');
    expect(buttonEmpty).toBeDefined();
    expect(buttonEmpty).toBeDisabled();
})  
test('renders button enabled', async () => {

    // render the component
    const { user, getByTestId } = render(<TodoForm onSubmit={vi.fn()}/>);

    // get the button and input
    const button = getByTestId('todo-button');
    const input = getByTestId('todo-form-input-title');

    // type in the input
    await user.type(input, 'hello world');
    
    // check button is enabled
    expect(button).toBeEnabled();

})

test('accepts input text', async () => {

    // new title
    const title = 'Test Todo';

    // mock add function
    const mockAdd = vi.fn();

    // render the component
    const { user, getByTestId } = render(<TodoForm onSubmit={mockAdd}/>);

    // Fill in the input
    const input = getByTestId('todo-form-input-title');
    await user.type(input, title);

    // Check that the input is filled in
    const inputFilledIn = getByTestId('todo-form-input-title');
    expect(inputFilledIn).toHaveValue(title);
}) 


test('submit form by button', async () => {

    // new title
    const title = 'Test Todo';

    // mock add function
    const mockAdd = vi.fn();

    // render the component
    const { user, getByTestId } = render(<TodoForm onSubmit={mockAdd}/>);

    // Fill in the input
    const input = getByTestId('todo-form-input-title');
    await user.type(input, title);

    // submit form by button click
    const button = getByTestId('todo-button');
    await user.click(button);

    // todo submitted to parent via onSubmit
    expect(mockAdd).toHaveBeenCalledTimes(1);
    expect(mockAdd).toHaveBeenCalledWith({ title });
}) 

test('submit form by keypress enter', async () => {

    // new title
    const title = 'Test Todo';

    // mock add function
    const mockAdd = vi.fn();

    // render the component
    const { user, getByTestId } = render(<TodoForm onSubmit={mockAdd}/>);

    // Fill in the input
    const input = getByTestId('todo-form-input-title');
    await user.type(input, title);

    // submit form by keypress
    await user.type(input, '{enter}');

    // todo submitted to parent via onSubmit
    expect(mockAdd).toHaveBeenCalledTimes(1);
    expect(mockAdd).toHaveBeenCalledWith({ title });
}) 
