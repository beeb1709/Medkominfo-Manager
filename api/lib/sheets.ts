import { google } from 'googleapis';

const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID || '';
const SHEET_NAME = process.env.GOOGLE_SHEET_NAME || 'submissions';

function getSheetsClient() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  return google.sheets({ version: 'v4', auth });
}

export async function appendRowToSheet(submission: Record<string, any>): Promise<void> {
  if (!SPREADSHEET_ID) return;

  const sheetsClient = getSheetsClient();
  const rowValues = [
    submission.id,
    submission.timestamp,
    submission.sender,
    submission.department,
    submission.picHumas,
    submission.programKerja,
    submission.jenisPengajuan,
    submission.urgency,
    submission.deadline,
    submission.status,
    submission.details || '',
    submission.assetLink || '',
    submission.notes || '',
    submission.pic || '',
  ];

  await sheetsClient.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: `${SHEET_NAME}!A:N`,
    valueInputOption: 'USER_ENTERED',
    insertDataOption: 'INSERT_ROWS',
    requestBody: { values: [rowValues] },
  });
}

export async function ensureSheetHeader(): Promise<void> {
  if (!SPREADSHEET_ID) return;
  const sheetsClient = getSheetsClient();
  const res = await sheetsClient.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `${SHEET_NAME}!A1:N1`,
  });
  if (!res.data.values || res.data.values.length === 0) {
    await sheetsClient.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A1:N1`,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[
          'ID', 'Timestamp', 'Sender', 'Department', 'PIC Humas',
          'Program Kerja', 'Jenis Pengajuan', 'Urgency', 'Deadline',
          'Status', 'Details', 'Asset Link', 'Notes', 'PIC',
        ]],
      },
    });
  }
}
