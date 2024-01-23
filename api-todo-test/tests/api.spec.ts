import { test, expect } from '@playwright/test';
import 'dotenv/config'

const baseURL = process.env.API_TODO_ENDPOINT || 'http://localhost:3000';
console.log('baseURL', baseURL);

test.use({
    baseURL: baseURL
});

test(`should get all todos from ${baseURL}/todos`, async ({ request }) => {
    const response = await request.get('/todos');
    expect(response.status()).toBe(200);

    const todos = await response.json();
    console.log('todos', todos);
    expect(todos.length).toBe(3);
});