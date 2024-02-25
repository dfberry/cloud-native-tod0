import { test, expect } from '@playwright/test';

const debug = process.env.DEBUG || true;

// create type for edit with initial or updated
type Edit = 'initial' | 'updated' | null;
type Action = 'add' | 'edit' | 'delete';

type TestData = {
  name: string;
  action: Action;
  edit: Edit;
  timeout: number;
  rowNumberInTable: number;
  incomingData: {
    title: string;
    description: string;
  } | null;
}

const testDataArray: TestData[] = [
  {
    name: 'first add',
    action: 'add' as Action,
    edit: 'initial' as Edit,
    timeout: 1000,
    rowNumberInTable: 1,
    incomingData: {
      title: 'Hello',
      description: 'This is an add test. ',
    }
  },
  {
    name: 'second add',
    action: 'add' as Action,
    edit: 'initial' as Edit,
    timeout: 1000,
    rowNumberInTable: 2,
    incomingData: {
      title: 'Item 2 ',
      description: 'This is the second add test. ',
    }
  },
  {
    name: 'third add',
    action: 'add' as Action,
    edit: 'initial' as Edit,
    timeout: 1000,
    rowNumberInTable: 3,
    incomingData: {
      title: 'Item 3 ',
      description: 'This is the third add test. ',
    }
  },
  {
    name: 'first edit',
    action: 'edit' as Action,
    edit: 'updated' as Edit,
    timeout: 1000,
    rowNumberInTable: 2,
    incomingData: {
      title: 'Item 2 Updated ',
      description: 'This is the second add test. Updated. ',
    }
  },
  {
    name: 'delete third rowNumberInTable',
    action: 'delete' as Action,
    edit: null,
    timeout: 1000,
    rowNumberInTable: 3,
    incomingData: null
  }
]

test.describe('todo add, update, delete', () => {

  async function printCurrentTable(page, testName) {
    if (debug) {
      const table = await page.$('table');
      const tableText = await table.innerText();
      console.log(`==${testName}===================================`);
      console.log(tableText);
    }
  }

  function getRowIdFromTestDataId(testDataId: string) {
    // given a string like `item-noun-<number>` where number is the last part of the string, return the number
    const splitTestDataId = testDataId.split('-');
    const rowId = splitTestDataId[splitTestDataId.length - 1];
    return rowId;
  }

  async function expectDeleteDoesntExist(page, rowId) {
    // delete rowNumberInTable with rowId
    const rowThatShouldNotExist = await page.$(`table > tbody > tr[data-testid^="item-${rowId}"]`);
    expect(rowThatShouldNotExist).toBeNull();
  }
  async function clickButtonOnRow(page, rowNumberInTable, action, timeout) {
    const buttonName = `item-${action}`;
    const rowButton = await page.$(`table > tbody > tr:nth-child(${rowNumberInTable.toString()}) > td > button[data-testid^=${buttonName}]`);
    rowButton.click();

    // wait 1 second
    await page.waitForTimeout(timeout);
  }
  async function getRow(page, rowNumber) {
    const rowNumberInTable = await page.$(`table > tbody > tr:nth-child(${rowNumber.toString()})`);
    return rowNumberInTable;
  }
  async function getRowGuid(rowNumberInTable) {
    const rowGuidName = await rowNumberInTable.getAttribute('data-testid');
    const rowGuid = getRowIdFromTestDataId(rowGuidName);
    return rowGuid;
  }

  async function performRowLevelAction(page, copyData) {

    // Get row in table
    const rowObject = await getRow(page, copyData.rowNumberInTable);

    // Get unique guid for row and all its children
    const rowGuid = await getRowGuid(rowObject);

    // Click button in table
    await clickButtonOnRow(page, copyData.rowNumberInTable, copyData.action, copyData.timeout);

    // Delete should remove row from table
    if (copyData.action === 'delete') {

      // wait 1 second
      await page.waitForTimeout(copyData.timeout);

      // make sure there is no row in table with the rowGuid of the deleted row
      expectDeleteDoesntExist(page, rowGuid);
      if (debug) {
        const table = await page.$('table');
        const tableText = await table.innerText();
        console.log(`==${copyData.name}===================================`);
        console.log(tableText);
      }

      return;
    }

  }
  async function validateCell(page, copyData, cellType) {
    const cell = await page.$(`table > tbody > tr:nth-child(${copyData.rowNumberInTable.toString()}) > td[data-testid^="item-${cellType}"]`);
    const cellInnerText = await cell.innerText();

    switch (cellType) {
      case 'title':
      case 'description':
        expect(cellInnerText).toBe(copyData.incomingData[cellType].trim());
        break;
      case 'createdAt':
        expect(cellInnerText).not.toBe('N/A');
        break;
      case 'updatedAt':
        if (copyData.edit === 'initial') {
          expect(cellInnerText).toBe('N/A');
        } else {
          expect(cellInnerText).not.toBe('N/A');
        }
        break;
    }
  }
  async function performFormAction(page, copyData) {

    // enter data
    await page.getByTestId('todo-form-input-title').click();
    await page.getByTestId('todo-form-input-title').fill(copyData.incomingData.title);
    await page.getByTestId('todo-form-input-description').click();
    await page.getByTestId('todo-form-input-description').fill(copyData.incomingData.description);

    // submit data
    const dataSubmissionButton = await page.getByTestId('todo-button');
    expect(dataSubmissionButton).toBeEnabled();
    await dataSubmissionButton.click();

    // wait 1 second
    await page.waitForTimeout(copyData.timeout);
  }

  async function clearDatabase() {
    const url = `http://localhost:3000/todos`
    const response = await fetch(url, { method: 'DELETE' });
    if (!response.ok) {
      console.log('Error clearing database: ', response.statusText);
    }
  }

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

    printCurrentTable(page, data.name);
  }


  test.beforeEach(async () => {
    await clearDatabase();
  });
  test.afterEach(async () => {
    await clearDatabase();
  });

  test('test', async ({ page }) => {

    // Listen for all console logs
    page.on('console', msg => console.log(msg.text()));

    // goto page
    await page.goto('http://localhost:3005/');

    // run tests
    for await (const testData of testDataArray) {
      await unitTest(page, testData);
    }

  });
});
