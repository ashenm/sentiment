/**
 * Sentiment
 * A tool to collect formative feedback
 * https://github.com/ashenm/sentiment
 *
 * Ashen Gunaratne
 * mail@ashenm.ml
 *
 */

var SPREADSHEET = SpreadsheetApp.getActiveSpreadsheet();

function doGet (event) {

  return ContentService.createTextOutput(JSON.stringify({
    error: { errors: [{ domain: 'global', reason: 'httpMethodNotAllowed' }], code: 405 }
  })).setMimeType(ContentService.MimeType.JSON);

}

function doPost (event) {

  var COURSE;

  // ensure content
  if (!event.postData)
    return ContentService.createTextOutput(JSON.stringify({
      error: { errors: [{ domain: 'global', reason: 'required' }], code: 400 }
    })).setMimeType(ContentService.MimeType.JSON);

  // handle invalid content
  try {
    var data = JSON.parse(event.postData.contents);
  } catch (e) {
    return ContentService.createTextOutput(JSON.stringify({
      error: { errors: [{ domain: 'global', reason: 'parseError' }], code: 400 }
    })).setMimeType(ContentService.MimeType.JSON);
  }

  // ensure requisites
  if (!(data.course && data.sentiment))
    return ContentService.createTextOutput(JSON.stringify({
      error: { errors: [{ domain: 'global', reason: 'required' }], code: 400 }
    })).setMimeType(ContentService.MimeType.JSON);

  // ensure valid course
  if (!(COURSE = SPREADSHEET.getSheetByName(data.course)))
    return ContentService.createTextOutput(JSON.stringify({
      error: { errors: [{ domain: 'global', reason: 'requestedRangeNotSatisfiable' }], code: 416 }
    })).setMimeType(ContentService.MimeType.JSON);

  // insert feedback
  try {

    // last column will hold timestamp
    var offset = COURSE.getLastColumn() - 1;

    // append record to end
    var insertion = COURSE.getLastRow() + 1;

    // extract headers
    var [headers] = COURSE.getRange(1, 1, 1, offset).getValues();

    // construct insertion data
    var rowData = headers.reduce(function (accumulator, header) {
      return accumulator.concat(data[header] || '');
    }, []);

    // add timestamp
    rowData.push(new Date().toISOString());

    // insert record
    COURSE.appendRow(rowData);

    return ContentService.createTextOutput(JSON.stringify({
      feedback: { row: insertion, code: 201 }
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (e) {

    // handle server errors
    return ContentService.createTextOutput(JSON.stringify({
      error: { errors: [{ domain: 'global', reason: 'backendError' }], code: 500 }
    })).setMimeType(ContentService.MimeType.JSON);

  } finally {

    // commit any pending changes
    SpreadsheetApp.flush();

  }

}
