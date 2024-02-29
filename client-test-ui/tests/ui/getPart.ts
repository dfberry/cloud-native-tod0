
export function getRowIdFromTestDataId(testDataId: string) {
    // given a string like `item-noun-<number>` where number is the last part of the string, return the number
    const splitTestDataId = testDataId.split('-');
    const rowId = splitTestDataId[splitTestDataId.length - 1];
    return rowId;
  }
  export async function getRow(page, rowNumber) {
    const rowNumberInTable = await page.$(`table > tbody > tr:nth-child(${rowNumber.toString()})`);
    return rowNumberInTable;
  }
  export async function getRowGuid(rowNumberInTable) {
    const rowGuidName = await rowNumberInTable.getAttribute('data-testid');
    const rowGuid = getRowIdFromTestDataId(rowGuidName);
    return rowGuid;
  }
