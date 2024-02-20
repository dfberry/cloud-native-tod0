import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  
// Listen for all console logs
page.on('console', msg => console.log(msg.text()));

    const firstItem = {
        title: 'Hello',
        description: 'This is an add test. ',
    }

  await page.goto('http://localhost:3005/');
  await page.getByTestId('todo-form-input-title').click();
  await page.getByTestId('todo-form-input-title').fill(firstItem.title);
  await page.getByTestId('todo-form-input-description').click();
  await page.getByTestId('todo-form-input-description').fill(firstItem.description);
  await page.getByTestId('todo-button').click();

  //const cells = await page.$$('table > tbody > tr:first-child > td');
  const titleCell = await page.$('table > tbody > tr:first-child > td[data-testid^="item-title"]');
  const descriptionCell = await page.$('table > tbody > tr:first-child > td[data-testid^="item-description"]');
  if(titleCell){
    const titleText = await titleCell.innerText();
    expect(titleText).toBe(firstItem.title);
  } 
  if(descriptionCell){
    const descriptionText = await descriptionCell.innerText();
    expect(descriptionText).toBe(firstItem.description);
  } 
  //const descriptionText = await descriptionCell.innerText();
  
  
  //expect(descriptionText).toBe(firstItem.description);

  // const specificCell = cells.find(async (cell) => {
  //   const testId = await cell.getAttribute('data-testid');
  //   console.log(`testId: "${testId}"`);
  //   const cellFound =  (testId) ? testId.startsWith('item-title-') : undefined;
  //   console.log(`cell: "${cellFound}"`);
  // });
  // if(specificCell) {
  //   const cellValue = await specificCell.innerText();
  //   expect(cellValue).toBe(firstItem.title);
  // } else {
  //   expect(1).toBe(0);
  // }




//   await page.getByTestId('todo-form-input-title').click();
//   await page.getByTestId('todo-form-input-title').fill('Hello 2');
//   await page.getByTestId('todo-form-input-title').press('Tab');
//   await page.getByTestId('todo-form-input-description').fill('This is a second add test. ');
//   await page.getByTestId('todo-button').click();
//   await page.getByTestId('todo-form-input-title').click();
//   await page.getByTestId('todo-form-input-title').fill('Hello 3');
//   await page.getByTestId('todo-form-input-title').press('Tab');
//   await page.getByTestId('todo-form-input-description').fill('This is a third add test.');
//   await page.getByTestId('todo-button').click();
//   await page.getByRole('button', { name: '✎' }).nth(1).click();
//   await page.getByTestId('todo-form-input-title').click();
//   await page.getByTestId('todo-form-input-title').fill('Hello 2 edited');
//   await page.getByTestId('todo-form-input-description').click();
//   await page.getByTestId('todo-form-input-description').fill('This is a second add test. This item has been edited 1 time. ');
//   await page.getByTestId('todo-button').click();
//   await page.getByRole('button', { name: '✎' }).nth(1).click();
//   await page.getByTestId('todo-form-input-title').click();
//   await page.locator('html').click();
//   await page.locator('html').click();
//   await page.getByTestId('todo-form-input-title').click();
//   await page.getByTestId('todo-form-input-title').fill('Hello');
//   await page.getByTestId('todo-form-input-description').click();
//   await page.getByTestId('todo-form-input-description').fill('This is an add test. ');
//   await page.getByTestId('todo-button').click();
//   await page.getByTestId('todo-form-input-title').click();
//   await page.getByTestId('todo-form-input-title').fill('Hello 2');
//   await page.getByTestId('todo-form-input-title').press('Tab');
//   await page.getByTestId('todo-form-input-description').fill('This is a second add test. ');
//   await page.getByTestId('todo-button').click();
//   await page.getByTestId('todo-form-input-title').click();
//   await page.getByTestId('todo-form-input-title').fill('Hello 3');
//   await page.getByTestId('todo-form-input-title').press('Tab');
//   await page.getByTestId('todo-form-input-description').fill('This is a third add test.');
//   await page.getByTestId('todo-button').click();
//   await page.getByRole('button', { name: '✎' }).nth(1).click();
//   await page.getByTestId('todo-form-input-title').click();
//   await page.getByTestId('todo-form-input-title').fill('Hello 2 edited');
//   await page.getByTestId('todo-form-input-description').click();
//   await page.getByTestId('todo-form-input-description').fill('This is a second add test. This item has been edited 1 time. ');
//   await page.getByTestId('todo-button').click();
//   await page.getByRole('button', { name: '✎' }).nth(1).click();
//   await page.getByTestId('todo-form-input-title').click();
//   await page.locator('html').click();
//   await page.locator('html').click();
//   await page.getByRole('cell', { name: 'This is a second add test.' }).click();
//   await page.getByRole('button', { name: '✎' }).nth(1).click();
//   await page.getByTestId('todo-form-input-title').click();
//   await page.getByTestId('todo-form-input-title').click();
//   await page.getByTestId('todo-form-input-title').fill('Hello 2 edited and again edited');
//   await page.getByTestId('todo-form-input-description').click();
//   await page.getByTestId('todo-form-input-description').press('ArrowLeft');
//   await page.getByTestId('todo-form-input-description').fill('This is a second add test. This item has been edited 2 time. ');
//   await page.getByTestId('todo-form-input-description').press('End');
//   await page.getByTestId('todo-form-input-description').press('ArrowLeft');
//   await page.getByTestId('todo-form-input-description').press('ArrowLeft');
//   await page.getByTestId('todo-form-input-description').fill('This is a second add test. This item has been edited 2 times. ');
//   await page.getByTestId('todo-button').click();
});