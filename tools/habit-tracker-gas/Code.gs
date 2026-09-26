// «От Фаджра до Витра» — трекер привычек на Google Apps Script.
// Страница: Index.html. Данные: Google-таблица «Трекер привычек — От Фаджра до Витра»,
// лист days (одна строка на дату). Таблица создаётся сама при первом открытии.

const SHEET = 'days';
const HEADER = ['date', 'pct', 'score', 'v', 'updatedAt'];

function doGet(e) {
  if (e && e.parameter && e.parameter.format === 'json') {
    return ContentService.createTextOutput(JSON.stringify(loadDays()))
      .setMimeType(ContentService.MimeType.JSON);
  }
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('От Фаджра до Витра')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1, viewport-fit=cover')
    .addMetaTag('apple-mobile-web-app-title', 'Фаджр–Витр');
}

function spreadsheet_() {
  const props = PropertiesService.getScriptProperties();
  const id = props.getProperty('SS_ID');
  if (id) {
    try { return SpreadsheetApp.openById(id); } catch (err) { /* таблицу удалили — создадим заново */ }
  }
  const ss = SpreadsheetApp.create('Трекер привычек — От Фаджра до Витра');
  props.setProperty('SS_ID', ss.getId());
  return ss;
}

function sheet_() {
  const ss = spreadsheet_();
  let sh = ss.getSheetByName(SHEET);
  if (!sh) {
    sh = ss.getSheets()[0];
    sh.setName(SHEET);
    sh.getRange(1, 1, 1, HEADER.length).setValues([HEADER]).setFontWeight('bold');
    sh.getRange('A:A').setNumberFormat('@'); // дата хранится текстом YYYY-MM-DD
    sh.setFrozenRows(1);
  }
  return sh;
}

function dateKey_(d) {
  return d instanceof Date
    ? Utilities.formatDate(d, Session.getScriptTimeZone(), 'yyyy-MM-dd')
    : String(d);
}

function loadDays() {
  const rows = sheet_().getDataRange().getValues();
  const out = {};
  for (let i = 1; i < rows.length; i++) {
    if (!rows[i][0]) continue;
    try { out[dateKey_(rows[i][0])] = JSON.parse(rows[i][3] || '{}'); } catch (err) {}
  }
  return out;
}

function saveDay(date, v, score, pct) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error('bad date');
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const sh = sheet_();
    const last = sh.getLastRow();
    const dates = last > 1 ? sh.getRange(2, 1, last - 1, 1).getValues().map(r => dateKey_(r[0])) : [];
    const idx = dates.indexOf(date);
    const row = idx >= 0 ? idx + 2 : last + 1;
    sh.getRange(row, 1).setNumberFormat('@');
    sh.getRange(row, 1, 1, HEADER.length)
      .setValues([[date, pct, score, JSON.stringify(v || {}), new Date().toISOString()]]);
  } finally {
    lock.releaseLock();
  }
  return true;
}
