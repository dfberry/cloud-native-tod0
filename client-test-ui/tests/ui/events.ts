import { expect } from '@playwright/test';
import { getRow, getRowGuid } from './getPart';
import { expectDeleteDoesntExist } from '../EXPECT/validate';

const debug = process.env.DEBUG || true;

export async function clickButtonOnRow(page, rowNumberInTable, action, timeout) {
    const buttonName = `item-${action}`;
    const rowButton = await page.$(`table > tbody > tr:nth-child(${rowNumberInTable.toString()}) > td > button[data-testid^=${buttonName}]`);
    rowButton.click();

    // wait 1 second
    await page.waitForTimeout(timeout);
}


export async function performRowLevelAction(page, copyData) {

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

export async function performFormAction(page, copyData) {

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