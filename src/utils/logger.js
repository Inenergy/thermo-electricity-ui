const { Workbook } = require('excel4node');
const { getFileDate } = require('./others');
const path = require('path');

let wb,
  ws,
  fileName,
  headerStyle,
  dataStyle,
  row = 2;

function createFile(fn, headers) {
  fileName = fn + '_';
  wb = new Workbook();
  ws = wb.addWorksheet('Результаты');
  if (!headerStyle) createStyles();
  for (let i = 0; i < headers.length; i++) {
    ws.cell(1, i + 1)
      .string(headers[i])
      .style(headerStyle);
  }
  row = 2;
}

function writeRow(entries) {
  for (let i = 0; i < entries.length; i++) {
    ws.cell(row, i + 1)
      .number(entries[i])
      .style(dataStyle);
  }
  row++;
}

function saveFile(dir, cb) {
  wb.write(path.join(dir, fileName + getFileDate()) + '.xlsx', cb);
}

function createStyles() {
  headerStyle = wb.createStyle({
    font: {
      bold: true,
      color: 'ffffff',
    },
    fill: {
      type: 'pattern',
      patternType: 'solid',
      fgColor: '8bc041',
    },
  });
  headerStyle.border = generateBorders();
  dataStyle = wb.createStyle({
    alignment: {
      horizontal: 'right',
    },
  });
  dataStyle.border = generateBorders();
}

function generateBorders() {
  return ['left', 'right', 'top', 'bottom'].reduce(
    (acc, key) => {
      acc[key] = {
        style: 'thin',
        color: 'black',
      };
      return acc;
    },
    { outline: false }
  );
}

module.exports = {
  writeRow,
  createFile,
  saveFile,
};
