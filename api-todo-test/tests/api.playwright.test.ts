import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';
dotenv.config();

const API_URL = process.env.API_TODO_URL || 'http://localhost:3000';
console.log('API_URL', API_URL);

import { version } from '../../api-todo/package.json';

test.use({
  ignoreHTTPSErrors: true, // in case your certificate isn't properly signed
  baseURL: API_URL,
  extraHTTPHeaders: {
    'Accept': 'application/vnd.github.v3+json',
    // Add authorization token to all requests.
    'Authorization': `token ${process.env.API_TOKEN}`,
  }
});
test('should get all todos', async ({ request }) => {
  const response = await request.get(`/todo`);
  expect(response.ok()).toBeTruthy();

  // Validate the x-api-version header
  const headers = response.headers();
  expect(headers).toHaveProperty('x-api-version');
  expect(headers['x-api-version']).toEqual(version);


  // Validate the response body
  const todos = await response.json();
  expect(Array.isArray(todos)).toBeTruthy();
  expect(todos.length).toEqual(3);
});