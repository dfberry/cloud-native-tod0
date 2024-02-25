import { expect } from '@playwright/test';
export async function validateCell(page, copyData, cellType) {
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
  export async function expectDeleteDoesntExist(page, rowId) {
    const rowThatShouldNotExist = await page.$(`table > tbody > tr[data-testid^="item-${rowId}"]`);
    expect(rowThatShouldNotExist).toBeNull();
  }