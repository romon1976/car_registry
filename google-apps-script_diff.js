--- google-apps-script.js (原始)


+++ google-apps-script.js (修改后)
/**
 * Google Apps Script для работы с таблицей регистра автомобилей
 *
 * ИНСТРУКЦИЯ ПО УСТАНОВКЕ:
 *
 * 1. Откройте вашу Google таблицу
 * 2. Перейдите в меню: Расширения → Apps Script
 * 3. Удалите весь существующий код
 * 4. Вставьте этот код целиком
 * 5. Сохраните проект (Ctrl+S)
 * 6. Нажмите "Deploy" → "New deployment"
 * 7. Нажмите на шестерёнку и выберите тип "Web app"
 * 8. Заполните:
 *    - Description: Car Registry API
 *    - Execute as: Me (ваш email)
 *    - Who has access: Anyone
 * 9. Нажмите "Deploy"
 * 10. Скопируйте URL веб-приложения
 * 11. Создайте файл .env в корне проекта:
 *     VITE_GOOGLE_SCRIPT_URL=ваш_URL
 * 12. Пересоберите проект: npm run build
 *
 * СТРУКТУРА ТАБЛИЦЫ (первая строка - заголовки):
 * A: Квартира
 * B: Телефон 1
 * C: Телефон 2
 * D: Г/Н автомобиля (через запятую, если несколько)
 * E: Имя
 * F: Дата обновления
 */

// ID вашей таблицы (автоматически определяется)
function getSheet() {
  return SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
}

// Обработка GET запросов
function doGet(e) {
  var action = e.parameter.action;

  if (action === 'getAll') {
    return getAllRecords();
  }

  return jsonResponse({ success: false, error: 'Unknown action' });
}

// Обработка POST запросов
function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var action = data.action;

    if (action === 'add') {
      return addRecord(data.data);
    } else if (action === 'update') {
      return updateRecord(data.rowIndex, data.data);
    } else if (action === 'delete') {
      return deleteRecord(data.rowIndex);
    }

    return jsonResponse({ success: false, error: 'Unknown action' });
  } catch (error) {
    return jsonResponse({ success: false, error: error.toString() });
  }
}

// Получить все записи
function getAllRecords() {
  var sheet = getSheet();
  var data = sheet.getDataRange().getValues();
  var records = [];

  // Пропускаем заголовки (строки 1 и 2 - заголовок и подзаголовок)
  var startRow = 2; // 0-indexed, третья строка (строка 3 в таблице)

  // Находим строку с заголовками
  for (var i = 0; i < Math.min(data.length, 5); i++) {
    var row = data[i];
    if (row[0] && String(row[0]).toLowerCase().indexOf('квартира') !== -1) {
      startRow = i + 1;
      break;
    }
  }

  for (var i = startRow; i < data.length; i++) {
    var row = data[i];

    // Пропускаем пустые строки
    if (!row[0] && !row[1] && !row[3]) continue;

    var plates = String(row[3] || '').split(/[,;\n]+/).map(function(p) {
      return p.trim();
    }).filter(Boolean);

    records.push({
      apartment: String(row[0] || ''),
      phone1: String(row[1] || ''),
      phone2: String(row[2] || ''),
      plates: plates,
      name: String(row[4] || ''),
      dateUpdated: String(row[5] || ''),
      rowIndex: i + 1 // 1-indexed для Google Sheets
    });
  }

  return jsonResponse({ success: true, data: records });
}

// Добавить новую запись
function addRecord(record) {
  var sheet = getSheet();
  var newRow = [
    record.apartment || '',
    record.phone1 || '',
    record.phone2 || '',
    Array.isArray(record.plates) ? record.plates.join(', ') : (record.plates || ''),
    record.name || '',
    record.dateUpdated || ''
  ];

  sheet.appendRow(newRow);

  return jsonResponse({ success: true, message: 'Record added' });
}

// Обновить запись
function updateRecord(rowIndex, record) {
  var sheet = getSheet();
  var row = parseInt(rowIndex);

  if (row < 1 || row > sheet.getLastRow()) {
    return jsonResponse({ success: false, error: 'Invalid row index' });
  }

  sheet.getRange(row, 1).setValue(record.apartment || '');
  sheet.getRange(row, 2).setValue(record.phone1 || '');
  sheet.getRange(row, 3).setValue(record.phone2 || '');
  sheet.getRange(row, 4).setValue(Array.isArray(record.plates) ? record.plates.join(', ') : (record.plates || ''));
  sheet.getRange(row, 5).setValue(record.name || '');
  sheet.getRange(row, 6).setValue(record.dateUpdated || '');

  return jsonResponse({ success: true, message: 'Record updated' });
}

// Удалить запись
function deleteRecord(rowIndex) {
  var sheet = getSheet();
  var row = parseInt(rowIndex);

  if (row < 1 || row > sheet.getLastRow()) {
    return jsonResponse({ success: false, error: 'Invalid row index' });
  }

  sheet.deleteRow(row);

  return jsonResponse({ success: true, message: 'Record deleted' });
}

// Утилитарная функция для JSON ответа
function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
