function doPost(e) {
  // Parse the JSON data from the request
  var data = JSON.parse(e.postData.contents);
  
  // Validate email using regex
  var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(data.email)) {
    return ContentService.createTextOutput(JSON.stringify({ error: "Invalid email address" }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  // Open the spreadsheet by ID or URL
  // var spreadsheet = SpreadsheetApp.openById('1YxJ4a-is9LtlUZ4hTHPUBjsXJxYdIV7ix-3KYE'); // Replace with your Spreadsheet ID
    var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  // Get the first sheet
  var sheet = spreadsheet.getSheets()[0];

  // Check if the headers are already added, if not, add them
  var headers = sheet.getRange(1, 1, 1, 5).getValues()[0];
  if (headers[0] !== 'Email' || headers[1] !== 'Subject' || headers[2] !== 'Body' || headers[3] !== 'Email Sent' || headers[4] !== 'Time') {
    sheet.getRange(1, 1, 1, 5).setValues([['Email', 'Subject', 'Body', 'Email Sent', 'Time']]);
  }

  // Prepare the timestamp
  var timestamp = new Date().toISOString();

  // Send the email and update the status
  var emailSent = "Yes";
  try {
    MailApp.sendEmail(data.email, data.subject, data.body);
  } catch (error) {
    emailSent = "No";
  }

  // Add the data to the next available row
  var nextRow = sheet.getLastRow() + 1;
  sheet.getRange(nextRow, 1, 1, 5).setValues([[data.email, data.subject, data.body, emailSent, timestamp]]);

  // Return a success response
  return ContentService.createTextOutput(JSON.stringify({ success: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

