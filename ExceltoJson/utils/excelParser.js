// utils/excelParser.js
const XLSX = require('xlsx');

/**
 * Converts Excel buffer to JSON.
 * @param {Buffer} fileBuffer
 * @returns {Array<Object>}
 */
function parseExcelToJson(fileBuffer) {
  const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  return XLSX.utils.sheet_to_json(sheet);
}

module.exports = { parseExcelToJson };
