export async function printCurrentTable(debug, page, testName) {
    if (debug) {
      const table = await page.$('table');
      const tableText = await table.innerText();
      console.log(`==${testName}===================================`);
      console.log(tableText);
    }
  }