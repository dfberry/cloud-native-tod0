import { test, expect } from '@playwright/test';
import { TestData } from './models/test';
import { validateCell } from './expect/validate';
import { performFormAction, performRowLevelAction } from './UI/events';
import { printCurrentTable } from './util/printTable';
import { clearDatabase } from './util/database';

import TESTS from './DATA/data.json';


const debug = process.env.DEBUG || true;
const clearDatabaseUrl = process.env.DATABASE_URL_TRUNCATE || 'http://localhost:3005/clear-database' as string;

test.describe('todo add, update, delete', () => {

  async function unitTest(page, data: TestData) {
    if (data.action === 'edit' || data.action === 'delete') {
      await performRowLevelAction(page, { ...data });
      if (data.action === 'delete') {
        return;
      }
    }

    await page.waitForTimeout(data.timeout);
    await performFormAction(page, { ...data });

    await validateCell(page, { ...data }, 'title');
    await validateCell(page, { ...data }, 'description');
    await validateCell(page, { ...data }, 'createdAt');
    await validateCell(page, { ...data }, 'updatedAt');

    printCurrentTable(debug, page, data.name);
  }


  test.beforeEach(async () => {
    await clearDatabase(clearDatabaseUrl);
  });
  test.afterEach(async () => {
    await clearDatabase(clearDatabaseUrl);
  });

  test('test', async ({ page }) => {

    // Listen for all console logs
    page.on('console', msg => console.log(msg.text()));

    // goto page
    await page.goto('http://localhost:3005/');

    // run tests
    for await (const test of TESTS) {
      await unitTest(page, test as TestData);
    }

  });
});
